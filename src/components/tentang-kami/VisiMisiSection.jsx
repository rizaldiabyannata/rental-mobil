import Image from "next/image";
import SectionHeading from "@/components/SectionHeading";

const misiItems = [
  {
    title: "Menyajikan Armada Terbaik",
    description: "Menjamin setiap kendaraan dalam kondisi prima",
  },
  {
    title: "Memberikan Kemudahan Maksimal",
    description: "Menawarkan paket all-in-one bebas repot",
  },
  {
    title: "Memprioritaskan Pelayanan Prima",
    description: "Menempatkan keamanan & kepuasan anda",
  },
  {
    title: "Berkontribusi Untuk Pariwisata Indonesia",
    description: "Menyediakan akses transportasi yang andal",
  },
  {
    title: "Menghadirkan Akses yang Mudah",
    description: "Sistem reservasi yang cepat dan fleksibel",
  },
  {
    title: "Membangun Kemitraan",
    description: "Aktif menjalani kerjasama demi pariwisata Lombok",
  },
];

const VisiMisiSection = () => {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-32">
        <SectionHeading
          title={
            <>
              <span className="text-black">Visi & Misi Reborn Lombok</span>
              <span className="text-emerald-600"> Reborn Lombok Trans</span>
            </>
          }
          align="center"
          size="md"
          underline
          underlineColor="bg-amber-500"
          underlineWidth="lg"
          underlineOffset="md"
          underlineClassName="h-[3px] w-24 md:w-32 lg:w-40"
          className="mb-6 md:mb-10"
        />
        <div className="md:bg-emerald-50 rounded-xl p-6 md:p-8 lg:p-10 mb-12">
          <div className="flex items-center gap-4 mb-4">
            <Image src="/target.svg" alt="Visi Kami" width={50} height={50} />
            <h2 className="font-sans text-[20px] md:text-2xl font-bold text-[#051C35]">
              Visi Kami
            </h2>
          </div>
          <p className="text-[#051C35] md:text-lg text-justify font-normal">
            Menjadi perusahaan rental mobil terpercaya di Kota Mataram yang
            menghadirkan layanan transportasi aman (berbadan Hukum), nyaman
            (Unit terbaru 2025), dan praktis (mudah pemesanan dan transparan)
            untuk mendukung kebutuhan perjalanan wisata, bisnis, dan keluarga di
            Lombok.
          </p>
        </div>

        {/* Misi */}
        <div className="md:bg-emerald-50 rounded-xl p-6 md:p-8 lg:p-10">
          <div className="flex items-center gap-4 mb-6">
            <Image
              src="/target.svg"
              alt="Visi Kami"
              width={50}
              height={50}
              className="size-[32px] md:size-[50px]"
            />
            <h2 className="font-sans text-[20px] md:text-2xl font-bold text-[#051C35]">
              Misi Kami
            </h2>
          </div>

          {/* Kartu Misi */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {misiItems.map((item, index) => (
              <div
                key={index}
                className="bg-[#F8F8F8] rounded-[10px] shadow-xl p-4 flex flex-col items-center text-center gap-4 md:p-6"
              >
                <Image
                  src="/car.png"
                  alt="Visi Kami"
                  width={60}
                  height={60}
                  className="size-[50px] md:size-[60px]"
                />
                <h3 className="font-sans font-semibold text-center mb-[8px] text-black text-sm md:text-[18px] lg:text-[20px]">
                  {item.title}
                </h3>
                <p className="text-[#051C35] text-[11px] md:text-[13px] lg:text-[14px]">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisiMisiSection;
