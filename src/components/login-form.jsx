"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export function LoginForm({ className, ...props }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const emailActive = emailFocused || email.length > 0;
  const passwordActive = passwordFocused || password.length > 0;

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok || data?.success === false) {
        setError(
          data?.error || "Login gagal. Periksa email dan password Anda."
        );
        setLoading(false);
        return;
      }

      // Redirect ke dashboard admin ketika login berhasil
      router.replace("/admin/dashboard");
    } catch (err) {
      setError("Terjadi kesalahan jaringan. Coba lagi.");
      setLoading(false);
    }
  }

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={onSubmit}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your email below to login to your account
          </p>
        </div>
        {error && (
          <p className="text-sm text-red-600 text-center" role="alert">
            {error}
          </p>
        )}
        <Field>
          <FieldLabel
            htmlFor="email"
            className={cn(emailActive && "text-emerald-600")}
          >
            Email
          </FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setEmailFocused(true)}
            onBlur={() => setEmailFocused(false)}
            className={cn(
              // Base visibility
              "w-full h-11 rounded-xl bg-white border border-slate-300 shadow-sm px-4 placeholder:text-slate-400",
              // Focus styles
              "focus:border-emerald-500 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-0",
              // When input has value, keep emerald border for stronger affordance
              email.length > 0 && "border-emerald-500"
            )}
            disabled={loading}
          />
        </Field>
        <Field>
          <div className="flex items-center">
            <FieldLabel
              htmlFor="password"
              className={cn(passwordActive && "text-emerald-600")}
            >
              Password
            </FieldLabel>
            <Link
              href="/forgot-password"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setPasswordFocused(true)}
            onBlur={() => setPasswordFocused(false)}
            className={cn(
              // Base visibility
              "w-full h-11 rounded-xl bg-white border border-slate-300 shadow-sm px-4 placeholder:text-slate-400",
              // Focus styles
              "focus:border-emerald-500 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-0",
              // When input has value, keep emerald border for stronger affordance
              password.length > 0 && "border-emerald-500"
            )}
            disabled={loading}
          />
        </Field>
        <Field>
          <Button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
