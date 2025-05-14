export type BookStatus = "exchange" | "sold" | "sale";

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  genres: string[];
  publish_date: string;
  images: string[]
  owner: string;
  status: BookStatus;
};

export interface Comment {
  id: string;
  content: string;
  created_at: string;
  book_id: string;
  user_id: string;
};
