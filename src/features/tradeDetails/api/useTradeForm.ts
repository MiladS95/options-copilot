import { useState, useEffect } from "react";

import { TradeTag } from "@/interfaces/trade";
import { supabase } from "@/utils/supabaseClient";

import { useDeleteTradeTags } from "../../tags/api/useDeleteTradeTags";
import { useAddTradeDetails } from "./useAddTradeDetails";

const useTradeForm = (formState: TradeTag[]) => {
  const { id } = supabase.auth.user();

  const [formData, setFormData] = useState({
    setup: formState.filter((tag) => tag.tag_type === "setup") ?? [],
    mistake: formState.filter((tag) => tag.tag_type === "mistake") ?? [],
    custom: formState.filter((tag) => tag.tag_type === "custom") ?? [],
    loading: false,
    toggle: true,
  });

  const { mutate, isSuccess } = useAddTradeDetails();
  const { mutate: removeTag } = useDeleteTradeTags();

  useEffect(() => {
    if (isSuccess) {
      setFormData({
        ...formData,
        loading: false,
        toggle: true,
      });
    }
  }, [isSuccess]);

  const handleDataChange = (
    data: TradeTag[],
    type: "setup" | "mistake" | "custom"
  ) => {
    setFormData({ ...formData, [type]: data, toggle: false });
  };

  const handleDataSubmit = (
    contractId: number | string | string[],
    tradeDate: string,
    savedTags: TradeTag[]
  ) => {
    setFormData({
      ...formData,
      loading: true,
    });
    const flattenTradeTags = formData.setup
      .concat(formData.mistake, formData.custom)
      .map((tag) => ({
        contract_id: contractId,
        date: tradeDate,
        user_id: id,
        tag_id: tag.tag_id,
      }));

    const tagsToRemove = savedTags
      .filter(
        ({ tag_id: tagId }) =>
          !flattenTradeTags.some(
            ({ tag_id: contractTagId }) => tagId === contractTagId
          )
      )
      .map((data) => data.tag_id);

    if (tagsToRemove.length !== 0) {
      tagsToRemove.forEach((tagId) =>
        removeTag({
          contract_id: contractId,
          tag_id: tagId,
          date: tradeDate,
        })
      );
    }

    mutate(flattenTradeTags);
  };

  return { formData, handleDataChange, handleDataSubmit };
};

export default useTradeForm;
