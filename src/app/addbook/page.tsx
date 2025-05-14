"use client";

import { EXCHANGE, genresAll, SALE, SOLD } from "@/constants/constants";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { Book, BookStatus } from "@/types/types";
import { CloudUpload } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

interface FormData {
  title: string;
  author: string;
  description: string;
  genres: string[];
  images: string[];
  status: BookStatus;
}

export default function BookForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control,
  } = useForm<Book>();

  const { isLoading, session } = useAuth();
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const router = useRouter();

  const genres = watch("genres", []);

  const onSubmit = async (data: FormData) => {
    const { data: dataNick } = await supabase
      .from("users")
      .select("nickname")
      .eq("email", session?.user.email)
      .single();

    let coverUrl = "";
    if (file && dataNick) {
      const filePath = `covers/${dataNick.nickname}/${data.title}`;
      const { error } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (error) {
        console.error(error);
        setError("Ошибка загрузки обложки");
        return;
      }

      coverUrl = supabase.storage.from("avatars").getPublicUrl(filePath)
        .data.publicUrl;
    }

    const newBook = {
      ...data,
      owner: dataNick?.nickname,
      images: [coverUrl],
      publish_date: new Date(),
    };

    const { data: bookData, error } = await supabase.from("books").insert([newBook]).select();
    if (error) setError(error.message)
    else router.replace(`/book/${bookData[0].id}`);
  };

  const handleCoverChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;

    if (file) {
      setFile(file);
      setUrl(URL.createObjectURL(file));
    }
  };

  if(isLoading) return <Typography>Loading...</Typography>;

  if (!session)
    return (
      <Typography>
        Для того, чтобы добавить книгу вам надо войти или зарегистрироваться!
      </Typography>
    );

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}
    >
      <div style={{ marginBottom: "15px" }}>
        <TextField
          label="Название книги"
          fullWidth
          required
          {...register("title", {
            required: "Поле обязательно для заполнения",
          })}
          error={!!errors.title}
          helperText={errors.title?.message}
        />
      </div>

      <div style={{ marginBottom: "15px" }}>
        <TextField
          label="Автор"
          fullWidth
          required
          {...register("author", {
            required: "Поле обязательно для заполнения",
          })}
          error={!!errors.author}
          helperText={errors.author?.message}
        />
      </div>

      <div style={{ marginBottom: "15px" }}>
        <TextField
          label="Описание"
          fullWidth
          multiline
          rows={4}
          required
          {...register("description", {
            required: "Поле обязательно для заполнения",
          })}
          error={!!errors.description}
          helperText={errors.description?.message}
        />
      </div>

      <div style={{ marginBottom: "15px" }}>
        <FormControl fullWidth required error={!!errors.genres}>
          <InputLabel>Жанры</InputLabel>
          <Select
            multiple
            label="Жанры"
            {...register("genres", {
              required: "Поле обязательно для заполнения",
            })}
            value={genres || []}
            onChange={(e) => setValue("genres", e.target.value as string[])}
          >
            {genresAll.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      <Box textAlign="center" sx={{ display: "flex", mb: 2 }}>
        <input
          type="file"
          accept="image/*"
          onChange={handleCoverChange}
          style={{ display: "none" }}
          id="cover"
        />
        <label htmlFor="cover">
          Добавьте обложку книги:
          <IconButton component="span">
            <CloudUpload />
          </IconButton>
        </label>
        {url && (
          <img
            src={url}
            style={{
              width: 200,
              height: 200,
              objectFit: "cover",
            }}
          />
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      <div style={{ marginBottom: "15px" }}>
        <FormControl fullWidth required error={!!errors.status}>
          <InputLabel>Статус</InputLabel>
          <Controller
            name="status"
            control={control}
            defaultValue={SALE}
            rules={{ required: "Поле обязательно для заполнения" }}
            render={({ field }) => (
              <Select
                {...field}
                label="Статус"
              >
                <MenuItem value={SALE}>Для продажи</MenuItem>
                <MenuItem value={SOLD}>Продано</MenuItem>
                <MenuItem value={EXCHANGE}>Для обмена</MenuItem>
              </Select>
            )}
          ></Controller>
        </FormControl>
      </div>

      <div>
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Добавить книгу
        </Button>
      </div>
    </form>
  );
}
