"use client";

import { supabase } from "@/lib/supabaseClient";
import { Button, ButtonProps } from "@mui/material";
import Link from "next/link";

export const SignOutButton = (props: ButtonProps) => {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <Link href="/auth/login" replace passHref>
      <Button {...props} onClick={handleLogout}>
        Выйти
      </Button>
    </Link>
  );
};
