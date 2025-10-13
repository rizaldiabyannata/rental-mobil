"use client";
import { useState } from "react";
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

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function requestOtp() {
    setError("");
    if (!email) return setError("Email wajib diisi");
    try {
      setLoading(true);
      await fetch("/api/auth/password-reset/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setSent(true);
    } catch {
      setError("Gagal mengirim OTP");
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp() {
    setError("");
    if (!otp) return setError("OTP wajib diisi");
    try {
      setLoading(true);
      const res = await fetch("/api/auth/password-reset/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data?.error || "OTP tidak valid");
      // Store token temporarily to authorize reset
      if (data?.token) sessionStorage.setItem("pr-token", data.token);
      router.replace("/reset-password");
    } catch {
      setError("Gagal verifikasi OTP");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Lupa Password</CardTitle>
          <CardDescription>
            Kami akan mengirimkan OTP ke email Anda
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading || sent}
            />
          </div>
          {!sent ? (
            <Button onClick={requestOtp} disabled={loading}>
              Kirim OTP
            </Button>
          ) : (
            <div className="space-y-2">
              <label className="text-sm font-medium">Masukkan OTP</label>
              <Input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                disabled={loading}
              />
              <div className="flex gap-2">
                <Button onClick={verifyOtp} disabled={loading}>
                  Verifikasi
                </Button>
                <Button
                  variant="outline"
                  onClick={requestOtp}
                  disabled={loading}
                >
                  Kirim Ulang
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
