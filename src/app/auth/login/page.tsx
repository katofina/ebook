"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  Alert,
  Box,
  Button,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import Link from "next/link";

interface FormValues {
  email: string;
  password: string;
}

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const [error, setError] = useState("");
  const router = useRouter();

  const onSubmit = async ({ email, password }: FormValues) => {
    setError("");
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      router.push("/");
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
        Вход
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
            Войти
          </Button>

          <Typography
            variant="body2"
            align="center"
            style={{ marginTop: "1rem" }}
          >
            Нет аккаунта?{" "}
            <Link
              href="/auth/signup"
              style={{
                textDecoration: "underline",
                color: "blue",
              }}
            >
              Зарегистрируйтесь
            </Link>
          </Typography>
        </Box>
      </form>
    </Paper>
  );
}
