import { Box, Button, Container, Typography } from "@mui/material";
import Link from "next/link";

export default function NotFound() {
  return (
    <Container
      sx={{
        margin: "10px",
        textAlign: "center",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        color: "#333",
        backgroundColor: "#f4f4f4",
        padding: "20px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "30px",
          borderRadius: "10px",
          boxShadow: 3,
          backgroundColor: "#ffffff",
        }}
      >
        <Typography
          variant="h1"
          sx={{ fontWeight: "bold", fontSize: "6rem" }}
        >
          404
        </Typography>

        <Typography
          variant="h5"
          sx={{ marginBottom: "20px", fontWeight: 400, color: "#757575" }}
        >
          Страница не найдена
        </Typography>

        <Link href="/" passHref>
          <Button
            variant="contained"
            color="primary"
            sx={{
              textTransform: "none",
              padding: "12px 24px",
              fontSize: "16px",
              backgroundColor: "#D47C3C",
            }}
          >
            Вернуться на главную
          </Button>
        </Link>
      </Box>
    </Container>
  );
}
