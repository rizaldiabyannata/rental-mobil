"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Header = () => {
  const pathname = usePathname();

  return (
    <header className="bg-white shadow-lg">
      <div className="container mx-auto px-4 h-[108px] flex items-center justify-between">
        {/* <Link href="/"> */}
        <Image
          src="/logo.png"
          alt="Reborn Lombok Trans Logo"
          width={100}
          height={99}
        />
        {/* </Link> */}

        <nav className="hidden md:flex items-center gap-2">
          <Link href="/">
            <Button variant={pathname === "/" ? "default" : "ghost"}>
              Beranda
            </Button>
          </Link>
          <Link href="/sewa-mobil">
            <Button
              variant={
                pathname.startsWith("/sewa-mobil-layanan") ? "default" : "ghost"
              }
            >
              Sewa Mobil & Layanan
            </Button>
          </Link>
          <Link href="/tentang-kami">
            <Button
              variant={pathname === "/tentang-kami" ? "default" : "ghost"}
            >
              Tentang Kami
            </Button>
          </Link>
          <Link href="/syarat-ketentuan">
            <Button
              variant={pathname === "/syarat-ketentuan" ? "default" : "ghost"}
            >
              Syarat & Ketentuan
            </Button>
          </Link>
        </nav>

        <a
          href="https://wa.me/6287741861681"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:flex items-center gap-2 text-sm"
        >
          <Image
            src="/ic_baseline-whatsapp.svg"
            alt="WhatsApp Icon"
            width={40}
            height={40}
            // className="text-green-500"
          />
          <div>
            <p className="font-medium">Butuh Rental?</p>
            <p className="font-bold text-green-600">+62-877-4186-1681</p>
          </div>
        </a>

        {/* Tombol menu untuk mobile */}
        <div className="md:hidden">
          <Button size="icon" variant="outline">
            {/* Icon menu (hamburger) */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
