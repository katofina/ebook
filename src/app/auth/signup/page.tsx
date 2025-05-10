"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { SIGNUP, WARNING } from "@/constants/constants";
import SignForm from "@/components/SignForm";
export default function SignUpPage() {
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignUp = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    setError("");
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      router.push("/auth/login");
    }
  };

  return <SignForm onSubmit={handleSignUp} error={error} type={SIGNUP}/>;
}
