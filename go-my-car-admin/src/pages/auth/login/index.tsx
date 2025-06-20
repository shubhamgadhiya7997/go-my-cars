import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import LoginForm from "@/components/auth/LoginForm";
import { useLoginMutation } from "@/hooks/api/auth/useLogin";
import { useAuth } from "@/context/authContext";
import { Navigate } from "react-router-dom";

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password must be at least 1 characters"),
});

export default function LoginPage() {
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
