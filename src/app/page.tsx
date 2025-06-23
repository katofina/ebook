import { OneBook } from "@/components/Book";
import { supabase } from "@/lib/supabaseClient";
import {
  Container,
  Typography,
  Button,
} from "@mui/material";
import Link from "next/link";

export const revalidate = 300;

export default async function HomePage() {
  const { data: books, error } = await supabase
    .from("books")
    .select(
      "id, title, author, description, genres, publish_date, images, status, owner"
    );

  if (error)
    return (
      <Container sx={{ mt: 4 }}>
        <Typography color="error">
          Ошибка загрузки данных: {error.message}
        </Typography>
      </Container>
    );

  return (
    <Container sx={{ margin: "10px" }}>
      <Typography
        variant="subtitle1"
        sx={{
          backgroundColor: "#FFFAF0",
          padding: "12px 20px",
          borderRadius: "8px",
          boxShadow: "4px 4px 6px rgba(0, 0, 0, 0.1)",
          fontSize: "18px",
          marginBottom: "20px",
        }}
        color="text.primary"
      >
        Здесь вы можете публиковать книги для обмена или продажи, просматривать
        книги других и оставлять комментарии.
      </Typography>

      <Link href="/addbook" passHref>
        <Button
          variant="contained"
          sx={{
            margin: "10px",
            backgroundColor: "#D47C3C",
            fontSize: "16px",
            color: "white",
            textTransform: "none",
            padding: "10px 20px",
          }}
        >
          Добавить книгу
        </Button>
      </Link>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "16px",
          marginTop: "20px",
        }}
      >
        {books.length ? (
          books.map((book) => (
            <OneBook key={book.id} book={book}/>
          ))
        ) : (
          <Typography>
            Пока здесь ещё нет ни одной книги. Будьте первым!
          </Typography>
        )}
      </div>
    </Container>
  );
}
