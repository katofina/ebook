import { supabase } from "@/lib/supabaseClient";

export default async function getBookByID(id: string) {
  const { data: book, error } = await supabase
    .from("books")
    .select(
      "title, author, description, genres, publish_date, images, status, owner"
    )
    .eq("id", id)
    .single();

  return {book, error};
}
