"use client";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Icon } from "@iconify-icon/react";

const MobileMenu = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col items-start px-4 pt-5 md:pl-24 md:pr-10 md:pt-5">
      <Button
        size="icon"
        variant="ghost"
        className="self-end mb-8 size-12"
        onClick={onClose}
        aria-label="Tutup menu"
      >
        <X className="size-6" />
      </Button>
      <nav className="flex flex-col items-start gap-8">
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
          href="/paket-tour"
          className="text-2xl font-semibold hover:text-primary"
          onClick={onClose}
        >
          Paket Tour
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
    <header className="bg-white shadow-md sticky w-full top-0 left-0 z-40">
      <div className="container mx-auto px-4 lg:px-8 xl:px-32 py-4 flex items-center justify-between">
        <Image
          src="/logo.png"
          alt="Reborn Lombok Trans Logo"
          width={70}
          height={70}
        />

        <nav className="hidden lg:flex items-center gap-2">
          <Link href="/">
            <Button variant={pathname === "/" ? "default" : "ghost"}>
              Beranda
            </Button>
          </Link>
          <Link href="/sewa-mobil-layanan">
            <Button
              variant={
                pathname.startsWith("/sewa-mobil-layanan") ? "default" : "ghost"
              }
            >
              Sewa Mobil & Layanan
            </Button>
          </Link>
          <Link href="/paket-tour">
            <Button
              variant={pathname.startsWith("/paket-tour") ? "default" : "ghost"}
            >
              Paket Tour
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
          className="hidden lg:flex items-center gap-2 text-sm"
        >
          <Icon
            icon="ic:baseline-whatsapp"
            width="36"
            height="36"
            style={{ color: "#00a63e" }}
          />

          <div>
            <p className="font-medium">Butuh Rental?</p>
            <p className="font-bold text-green-600">+62-877-4186-1681</p>
          </div>
        </a>

        <div className="lg:hidden">
          <Button
            size="icon"
            variant="ghost"
            className="self-end size-12"
            onClick={() => setIsMenuOpen(true)}
            aria-label="Buka menu"
          >
            <Menu className="size-6" />
          </Button>
        </div>
      </div>
      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </header>
  );
};

export default Header;
