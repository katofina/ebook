import { supabase } from "@/lib/supabaseClient";

export const getAvatar = (nick: string) => {
  const filePath = `avatars/${nick}`;
  const avatarURL = supabase.storage.from("avatars").getPublicUrl(filePath)
    .data.publicUrl;
  const defaultAvatar = "/avatar.svg";
  return avatarURL ? avatarURL : defaultAvatar;
};
