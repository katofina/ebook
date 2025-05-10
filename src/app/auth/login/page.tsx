"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import SignForm from "@/components/SignForm";
import { LOGIN } from "@/constants/constants";

export default function LoginPage() {
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    setError("");
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      router.push("/");
    }
  };

  return <SignForm onSubmit={handleLogin} error={error} type={LOGIN} />;
}
