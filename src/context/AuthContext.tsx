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
}

const AuthContext = createContext<Context>({isLoading: true, session: null});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [session, setSession] = useState<Context>({isLoading: true, session: null});

  useEffect(() => {
    const getSessionAsync = async () => {
      const { data: currentSession } = await supabase.auth.getSession();
      setSession({isLoading: false, session: currentSession.session});
    };

    getSessionAsync();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_, session) => setSession((prev) => { return {...prev, session}})
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={session}>{children}</AuthContext.Provider>
  );
};
