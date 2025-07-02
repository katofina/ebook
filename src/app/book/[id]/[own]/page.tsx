import { BookStatusChip } from "@/components/BookStatusChip";
import { CommentForm } from "@/components/CommentForm";
import Comments from "@/components/Comments";
import { DeleteButton } from "@/components/DeleteButton";
import getBookByID from "@/functions/getBookByID";
import { supabase } from "@/lib/supabaseClient";
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  CardMedia,
  Container,
  Divider,
  Typography,
} from "@mui/material";
import Link from "next/link";

type Params = Promise<{ id: string; own: string }>;

export default async function BookDetailPage({ params }: { params: Params }) {
  const { id, own } = await params;

  const isOwner = own === "true" ? true : false;

  const { book, error } = await getBookByID(id);

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

          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <BookStatusChip status={book.status} />
            {isOwner && (
              <ButtonGroup>
                <Link href={`/updatebook/${id}`} passHref>
                  <Button>Редактировать</Button>
                </Link>
                <DeleteButton id={id} />
              </ButtonGroup>
            )}
          </Box>
        </CardContent>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ padding: "0 20px" }}>
          <Comments book_id={id} />
        </Box>
      </Card>
    </Container>
  );
}
