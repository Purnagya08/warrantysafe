"use client";

import { useState } from "react";
import { Eye, EyeOff, Shield } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";

function errorMessage(error: unknown, fallback: string) {
  if (typeof error === "object" && error !== null && "response" in error) {
    const response = (error as { response?: { data?: { message?: string } } }).response;
    return response?.data?.message || fallback;
  }
  return fallback;
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back");
    } catch (error) {
      toast.error(errorMessage(error, "Login failed"));
    } finally {
      setLoading(false);
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

          <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="input-label">Email</label>
              <input className="input-field" onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required type="email" value={email} />
            </div>

            <div>
              <label className="input-label">Password</label>
              <div className="relative">
                <input className="input-field pr-10" onChange={(event) => setPassword(event.target.value)} placeholder="Password" required type={showPassword ? "text" : "password"} value={password} />
                <button aria-label={showPassword ? "Hide password" : "Show password"} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280]" onClick={() => setShowPassword((value) => !value)} type="button">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button className="btn-primary w-full" disabled={loading} type="submit">
              {loading ? "Signing in..." : "Sign In"}
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
