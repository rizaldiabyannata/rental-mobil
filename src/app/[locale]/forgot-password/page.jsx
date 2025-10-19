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
    <main className="container mx-auto flex min-h-[calc(100vh-180px)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Lupa Password Anda?
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Kami akan mengirimkan OTP ke email Anda
          </p>
        </div>
        <Card>
          <CardContent className="space-y-6 p-6 sm:p-8">
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
              <Button
                onClick={requestOtp}
                disabled={loading}
                className="w-full"
              >
                Kirim OTP
              </Button>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Masukkan OTP</label>
                  <Input
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    disabled={loading}
                  />
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button
                    onClick={verifyOtp}
                    disabled={loading}
                    className="w-full"
                  >
                    Verifikasi
                  </Button>
                  <Button
                    variant="outline"
                    onClick={requestOtp}
                    disabled={loading}
                    className="w-full"
                  >
                    Kirim Ulang
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
