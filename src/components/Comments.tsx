"use client";

import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Typography,
} from "@mui/material";
import type { Comment } from "@/types/types";
import { useEffect, useState } from "react";
import { CommentForm } from "./CommentForm";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/context/AuthContext";
import { getAvatar } from "@/functions/getAvatar";
interface Prop {
  book_id: string;
}

export default function Comments({ book_id }: Prop) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [errorDel, setErrorDel] = useState<string | null>(null);
  const { nick } = useAuth();

  const updateComment = async () => {
    const { data, error } = await supabase
      .from("comments")
      .select("id, content, created_at, book_id, user")
      .eq("book_id", book_id)
      .order("created_at", { ascending: false });

    if (data) setComments(data);
    if (error) setError(error.message);
    else setError(null);
  };

  const handleDelete = async (id: string) => {
    const { data, error } = await supabase
      .from("comments")
      .delete()
      .eq("id", id);

    if (error) setErrorDel(error.message);

    updateComment();
  };

  useEffect(() => {
    updateComment();
  }, []);

  return (
    <>
      <CommentForm bookId={book_id} update={updateComment} />
      <Divider sx={{ my: 2 }} />
      {errorDel && (
        <Typography variant="subtitle2" color="error">
          {error}
        </Typography>
      )}
      <Typography variant="h5" sx={{ marginBottom: "10px" }}>
        Комментарии:
      </Typography>
      {error && (
        <Typography>Ошибка при загрузке комментариев: {error}</Typography>
      )}
      {(!comments || comments.length === 0) && (
        <Typography>
          Нет комментариев. Вы можете оставить его первым.
        </Typography>
      )}
      {comments.map((item) => (
        <Card key={item.id} sx={{ marginBottom: "10px" }}>
          <CardContent
            sx={{ display: "flex", flexDirection: "column", gap: "15px" }}
          >
            <Box sx={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <Avatar src={getAvatar(item.user)} />
              <Typography variant="h5">{item.user}</Typography>
            </Box>
            <Typography variant="body2" color="text.primary">
              {item.content}
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography
                variant="subtitle2"
                sx={{ textDecorationLine: "underline" }}
              >
                {new Date(item.created_at).toLocaleDateString()}
              </Typography>

              {nick === item.user ? (
                <Button
                  size="small"
                  variant="contained"
                  color="error"
                  onClick={() => handleDelete(item.id)}
                >
                  Удалить
                </Button>
              ) : null}
            </Box>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
