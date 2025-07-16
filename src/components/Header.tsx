"use client";

import { useAuth } from "@/context/AuthContext";
import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SignOutButton } from "./SignOutButton";

export const Header = () => {
  const router = useRouter();
  const { isLoading, session, nick } = useAuth();

  return (
    <AppBar position="static" sx={{ backgroundColor: "#D47C3C" }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          <Link href="/" passHref>
            <Button
              color="inherit"
              sx={{ textTransform: "none", fontSize: "24px" }}
            >
              EBook Platform
            </Button>
          </Link>
        </Typography>
        {!isLoading && (
          <Box>
            {session ? (
              <>
                <Link href={`/profile/${nick}`} passHref>
                  <Button color="inherit" sx={{ marginRight: 2 }}>
                    Профиль
                  </Button>
                </Link>
                <SignOutButton color='inherit'/>
              </>
            ) : (
              <>
                <Link href="/auth/login" passHref>
                  <Button color="inherit" sx={{ marginRight: 2 }}>
                    Войти
                  </Button>
                </Link>

                <Link href="/auth/signup" passHref>
                  <Button color="inherit">Регистрация</Button>
                </Link>
              </>
            )}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};
