"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
} from "@mui/material";
import { FormProps, FormValues } from "@/types/types";
import { LOGIN } from "@/constants/constants";
import Link from "next/link";

export default function SignForm({ onSubmit, error, type }: FormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null; //to render only on client to avoid errors

  const isLogin = type === LOGIN;

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
        {isLogin ? "Вход" : "Регистрация"}
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
            {isLogin ? "Войти" : "Зарегистрироваться"}
          </Button>

          {isLogin ? (
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
          ) : (
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
          )}
        </Box>
      </form>
    </Paper>
  );
}
