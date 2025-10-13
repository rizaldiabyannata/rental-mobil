import Image from "next/image";
import Link from "next/link";

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
      <div className="container mx-auto px-6 py-12">
        {/* Mobile/Tablet Layout (<=1024px)*/}
        <div className="lg:hidden">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Image
                  src="/location.png"
                  alt="Alamat"
                  width={24}
                  height={24}
                />
                <div>
                  <h3 className="font-poppins text-base font-normal text-white">
                    Alamat
                  </h3>
                  <p className="font-poppins text-base font-semibold text-white">
                    Jl. Dukuh salah no 17, pejeruk, ampenan, mataram, lombok
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <a
                  href="mailto:rebornlombokmandiri@gmail.com"
                  className="flex items-start gap-3 hover:opacity-80"
                >
                  <Image src="/email.png" alt="Email" width={24} height={24} />
                  <div>
                    <h3 className="font-poppins text-base font-normal text-white">
                      Email
                    </h3>
                    <p className="font-poppins text-base font-semibold text-white">
                      rebornlombokmandiri@gmail.com
                    </p>
                  </div>
                </a>
              </div>
              <div className="flex items-start gap-3">
                <Image src="/telp.svg" alt="Telepon" width={24} height={24} />
                <div>
                  <h3 className="font-poppins text-base font-normal text-white">
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

            <div className="border-t border-gray-700 my-8" />

            {/* Ikon Sosial Media */}
            <div className="flex gap-4">
              {/* <Link href="#" className="hover:opacity-80">
                <Image src="/Fb.svg" alt="Facebook" width={24} height={24} />
              </Link> */}
              <Link
                href="https://www.instagram.com/rebornlomboktrans/"
                className="hover:opacity-80"
              >
                <Image src="/Ig.svg" alt="Instagram" width={24} height={24} />
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
              <h2 className="font-poppins text-xl font-semibold text-white max-w-xs">
                Kepuasan anda adalah yang utama
                <br />
                Ingat Lombok ingat Reborn Lombok Trans !!!!
              </h2>
            </div>

            {/* Links */}
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-lg text-white mb-4">
                  Useful links
                </h3>
                <ul className="space-y-2 text-sm">
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
                <h3 className="font-bold text-lg text-white mb-4">Mobil</h3>
                <ul className="space-y-2 text-sm">
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

        {/*DESKTOP (>=1024px)*/}
        <div className="hidden lg:block">
          <div className="flex flex-wrap justify-between items-start gap-8 gap-x-4 pb-8 border-b border-gray-700">
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
              <div className="flex items-start gap-4">
                <Image
                  src="/location.png"
                  alt="Alamat"
                  width={40}
                  height={40}
                />
                <div>
                  <h3 className="font-poppins text-base font-normal text-white mb-1">
                    Alamat
                  </h3>
                  <p className="font-poppins text-base font-semibold text-white max-w-[240px]">
                    Jl. Dukuh salah no 17, pejeruk, ampenan, mataram, lombok
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <a
                  href="mailto:rebornlombokmandiri@gmail.com"
                  className="flex items-start gap-3 hover:opacity-80"
                >
                  <Image src="/email.png" alt="Email" width={40} height={40} />
                  <div>
                    <h3 className="font-poppins text-base font-normal text-white mb-1">
                      Email
                    </h3>
                    <p className="font-poppins text-base font-semibold text-white">
                      rebornlombokmandiri@gmail.com
                    </p>
                  </div>
                </a>
              </div>
              <div className="flex items-start gap-4">
                <Image src="/telp.svg" alt="Telepon" width={40} height={40} />
                <div>
                  <h3 className="font-poppins text-base font-normal text-white mb-1">
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

          {/* Grid Bawah untuk Desktop */}
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
                  href="https://www.instagram.com/rebornlomboktrans/"
                  className="hover:opacity-80"
                >
                  <Image src="/Ig.svg" alt="Instagram" width={24} height={24} />
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
              <h3 className="font-bold text-lg text-white mb-4">
                Useful links
              </h3>
              <ul className="space-y-2 text-sm">
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
              <h3 className="font-bold text-lg text-white mb-4">Mobil</h3>
              <ul className="space-y-2 text-sm">
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

      <div className="border-t border-gray-700 mt-12 pt-8 text-center text-sm">
        <p>&copy; {new Date().getFullYear()}. Reborn Lombok Trans</p>
      </div>
    </footer>
  );
};

export default Footer;
