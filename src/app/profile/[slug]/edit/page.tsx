"use client";

import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { CloudUpload } from "@mui/icons-material";
import {
  Box,
  IconButton,
  Button,
  Avatar,
  Card,
  Alert,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ChangeAvatarPage() {
  const [error, setError] = useState("");
  const [url, setUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const { nick } = useAuth();
  const router = useRouter();

  const updateAvatar = async () => {
    let avatarUrl = "";
    if (file) {
      const filePath = `${nick}/${Date.now()}`;
      const { error } = await supabase.storage
        .from("avatars")
        .update(filePath, file);

      const { data: user } = await supabase
        .from("users")
        .select("*")
        .eq("nickname", nick)
        .single();

      if (error) {
        console.error(error);
        setError("Ошибка загрузка аватара");
        return;
      }

      avatarUrl = supabase.storage.from("avatars").getPublicUrl(filePath)
        .data.publicUrl;
      const newDataForUser = { ...user, avatar_url: avatarUrl };

      const { error: userUpdateError } = await supabase
        .from("users")
        .update(newDataForUser)
        .eq("nickname", nick)
        .select();
    }
    router.push(`/profile/${nick}`);
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;

    if (file) {
      setFile(file);
      setUrl(URL.createObjectURL(file));
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "100px",
      }}
    >
      <Card
        sx={{
          width: "600px",
          height: "300px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-around",
        }}
      >
        <Typography variant="h5">Выберите изображение:</Typography>
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
        </Box>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        <Button color="success" variant="outlined" onClick={updateAvatar}>
          Изменить
        </Button>
      </Card>
    </Box>
  );
}
