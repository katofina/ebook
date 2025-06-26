"use client";

import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import { BookStatusChip } from "./BookStatusChip";
import Link from "next/link";
import { Book } from "@/types/types";
import { useAuth } from "@/context/AuthContext";
import IsOwner from "@/functions/IsOwner";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

interface Prop {
  book: Book;
}

export const OneBook = ({ book }: Prop) => {
  const { session } = useAuth();
  const [isOwner, setIsOwner] = useState(false);
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  useEffect(() => {
    if (session) {
      IsOwner(session.user.email!, book.owner).then((val) => setIsOwner(val));
    } else setIsOwner(false);
  }, [session]);

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "320px",
        position: "relative",
        border: isOwner ? "3px solid #5dded3" : "none",
      }}
    >
      <CardMedia
        component="img"
        height="240px"
        image={book.images ? book.images[0] : "/noimage.jpg"}
        alt={book.title}
      />

      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6">{book.title}</Typography>

        <Typography variant="subtitle2" gutterBottom color="text.secondary">
          <strong>Автор: </strong> {book.author}
        </Typography>

        <BookStatusChip status={book.status} />

        <Link
          href={`book/${book.id}/${String(isOwner)}`}
          passHref
        >
          <Button
            sx={{
              color: "white",
              backgroundColor: "GrayText",
              position: "absolute",
              right: 10,
              bottom: 10,
            }}
          >
            Подробнее
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};
