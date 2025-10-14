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
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>Masukkan password baru Anda</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <div className="space-y-2">
            <label className="text-sm font-medium">Password baru</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className={cn(
                // Base visibility
                "w-full h-11 rounded-xl bg-white border border-slate-300 shadow-sm px-4 placeholder:text-slate-400",
                // Focus styles
                "focus:border-emerald-500 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-0"
              )}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Konfirmasi password</label>
            <Input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              disabled={loading}
              className={cn(
                // Base visibility
                "w-full h-11 rounded-xl bg-white border border-slate-300 shadow-sm px-4 placeholder:text-slate-400",
                // Focus styles
                "focus:border-emerald-500 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-0"
              )}
            />
          </div>
          <Button onClick={submit} disabled={loading}>
            Simpan Password
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
