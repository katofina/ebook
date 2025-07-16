import { AllBooks } from "@/components/AllBooks";
import { supabase } from "@/lib/supabaseClient";
import { Book } from "@/types/types";
import { Box, Typography } from "@mui/material";

type Params = Promise<{ nick: string }>;
type Prop = {
  params: Params;
};

export default async function MyBooksPage({ params }: Prop) {
  const { nick } = await params;

  const { data: books, error } = await supabase
    .from("books")
    .select(
      "id, title, author, description, genres, publish_date, images, status, owner"
    )
    .eq("owner", nick);

  return (
    <Box sx={{ padding: "20px" }}>
      <Typography variant="h4">Ваши книги:</Typography>
      {books && <AllBooks books={books as Book[]} />}
      {error && <Typography>{error.message}</Typography>}
    </Box>
  );
}
