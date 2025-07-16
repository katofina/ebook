import { Typography } from "@mui/material";
import { OneBook } from "./Book";
import { Book } from "@/types/types";

interface Prop {
  books: Book[];
}

export const AllBooks = ({ books }: Prop) => (
  <div
    style={{
      display: "flex",
      flexWrap: "wrap",
      gap: "16px",
      marginTop: "20px",
    }}
  >
    {books.length ? (
      books.map((book) => <OneBook key={book.id} book={book} />)
    ) : (
      <Typography>Пока здесь ещё нет ни одной книги. Будьте первым!</Typography>
    )}
  </div>
);
