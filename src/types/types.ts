export interface FormProps {
  onSubmit: (data: { email: string; password: string }) => void;
  error: string;
  type: FormPurpose;
}

export interface FormValues {
  email: string;
  password: string;
}

type FormPurpose = "login" | "signup";

export type BookStatus = "exchange" | "sold" | "sale";

export type Book = {
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
