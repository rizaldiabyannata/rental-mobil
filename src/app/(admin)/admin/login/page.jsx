import Image from "next/image"

import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center md:justify-start">
          <a href="#" className="flex items-center gap-3 md:gap-4">
            <div className="flex size-14 items-center justify-center rounded-xl text-white ring-1shadow-md">
              <Image
                src="/logo.png"
                alt="Logo"
                width={140}
                height={140}
                priority
                className="rounded-full object-cover"
              />
            </div>
            <span className="text-xl md:text-2xl font-extrabold tracking-tight text-foreground select-none">
              Reborn Lombok Trans
            </span>
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <img
          src="/login-image.png"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale" />
      </div>
    </div>
  );
}
