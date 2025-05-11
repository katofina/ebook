import { SALE, SOLD } from "@/constants/constants";
import { BookStatus } from "@/types/types";
import { Chip } from "@mui/material";

interface Prop {
  status: BookStatus;
}

export const BookStatusChip = ({ status }: Prop) => {
  return (
    <Chip
      label={
        status === SALE
          ? "Для продажи"
          : status === SOLD
          ? "Продано"
          : "Для обмена"
      }
      color={status === SOLD ? "warning" : "success"}
      size="medium"
      sx={{ mt: 2, fontSize: "18px", maxWidth: "150px" }}
    />
  );
};
