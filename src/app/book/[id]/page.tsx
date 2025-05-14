import { BookStatusChip } from "@/components/BookStatusChip";
import Comments from "@/components/Comments";
import { supabase } from "@/lib/supabaseClient";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Container,
  Divider,
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
          maxWidth: "800px",
          display: "flex",
          flexDirection: "column",
          borderRadius: "12px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          paddingBottom: "20px",
        }}
      >
        <CardMedia
          component="img"
          sx={{
            height: "600px",
            width: "450px",
            objectFit: "cover",
            margin: "0 auto",
          }}
          image={book.images ? book.images[0] : "/noimage.jpg"}
          alt={book.title}
        />

        <CardContent
          sx={{
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {book.title}
          </Typography>

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

          <Typography variant="subtitle1" color="text.secondary">
            <strong>Владелец: </strong>
            {book.owner}
          </Typography>

          <BookStatusChip status={book.status} />
        </CardContent>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ padding: "20px" }}>
          <Typography variant="h5" sx={{ marginBottom: "10px" }}>
            Комментарии:
          </Typography>
          <Comments book_id={id} />
        </Box>
      </Card>
    </Container>
  );
}
