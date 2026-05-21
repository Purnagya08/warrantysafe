"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Shield } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";

const loginSchema = z.object({
  email: z.email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

function errorMessage(error: unknown, fallback: string) {
  if (typeof error === "object" && error !== null && "response" in error) {
    const response = (error as { response?: { data?: { message?: string } } }).response;
    return response?.data?.message || fallback;
  }
  return fallback;
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginForm) => {
    try {
      await login(values.email, values.password);
      toast.success("Welcome back");
    } catch (error) {
      toast.error(errorMessage(error, "Login failed"));
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F3F4F6] px-4 py-8">
      <div className="w-full max-w-sm">
        <div className="mb-5 flex items-center justify-center gap-2">
          <Shield size={28} className="text-[#FF9900]" />
          <span className="text-2xl font-bold text-[#111827]">WarrantySafe</span>
        </div>

        <div className="card">
          <h2>Sign in</h2>
          <p className="mt-1 text-sm text-[#6B7280]">Access your ownership operations console.</p>

          <form className="mt-5 space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="input-label">Email</label>
              <input className="input-field" placeholder="you@example.com" type="email" {...register("email")} />
              {errors.email && <p className="field-error">{errors.email.message}</p>}
            </div>

            <div>
              <label className="input-label">Password</label>
              <div className="relative">
                <input className="input-field pr-10" placeholder="Password" type={showPassword ? "text" : "password"} {...register("password")} />
                <button aria-label={showPassword ? "Hide password" : "Show password"} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280]" onClick={() => setShowPassword((value) => !value)} type="button">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="field-error">{errors.password.message}</p>}
            </div>

            <button className="btn-primary w-full" disabled={isSubmitting} type="submit">
              {isSubmitting ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-[#6B7280]">
            Do not have an account? <Link href="/register" className="font-semibold text-[#B26A00]">Register</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
