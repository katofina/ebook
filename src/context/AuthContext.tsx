"use client";

import { supabase } from "@/lib/supabaseClient";
import { Session } from "@supabase/supabase-js";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

interface Context {
  session: Session | null;
  isLoading: boolean;
  nick: string | null;
}

const AuthContext = createContext<Context>({
  isLoading: true,
  session: null,
  nick: null,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [session, setSession] = useState<Context>({
    isLoading: true,
    session: null,
    nick: null,
  });

  const updateNick = async () => {
    if (session) {
      const { data: dataNick } = await supabase
        .from("users")
        .select("nickname")
        .eq("email", session.session?.user.email)
        .single();
      setSession((prev) => {
        return { ...prev, nick: dataNick?.nickname };
      });
    }
  };

  useEffect(() => {
    if (session) updateNick();
  }, [session.session])

  useEffect(() => {
    const getSessionAsync = async () => {
      const { data: currentSession } = await supabase.auth.getSession();
      const { data: dataNick } = await supabase
        .from("users")
        .select("nickname")
        .eq("email", currentSession.session?.user.email)
        .single();
      setSession({
        isLoading: false,
        session: currentSession.session,
        nick: dataNick?.nickname,
      });
    };

    getSessionAsync();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_, session) => {
        setSession((prev) => {
          return { ...prev, session };
        });
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={session}>{children}</AuthContext.Provider>
  );
};
