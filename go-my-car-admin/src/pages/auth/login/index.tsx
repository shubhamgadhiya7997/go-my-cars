import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import LoginForm from "@/components/auth/LoginForm";
import { useLoginMutation } from "@/hooks/api/auth/useLogin";
import { useAuth } from "@/context/authContext";
import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function LoginPage() {
  const navigate = useNavigate();
  const { login: handleLogin, isAuthenticated } = useAuth();
  const { mutate: loginApi, isPending } = useLoginMutation(handleLogin);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  const onSubmit = handleSubmit((data) => {
    loginApi(data);
  });

  return (
    <LoginForm
      onSubmit={onSubmit}
      register={register}
      errors={errors}
      isLoading={isPending}
    />
  );
}
