"use client";

import { useState } from "react";
import { Shield } from "lucide-react";
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

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success("Account created");
    } catch (error) {
      toast.error(errorMessage(error, "Registration failed"));
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
          <h2>Create account</h2>
          <p className="mt-1 text-sm text-[#6B7280]">Create a compact ownership operations account.</p>

          <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="input-label">Full Name</label>
              <input className="input-field" onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Full name" required value={form.name} />
            </div>
            <div>
              <label className="input-label">Email</label>
              <input className="input-field" onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="you@example.com" required type="email" value={form.email} />
            </div>
            <div>
              <label className="input-label">Password</label>
              <input className="input-field" onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="Password" required type="password" value={form.password} />
            </div>

            <button className="btn-primary w-full" disabled={loading} type="submit">
              {loading ? "Creating..." : "Create Account"}
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
