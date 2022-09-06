import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import { useRouter } from "next/router";

const AuthContext = createContext({
  user: null,
  signUp: async (email: string, password: string) => {},
  signIn: async (email: string, password: string) => {},
  signOut: async () => {},
  error: null,
  loading: false,
});

export const AuthProvider = (props) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active sessions and sets the user
    const session = supabase.auth.session();

    setUser(session?.user ?? null);
    setLoading(false);

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        fetch("/api/auth", {
          method: "POST",
          headers: new Headers({ "Content-Type": "application/json" }),
          credentials: "same-origin",
          body: JSON.stringify({ event, session }),
        }).then((res) => res.json());
        console.log("event", event);
        console.log("session", session);
        setUser(session?.user ?? null);
        setLoading(false);
        if (session === null) router.push("/login");
      }
    );

    return () => {
      listener?.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string) => {
    await supabase.auth
      .signUp({
        email: email,
        password: password,
      })
      .then((response) => {
        if (response?.session) {
          router.push("/");
        }
        if (response?.error) {
          alert(response?.error.message);
        }
      })
      .catch((error) => alert(error.message));
  };

  const signIn = async (email: string, password: string) => {
    await supabase.auth
      .signIn({
        email: email,
        password: password,
      })
      .then((response) => {
        if (response?.session) {
          router.push("/");
        }
        if (response?.error) {
          alert(response?.error.message);
        }
      })
      .catch((error) => alert(error.message));
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/");
  };

  const value = {
    signUp,
    signIn,
    signOut,
    user,
  };
  return <AuthContext.Provider value={value} {...props} />;
};

export default function useAuth() {
  return useContext(AuthContext);
}
