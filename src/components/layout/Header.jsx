"use client";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Icon } from "@iconify-icon/react";
import LanguageSwitcher from "@/components/shared/LanguageSwitcher";
import { useTranslations, useLocale } from "next-intl";

const MobileMenu = ({ isOpen, onClose, t }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col items-start px-4 md:pl-24 md:pr-10 md:pt-5">
      <Button
        size="icon"
        variant="ghost"
        className="self-end mb-8 size-12"
        onClick={onClose}
        aria-label={t("closeMenuAria")}
      >
        <X className="size-6" />
      </Button>
      <nav className="flex flex-col items-start gap-8">
        <Link
          href="/"
          className="text-2xl font-semibold hover:text-primary"
          onClick={onClose}
        >
          {t("nav.home")}
        </Link>
        <Link
          href="/sewa-mobil-layanan"
          className="text-2xl font-semibold hover:text-primary"
          onClick={onClose}
        >
          {t("nav.services")}
        </Link>
        <Link
          href="/paket-tour"
          className="text-2xl font-semibold hover:text-primary"
          onClick={onClose}
        >
          {t("nav.tour")}
        </Link>
        <Link
          href="/tentang-kami"
          className="text-2xl font-semibold hover:text-primary"
          onClick={onClose}
        >
          {t("nav.about")}
        </Link>
        <Link
          href="/syarat-ketentuan"
          className="text-2xl font-semibold hover:text-primary"
          onClick={onClose}
        >
          {t("nav.terms")}
        </Link>
        <div className="pt-4">
          <LanguageSwitcher />
        </div>
      </nav>
    </div>
  );
};

const Header = () => {
  const t = useTranslations("header");
  const locale = useLocale();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky w-full top-0 left-0 z-40">
      <div className="container mx-auto px-2 lg:px-6 xl:px-28 py-4 flex items-center justify-between">
        <Image
          src="/newLogo.png"
          alt="Reborn Lombok Trans Logo"
          width={100}
          height={100}
          className="size-16 md:size-20 lg:size-24"
        />

        <nav className="hidden lg:flex items-center gap-2">
          <Link href={`/${locale}/`}>
            <Button
              variant={
                pathname === `/${locale}` || pathname === `/${locale}/`
                  ? "default"
                  : "ghost"
              }
            >
              {t("nav.home")}
            </Button>
          </Link>
          <Link href={`/${locale}/sewa-mobil-layanan`}>
            <Button
              variant={
                pathname.startsWith(`/${locale}/sewa-mobil-layanan`)
                  ? "default"
                  : "ghost"
              }
            >
              {t("nav.services")}
            </Button>
          </Link>
          <Link href={`/${locale}/paket-tour`}>
            <Button
              variant={
                pathname.startsWith(`/${locale}/paket-tour`)
                  ? "default"
                  : "ghost"
              }
            >
              {t("nav.tour")}
            </Button>
          </Link>
          <Link href={`/${locale}/tentang-kami`}>
            <Button
              variant={
                pathname === `/${locale}/tentang-kami` ? "default" : "ghost"
              }
            >
              {t("nav.about")}
            </Button>
          </Link>
          <Link href={`/${locale}/syarat-ketentuan`}>
            <Button
              variant={
                pathname === `/${locale}/syarat-ketentuan` ? "default" : "ghost"
              }
            >
              {t("nav.terms")}
            </Button>
          </Link>
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          <LanguageSwitcher />
          <a
            href="https://wa.me/6285353818685"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm"
            aria-label={t("whatsappAria")}
          >
            <Icon
              icon="ic:baseline-whatsapp"
              width="36"
              height="36"
              style={{ color: "#00a63e" }}
            />

            <div>
              <p className="font-medium">{t("whatsappPrompt")}</p>
              <p className="font-bold text-green-600">+62-853-5381-8685</p>
            </div>
          </a>
        </div>

        <div className="lg:hidden">
          <Button
            size="icon"
            variant="ghost"
            className="self-end size-12"
            onClick={() => setIsMenuOpen(true)}
            aria-label={t("openMenuAria")}
          >
            <Menu className="size-6" />
          </Button>
        </div>
      </div>
      <MobileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        t={t}
      />
    </header>
  );
};

export default Header;
