import { useAtom } from "jotai";
import Image from "next/image";
import { sortType, paginatedTrades } from "src/atoms";

import TradeHeader from "./TradeHeader";

export const TradeTable = () => {
  const [trades] = useAtom(paginatedTrades);
  useAtom(sortType);

  return (
    <div className="overflow-x-auto w-full  max-h-[46rem] mt-28 mb-5">
      {trades.length ? (
        <table data-theme="" className="table table-zebra w-full">
          <thead>
            <tr>
              <th>
                <TradeHeader label="symbol" value="symbol" />
              </th>
              <th>
                <TradeHeader label="Date/Time" value="date" />
              </th>
              <th>
                <TradeHeader label="Volume Traded" value="quantity" />
              </th>
              <th>
                <TradeHeader label="Price" value="trade_price" />
              </th>
              <th>
                <TradeHeader label="PnL" value="pnl_realized" />
              </th>
            </tr>
          </thead>
          <tbody>
            {trades.map((trade) => (
              <tr key={trade.id} className="hover cursor-pointer">
                <td>
                  {trade.symbol}
                  <br />
                  <span className="badge badge-sm badge-ghost">
                    {trade.contract_id}
                  </span>
                </td>
                <td> {trade.date_time.replace("T", " ")}</td>
                <td className="">{trade.quantity}</td>
                <td>{trade.trade_price}</td>
                <td
                  className={`${
                    trade.pnl_realized > 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {trade.pnl_realized != 0 && (
                    <div> {trade.pnl_realized.toFixed(2)}</div>
                  )}
                </td>
                <th>
                  <button className="btn btn-ghost btn-xs">View</button>
                </th>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="flex flex-col items-center -space-y-10">
          <Image
            src="https://rsuite-admin-template.vercel.app/d6adac113dc4b6b20658fd12c480f4e4.svg"
            alt="No Data"
            layout="fixed"
            width={400}
            height={500}
          />
          <div className="animate-pulse text-white">No Trades Found</div>
        </div>
      )}
    </div>
  );
};
