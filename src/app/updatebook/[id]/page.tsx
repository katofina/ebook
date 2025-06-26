import { BookForm } from "@/components/BookForm";
import getBookByID from "@/functions/getBookByID";
import { Book } from "@/types/types";
import { Typography } from "@mui/material";

type Params = Promise<{ id: string }>;

export default async function EditBookPage({ params }: { params: Params }) {
  const { id } = await params;

  const { book, error } = await getBookByID(id);

  if (error) return <Typography>Упс, что-то пошло не так.</Typography>;

  if (book) return <BookForm defaultValues={book as Book} />;
}
