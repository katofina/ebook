import { supabase } from "@/lib/supabaseClient";

export default async function IsOwner(email: string, owner: string) {
  const { data } = await supabase
    .from("users")
    .select(
      "nickname"
    ).eq("email", email).single();
  if (data) {
    if (data.nickname === owner) return true;
  }
  return false;
};
