"use client";

import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { Book, BookStatus } from "@/types/types";
import { EXCHANGE, genresAll, SALE, SOLD } from "@/constants/constants";
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
import { CloudUpload } from "@mui/icons-material";

interface FormData {
  title: string;
  author: string;
  description: string;
  genres: string[];
  images: string[];
  status: BookStatus;
}

interface Prop {
  defaultValues: Book;
}

export const BookForm = ({ defaultValues }: Prop) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control,
  } = useForm<Book>();
  console.log(defaultValues);

  const { isLoading, session, nick } = useAuth();
  const [error, setError] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState<string | null>(defaultValues?.images[0]);

  const handleCoverChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;

    if (file) {
      setFile(file);
      setUrl(URL.createObjectURL(file));
    }
  };

  const router = useRouter();

  if (isLoading) return <Typography>Loading...</Typography>;

  if (!session)
    return (
      <Typography>
        Для того, чтобы добавить книгу вам надо войти или зарегистрироваться!
      </Typography>
    );

  const genres = watch("genres", []);

  const onSubmit = async (data: FormData) => {
    let coverUrl = "";
    if (file && nick) {
      const filePath = `${nick}/${data.title}`;
      const { error } = await supabase.storage
        .from("covers")
        .update(filePath, file);

      if (error) {
        console.error(error);
        setError("Ошибка загрузки обложки");
        return;
      }

      coverUrl = supabase.storage.from("covers").getPublicUrl(filePath)
        .data.publicUrl;
    }

    const newBook = {
      ...data,
      owner: nick,
      images: [coverUrl],
      publish_date: new Date(),
    };

    const { data: bookData, error } = await supabase
      .from("books")
      .update([newBook])
      .eq("id", defaultValues.id)
      .select();
    if (error) setError(error.message);
    else router.replace(`/book/${bookData[0].id}/true`);
  };

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
          value={defaultValues?.title}
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
          value={defaultValues?.author}
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
          value={defaultValues?.description}
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
            value={genres || defaultValues?.genres || []}
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
            defaultValue={defaultValues?.status || SALE}
            rules={{ required: "Поле обязательно для заполнения" }}
            render={({ field }) => (
              <Select {...field} label="Статус">
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
          {defaultValues ? "Редактировать книгу" : "Добавить книгу"}
        </Button>
      </div>
    </form>
  );
};
