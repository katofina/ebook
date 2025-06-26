"use client";

import { supabase } from "@/lib/supabaseClient";
import { Box, Button, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  id: string;
}

export const DeleteButton = ({ id }: Props) => {
  const [error, setError] = useState<null | string>(null);
  const router = useRouter();

  async function deleteBook() {
    const { data, error } = await supabase.from("books").delete().eq("id", id);

    if (error) setError(error.message);
    else router.replace("/");
  }

  return (
    <Box>
      <Button color="error" onClick={deleteBook}>
        Удалить
      </Button>
      <Typography color="error" sx={{ position: "absolute", left: "50%" }}>
        {error}
      </Typography>
    </Box>
  );
};
