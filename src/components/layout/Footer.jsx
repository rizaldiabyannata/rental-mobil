import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-300">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-10 pb-8">
          <div className="flex items-start gap-4">
            <Image
              src="/logo.png"
              alt="Reborn Lombok Trans Logo"
              width={100}
              height={99}
              className="bg-white rounded-md"
            />
          </div>
          <div className="flex items-start gap-4 mt-0 md:mt-5">
            <Image src="/location.png" alt="Alamat" width={40} height={40} />
            <div>
              <h3 className="font-poppins text-base font-normal text-white mb-1">
                Alamat
              </h3>
              <p className="font-poppins text-base font-semibold text-white leading-[26px]">
                Jl. Dukuh salah no 17, pejeruk, ampenan, mataram, lombok
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 mt-0 md:mt-5">
            <Image src="/email.png" alt="Email" width={40} height={40} />
            <div>
              <h3 className="font-poppins text-base font-normal text-white mb-1">
                Email
              </h3>
              <p className="font-poppins text-base font-semibold text-white leading-[26px]">
                nwlger@yahoo.com
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 mt-0 md:mt-5">
            <Image src="/telp.svg" alt="Telepon" width={40} height={40} />
            <div>
              <h3 className="font-poppins text-base font-normal text-white mb-1">
                Telepon
              </h3>
              <p className="font-poppins text-base font-semibold text-white leading-[26px]">
                +62-877-4186-1681
                <br />
                +62-853-5381-8685
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4 md:col-span-2">
            {" "}
            <h2 className="font-poppins text-xl font-semibold text-white max-w-xs line-clamp-4">
              Kepuasan anda adalah yang utama
              <br />
              Ingat Lombok ingat Reborn Lombok Trans !!!!
            </h2>
            <div className="flex gap-4 pt-2">
              <Link href="#" className="hover:opacity-80">
                <Image src="/Fb.svg" alt="Facebook" width={24} height={24} />
              </Link>
              <Link href="#" className="hover:opacity-80">
                <Image src="/Ig.svg" alt="Instagram" width={24} height={24} />
              </Link>
              <Link href="#" className="hover:opacity-80">
                <Image src="/x.svg" alt="Instagram" width={24} height={24} />
              </Link>
              <Link href="#" className="hover:opacity-80">
                <Image
                  src="/youtube.svg"
                  alt="Youtube"
                  width={24}
                  height={24}
                />
              </Link>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-lg text-white mb-4">Useful links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/tentang-kami" className="hover:text-white">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link href="/sewa-mobil" className="hover:text-white">
                  Sewa Mobil & Layanan
                </Link>
              </li>
              <li>
                <Link href="/syarat-ketentuan" className="hover:text-white">
                  Syarat & Ketentuan
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg text-white mb-4">Mobil</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="hover:text-white">
                  Innova Reborn
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/*Copyright*/}
      <div className="border-t border-gray-700">
        <div className="container mx-auto px-4 py-6 text-center text-sm">
          <p>&copy; {new Date().getFullYear()}. Reborn Lombok Trans</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
