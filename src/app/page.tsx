import { BookStatusChip } from "@/components/BookStatusChip";
import { SALE, SOLD } from "@/constants/constants";
import { supabase } from "@/lib/supabaseClient";
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Chip,
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
            <div key={book.id}>
              <Card
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  width: "320px",
                  position: "relative"
                }}
              >
                <CardMedia
                  component="img"
                  height="240px"
                  image={book.images ? book.images[0] : "/noimage.jpg"}
                  alt={book.title}
                />

                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6">{book.title}</Typography>

                  <Typography
                    variant="subtitle2"
                    gutterBottom
                    color="text.secondary"
                  >
                    <strong>Автор: </strong> {book.author}
                  </Typography>

                  <BookStatusChip status={book.status}/>

                  <Link href={`book/${book.id}`} passHref>
                    <Button
                      sx={{
                        color: "white",
                        backgroundColor: "GrayText",
                        position: "absolute",
                        right: 10,
                        bottom: 10
                      }}
                    >
                      Подробнее
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
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
