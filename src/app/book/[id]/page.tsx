import { BookStatusChip } from "@/components/BookStatusChip";
import { supabase } from "@/lib/supabaseClient";
import {
  Card,
  CardContent,
  CardMedia,
  Container,
  Typography,
} from "@mui/material";

type Params = Promise<{ id: string }>;

export default async function BookDetailPage({ params }: { params: Params }) {
  const { id } = await params;

  const { data: book, error } = await supabase
    .from("books")
    .select(
      "title, author, description, genres, publish_date, images, status, owner"
    )
    .eq("id", id)
    .single();

  if (error) {
    return (
      <Container sx={{ mt: "20px" }}>
        <Typography>Ошибка загрузки данных: {error.message}</Typography>
      </Container>
    );
  }

  if (!book) {
    return (
      <Container sx={{ mt: "20px" }}>
        <Typography>Книга не найдена.</Typography>
      </Container>
    );
  }

  return (
    <Container
      sx={{
        mt: "20px",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: "600px",
          display: "flex",
          flexDirection: "column",
          borderRadius: "12px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        }}
      >
        <CardMedia
          component="img"
          height="400px"
          image={book.images ? book.images[0] : "/noimage.jpg"}
          alt={book.title}
        />

        <CardContent
          sx={{
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "10px"
          }}
        >
          <Typography variant="h5">{book.title}</Typography>

          <Typography variant="subtitle1" color="text.secondary">
            <strong>Автор: </strong>
            {book.author}
          </Typography>

          <Typography variant="subtitle1" color="text.secondary">
            <strong>Описание: </strong>
            {book.description}
          </Typography>

          <Typography variant="subtitle1" color="text.secondary">
            <strong>Жанры: </strong>
            {book.genres.join(", ")}
          </Typography>

          <Typography variant="subtitle1" color="text.secondary">
            <strong>Дата публикации: </strong>
            {new Date(book.publish_date).toLocaleDateString()}
          </Typography>

          <BookStatusChip status={book.status} />
        </CardContent>
      </Card>
    </Container>
  );
}
