import { SignOutButton } from "@/components/SignOutButton";
import { supabase } from "@/lib/supabaseClient";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import Link from "next/link";

type Params = Promise<{ slug: string }>;
interface Prop {
  params: Params;
}

export default async function ProfilePage({ params }: Prop) {
  const { slug } = await params;
  const { data } = await supabase
    .from("users")
    .select("avatar_url")
    .eq("nickname", slug)
    .single();
  const avatarURL = data ? data.avatar_url : "/avatar.svg";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        padding: "10px",
        gap: "20px",
      }}
    >
      <Typography fontSize="1.5em" sx={{ alignSelf: "flex-start" }}>
        Ваш профиль:
      </Typography>
      <Card sx={{ width: "80%" }}>
        <CardContent
          sx={{ display: "flex", gap: "50px", alignItems: "center" }}
        >
          <Avatar
            src={avatarURL}
            alt="avatar"
            sx={{ width: "100px", height: "100px" }}
          />
          <Typography variant="h4">{slug}</Typography>
        </CardContent>
      </Card>

      <Link href={`/mybooks/${slug}`} passHref>
        <Button color="info" variant="outlined">
          Посмотреть все ваши книги
        </Button>
      </Link>
      <Link href={`/profile/${slug}/edit`} passHref>
        <Button color="info" variant="outlined">
          Обновить аватар
        </Button>
      </Link>
      <SignOutButton color="error" variant="outlined" />
    </Box>
  );
}
