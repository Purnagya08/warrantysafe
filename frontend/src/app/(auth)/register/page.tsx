"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Shield } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";

const registerSchema = z.object({
  name: z.string().min(2, "Full name is required"),
  email: z.email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type RegisterForm = z.infer<typeof registerSchema>;

function errorMessage(error: unknown, fallback: string) {
  if (typeof error === "object" && error !== null && "response" in error) {
    const response = (error as { response?: { data?: { message?: string } } }).response;
    return response?.data?.message || fallback;
  }
  return fallback;
}

export default function RegisterPage() {
  const { register: createAccount } = useAuth();
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const onSubmit = async (values: RegisterForm) => {
    try {
      await createAccount(values.name, values.email, values.password);
      toast.success("Account created");
    } catch (error) {
      toast.error(errorMessage(error, "Registration failed"));
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
          <h2>Create account</h2>
          <p className="mt-1 text-sm text-[#6B7280]">Create a compact ownership operations account.</p>

          <form className="mt-5 space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="input-label">Full Name</label>
              <input className="input-field" placeholder="Full name" {...register("name")} />
              {errors.name && <p className="field-error">{errors.name.message}</p>}
            </div>
            <div>
              <label className="input-label">Email</label>
              <input className="input-field" placeholder="you@example.com" type="email" {...register("email")} />
              {errors.email && <p className="field-error">{errors.email.message}</p>}
            </div>
            <div>
              <label className="input-label">Password</label>
              <input className="input-field" placeholder="Password" type="password" {...register("password")} />
              {errors.password && <p className="field-error">{errors.password.message}</p>}
            </div>

            <button className="btn-primary w-full" disabled={isSubmitting} type="submit">
              {isSubmitting ? "Creating..." : "Create Account"}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-[#6B7280]">
            Already have an account? <Link href="/login" className="font-semibold text-[#B26A00]">Sign in</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
