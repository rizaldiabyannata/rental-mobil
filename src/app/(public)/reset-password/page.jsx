"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Simple guard: require pr-token in sessionStorage
    const token = sessionStorage.getItem("pr-token");
    if (!token) router.replace("/forgot-password");
  }, [router]);

  async function submit() {
    setError("");
    if (password.length < 6) return setError("Minimal 6 karakter");
    if (password !== confirm)
      return setError("Konfirmasi password tidak cocok");
    const token = sessionStorage.getItem("pr-token");
    if (!token) return router.replace("/forgot-password");
    try {
      setLoading(true);
      const res = await fetch("/api/auth/password-reset/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) return setError(data?.error || "Gagal reset password");
      sessionStorage.removeItem("pr-token");
      router.replace("/login");
    } catch {
      setError("Gagal reset password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container mx-auto flex min-h-[calc(100vh-180px)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Atur Ulang Password
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Masukkan password baru Anda di bawah ini.
          </p>
        </div>
        <Card>
          <CardContent className="space-y-6 p-6 sm:p-8">
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <div className="space-y-2">
              <label className="text-sm font-medium">Password baru</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Konfirmasi password
              </label>
              <Input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                disabled={loading}
              />
            </div>
            <Button onClick={submit} disabled={loading} className="w-full">
              Simpan Password
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
