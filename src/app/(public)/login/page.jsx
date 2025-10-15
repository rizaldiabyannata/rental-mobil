import Image from "next/image";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/jwt";
import { LoginForm } from "@/components/login-form";
import Link from "next/link";

export default async function LoginPage() {
  // Jika sudah login, redirect ke dashboard admin
  const user = await getCurrentUser();
  if (user) {
    redirect("/admin/dashboard");
  }
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col p-8 md:p-12">
        <div className="flex items-center justify-center lg:justify-start">
          <Link href="/" className="flex items-center gap-4">
            <Image
              src="/logo.png"
              alt="Logo"
              width={56}
              height={56}
              priority
              className="rounded-full object-cover"
            />
            <span className="text-2xl font-bold tracking-tight text-gray-900">
              Reborn Lombok Trans
            </span>
          </Link>
        </div>
        <div className="my-auto flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">
            <div className="mb-8 text-center lg:text-left">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                Selamat Datang Kembali
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Masuk ke akun Anda untuk melanjutkan.
              </p>
            </div>
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative hidden lg:block">
        <Image
          src="/login-image.png"
          alt="Rental Mobil Lombok"
          fill
          className="object-cover"
          priority
        />
      </div>
    </div>
  );
}
