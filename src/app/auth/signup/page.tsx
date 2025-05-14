"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  Alert,
  Avatar,
  Box,
  Button,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { CloudUpload } from "@mui/icons-material";

interface FormValues {
  email: string;
  password: string;
  nickname: string;
  avatar: File | null;
}

export default function SignUpPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const [error, setError] = useState("");
  const [url, setUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const router = useRouter();

  const checkNickname = async (nickname: string) => {
    const { data, error } = await supabase
      .from("users")
      .select("id")
      .eq("nickname", nickname);

    if (error) return false; //if error - free
    return data.length > 0; //if there is smth - busy
  };

  const onSubmit = async ({ email, password, nickname }: FormValues) => {
    setError("");

    const isNickExisted = await checkNickname(nickname);
    if (isNickExisted) {
      setError("Такой никнейм уже занят, придумайте другой.");
      return;
    };

    let avatarUrl = "";
    if (file) {
      const filePath = `avatars/${nickname}`;
      const { error } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (error) {
        console.error(error)
        setError("Ошибка загрузка аватара");
        return;
      }

      avatarUrl = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath).data.publicUrl;
    };

    const { error: uploadError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (uploadError) {
      setError(uploadError.message);
    } else {
      const { error: updateError } = await supabase
        .from("users")
        .insert([{ email, nickname, avatar_url: avatarUrl }]);

      if (updateError) setError("Ошибка при сохранении информации");
      else router.push("/");
    }
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;

    if (file) {
      setFile(file);
      setUrl(URL.createObjectURL(file));
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        padding: 4,
        maxWidth: 400,
        margin: "auto",
        mt: 8,
        borderRadius: 3,
      }}
    >
      <Typography variant="h5" align="center" mb={3}>
        Регистрация
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <TextField
          label="Email"
          fullWidth
          type="email"
          margin="normal"
          {...register("email", {
            required: "Email обязателен",
            pattern: {
              value: /^\S+@\S+$/i,
              message: "Неверный формат email",
            },
          })}
          error={!!errors.email}
          helperText={errors.email?.message}
        />

        <TextField
          label="Пароль"
          fullWidth
          type="password"
          margin="normal"
          {...register("password", {
            required: "Пароль обязателен",
            minLength: {
              value: 6,
              message: "Минимум 6 символов",
            },
          })}
          error={!!errors.password}
          helperText={errors.password?.message}
        />

        <TextField
          label="Никнейм"
          fullWidth
          margin="normal"
          {...register("nickname", {
            required: "Никнейм обязателен",
            minLength: {
              value: 6,
              message: "Минимум 6 символов",
            },
          })}
          error={!!errors.nickname}
          helperText={errors.nickname?.message}
        />

        <Box textAlign="center">
          {url && (
            <Avatar
              alt="avatar"
              src={url}
              sx={{
                width: 100,
                height: 100,
              }}
            />
          )}

          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            style={{ display: "none" }}
            id="avatar"
          />
          <label htmlFor="avatar">
            <IconButton component="span">
              <CloudUpload />
            </IconButton>
          </label>

          <Typography>
            Вы можете загрузить аватар. Затем его можно будет поменять в
            профиле.
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        <Box mt={3}>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            color="primary"
            size="large"
          >
            Зарегистрироваться
          </Button>

          <Typography
            variant="body2"
            align="center"
            style={{ marginTop: "1rem" }}
          >
            Уже есть аккаунт?{" "}
            <Link
              href="/auth/login"
              style={{
                textDecoration: "underline",
                color: "blue",
              }}
            >
              Войти
            </Link>
          </Typography>
        </Box>
      </form>
    </Paper>
  );
}
