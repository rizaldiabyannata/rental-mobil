"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const MobileMenu = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col items-start p-6">
      <Button
        size="icon"
        variant="ghost"
        className="self-end mb-8"
        onClick={onClose}
      >
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
          <line x1="18" x2="6" y1="6" y2="18" />
          <line x1="6" x2="18" y1="6" y2="18" />
        </svg>
      </Button>
      <nav className="flex flex-col items-start gap-4">
        <Link
          href="/"
          className="text-2xl font-semibold hover:text-primary"
          onClick={onClose}
        >
          Beranda
        </Link>
        <Link
          href="/sewa-mobil-layanan"
          className="text-2xl font-semibold hover:text-primary"
          onClick={onClose}
        >
          Sewa Mobil & Layanan
        </Link>
        <Link
          href="/tentang-kami"
          className="text-2xl font-semibold hover:text-primary"
          onClick={onClose}
        >
          Tentang Kami
        </Link>
        <Link
          href="/syarat-ketentuan"
          className="text-2xl font-semibold hover:text-primary"
          onClick={onClose}
        >
          Syarat & Ketentuan
        </Link>
      </nav>
    </div>
  );
};

const Header = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
          <Button
            size="icon"
            variant="outline"
            onClick={() => setIsMenuOpen(true)}
          >
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
      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </header>
  );
};

export default Header;
