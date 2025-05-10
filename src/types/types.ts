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

export type ToastPurpose = "success" | "error" | "info" | "warning";
