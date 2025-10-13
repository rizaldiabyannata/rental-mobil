import Image from "next/image";
import Link from "next/link";
import { MapPin, Mail, Phone, Instagram } from "lucide-react";

const usefulLinks = [
  { href: "/tentang-kami", label: "Tentang Kami" },
  { href: "/sewa-mobil-layanan", label: "Sewa Mobil & Layanan" },
  { href: "/syarat-ketentuan", label: "Syarat & Ketentuan" },
];
const carLinks = [
  { href: "#", label: "Innova Reborn" },
  { href: "/detail", label: "Toyata HI Ace" },
];

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Mobile/Tablet Layout (<=1024px)*/}
        <div className="lg:hidden">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <MapPin className="w-6 h-6 text-gray-400 flex-shrink-0" />
                <div>
                  <h3 className="font-poppins text-sm md:text-base font-medium text-gray-400">
                    Alamat
                  </h3>
                  <p className="font-poppins text-base md:text-lg font-semibold text-white leading-relaxed">
                    Jl. Dukuh salah no 17, pejeruk, ampenan, mataram, lombok
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href="mailto:rebornlombokmandiri@gmail.com"
                  className="flex items-center gap-3 hover:opacity-80"
                >
                  <Mail className="w-6 h-6 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-poppins text-sm md:text-base font-medium text-gray-400">
                      Email
                    </h3>
                    <p className="font-poppins text-base md:text-lg font-semibold text-white">
                      rebornlombokmandiri@gmail.com
                    </p>
                  </div>
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-6 h-6 text-gray-400 flex-shrink-0" />
                <div>
                  <h3 className="font-poppins text-sm md:text-base font-medium text-gray-400">
                    Telepon
                  </h3>
                  <p className="font-poppins text-base md:text-lg font-semibold text-white">
                    +62-877-4186-1681
                  </p>
                  <p className="font-poppins text-base md:text-lg font-semibold text-white">
                    +62-853-5381-8685
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-700 my-8" />

            {/* Ikon Sosial Media */}
            <div className="flex gap-4">
              {/* <Link href="#" className="hover:opacity-80">
                <Image src="/Fb.svg" alt="Facebook" width={24} height={24} />
              </Link> */}
              <Link
                href="https://www.instagram.com/rebornlomboktrans?igsh=MWc0NHI3bXptbDJicg=="
                className="hover:opacity-80 p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
                aria-label="Instagram Reborn Lombok Trans"
              >
                <Instagram className="w-5 h-5 text-gray-300" />
              </Link>
              {/* <Link href="#" className="hover:opacity-80">
                <Image src="/x.svg" alt="X" width={24} height={24} />
              </Link>
              <Link href="#" className="hover:opacity-80">
                <Image
                  src="/youtube.svg"
                  alt="Youtube"
                  width={24}
                  height={24}
                />
              </Link> */}
            </div>

            <div className="space-y-4">
              <Image
                src="/logo.png"
                alt="Reborn Lombok Trans Logo"
                width={100}
                height={100}
                className="bg-white rounded-md"
              />
              <h2 className="font-poppins text-lg md:text-xl font-semibold text-white max-w-xs">
                Kepuasan anda adalah yang utama
                <br />
                Ingat Lombok ingat Reborn Lombok Trans !!!!
              </h2>
            </div>

            {/* Links */}
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-base md:text-lg text-white mb-3">
                  Useful links
                </h3>
                <ul className="space-y-2 text-sm md:text-base text-gray-400">
                  {usefulLinks.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="hover:text-white">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-base md:text-lg text-white mb-3">
                  Mobil
                </h3>
                <ul className="space-y-2 text-sm md:text-base text-gray-400">
                  {carLinks.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="hover:text-white">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden lg:block">
          <div className="flex flex-wrap justify-between items-start gap-10 pb-8">
            <div className="flex-shrink-0">
              <Image
                src="/logo.png"
                alt="Reborn Lombok Trans Logo"
                width={100}
                height={100}
                className="bg-white rounded-md"
              />
            </div>

            <div className="flex flex-wrap justify-end gap-x-12 gap-y-8">
              <div className="flex items-center gap-4">
                <MapPin className="w-8 h-8 text-gray-400 flex-shrink-0" />
                <div>
                  <h3 className="font-poppins text-sm font-medium text-gray-400 mb-1">
                    Alamat
                  </h3>
                  <p className="font-poppins text-base font-semibold text-white leading-relaxed max-w-[280px]">
                    Jl. Dukuh salah no 17, pejeruk, ampenan, mataram, lombok
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <a
                  href="mailto:rebornlombokmandiri@gmail.com"
                  className="flex items-center gap-4 hover:opacity-80"
                >
                  <Mail className="w-8 h-8 text-gray-400 flex-shrink-0" />
                  <div>
                    <h3 className="font-poppins text-sm font-medium text-gray-400 mb-1">
                      Email
                    </h3>
                    <p className="font-poppins text-base font-semibold text-white">
                      rebornlombokmandiri@gmail.com
                    </p>
                  </div>
                </a>
              </div>
              <div className="flex items-center gap-4">
                <Phone className="w-8 h-8 text-gray-400 flex-shrink-0" />
                <div>
                  <h3 className="font-poppins text-sm font-medium text-gray-400 mb-1">
                    Telepon
                  </h3>
                  <p className="font-poppins text-base font-semibold text-white">
                    +62-877-4186-1681
                  </p>
                  <p className="font-poppins text-base font-semibold text-white">
                    +62-853-5381-8685
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-16">
            <div className="space-y-4">
              <h2 className="font-poppins text-xl font-semibold text-white max-w-xs pt-4">
                Kepuasan anda adalah yang utama
                <br />
                Ingat Lombok ingat Reborn Lombok Trans !!!!
              </h2>
              <div className="flex gap-4 pt-2">
                {/* <Link href="#" className="hover:opacity-80">
                  <Image src="/Fb.svg" alt="Facebook" width={24} height={24} />
                </Link> */}
                <Link
                  href="https://www.instagram.com/rebornlomboktrans?igsh=MWc0NHI3bXptbDJicg=="
                  className="hover:opacity-80 p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
                  aria-label="Instagram Reborn Lombok Trans"
                >
                  <Instagram className="w-5 h-5 text-gray-300" />
                </Link>
                {/* <Link href="#" className="hover:opacity-80">
                  <Image src="/x.svg" alt="X" width={24} height={24} />
                </Link>
                <Link href="#" className="hover:opacity-80">
                  <Image
                    src="/youtube.svg"
                    alt="Youtube"
                    width={24}
                    height={24}
                  />
                </Link> */}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg text-white mb-4">
                Useful links
              </h3>
              <ul className="space-y-2 text-sm text-gray-400">
                {usefulLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-white mb-4">Mobil</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                {carLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()}. Reborn Lombok Trans</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
