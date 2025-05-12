import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent, Typography } from "@mui/material";

interface Prop {
  book_id: string;
}

export default async function Comments({ book_id }: Prop) {
  const { data: comments, error } = await supabase
    .from("comments")
    .select("id, content, created_at, book_id, user")
    .eq("book_id", book_id)
    .order("created_at", { ascending: false });

  if (error)
    return (
      <Typography>Ошибка при загрузке комментариев: {error.message}</Typography>
    );

  if (!comments || comments.length === 0)
    return (
      <Typography>Нет комментариев. Вы можете оставить его первым.</Typography>
    );

  return (
    <>
      {comments.map((item) => (
        <Card key={item.id}>
          <CardContent
            sx={{ display: "flex", flexDirection: "column", gap: "15px" }}
          >
            <Typography color="text.secondary">{item.user}</Typography>
            <Typography variant="h5" color="text.primary">
              {item.content}
            </Typography>
            <Typography variant="subtitle2">
              {new Date(item.created_at).toLocaleDateString()}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
