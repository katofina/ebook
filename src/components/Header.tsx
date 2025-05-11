"use client";

import { supabase } from "@/lib/supabaseClient";
import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const Header = () => {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (data) setIsLogin(!!data.session);
      setLoading(false);
    };

    checkAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_, session) => setIsLogin(!!session)
    );

    return () => authListener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

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
        {!loading && (
          <Box>
            {isLogin ? (
              <>
                <Link href="/profile" passHref>
                  <Button color="inherit" sx={{ marginRight: 2 }}>
                    Профиль
                  </Button>
                </Link>
                <Button color="inherit" onClick={handleLogout}>
                  Выйти
                </Button>
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
