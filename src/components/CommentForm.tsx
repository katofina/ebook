"use client";

import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface FormData {
  text: string;
}

interface Prop {
  bookId: string;
  update: () => void;
}

export const CommentForm = ({ bookId, update }: Prop) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FormData>();

  const { session, nick } = useAuth();
  const [error, setError] = useState("");

  const onSubmit = async (data: FormData) => {
    const isNotEmpty = Boolean(data.text.trim() || data.text.length !== 0);

    if (isNotEmpty) {
      const newComment = {
        created_at: new Date(),
        user: nick,
        content: data?.text,
        book_id: bookId,
      };
      const { data: comment, error } = await supabase
        .from("comments")
        .insert(newComment)
        .select();
      if (error) setError(error.message)
      else setError("");
    }
    reset();
    update();
  };

  if (!session)
    return (
      <Typography>
        Чтобы оставить комментарий вам надо войти или зарегистрироваться
      </Typography>
    );

  return (
    <form
      style={{ width: '100%', padding: "0 20px" }}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Typography variant="h6">Вы можете оставить комментарий:</Typography>

      <Box display='flex' marginBlockStart='10px'>
        <TextField
          label="Введите комментарий"
          fullWidth
          required
          {...register("text", {
            required: "Поле обязательно для заполнения",
          })}
          error={!!errors.text}
        />
        <Button color='info' variant="contained" type="submit">Отправить</Button>
      </Box>
      {error && (
        <Typography variant="subtitle2" color="error">
          {error}
        </Typography>
      )}
    </form>
  );
};
