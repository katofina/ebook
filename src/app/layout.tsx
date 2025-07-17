import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { Header } from "@/components/Header";
import { AuthProvider } from "@/context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Платформа для обмена книгами | Book Exchange Platform",
  description:
    "Обменивайтесь и продавайте книги с другими читателями. Регистрируйтесь, публикуйте книги, находите интересные издания и общайтесь в комментариях.",
  keywords: [
    "обмен книгами",
    "продажа книг",
    "букинистика",
    "книжная платформа",
    "обмен литературой",
    "book exchange",
    "book trading",
    "book marketplace",
  ],
  authors: [{ name: "Book Exchange Team" }],
  openGraph: {
    title: "Платформа для обмена книгами",
    description:
      "Публикуйте книги, ищите интересные предложения и общайтесь с другими читателями.",
    siteName: "Book Exchange Platform",
    locale: "ru_RU",
    type: "website",
  }, // can add url when it will be deployed
  twitter: {
    card: "summary_large_image",
    title: "Платформа для обмена книгами",
    description:
      "Обменивайтесь и продавайте книги с другими пользователями. Общайтесь и находите новые книги!",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable}`}
        style={{
          minHeight: "900px",
        }}
      >
        <AuthProvider>
          <AppRouterCacheProvider>
            <Header />
            {children}
          </AppRouterCacheProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
