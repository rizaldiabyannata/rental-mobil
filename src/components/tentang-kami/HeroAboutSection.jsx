import Image from "next/image";

const HeroAboutSection = () => {
  return (
    <>
      {/*TAMPILAN MOBILE & TABLET (< 1024px)*/}
      <section className="lg:hidden relative h-[466px] md:h-[766px] w-full flex flex-col items-center justify-center text-center text-white p-4 mt-[33px]">
        <div className="relative z-10 flex flex-col items-center gap-4">
          <h1 className="font-sans text-[24px] md:text-4xl font-bold text-[#404040]">
            Mengenal Kami <span className="text-emerald-700">Lebih Dekat</span>
          </h1>
          <p className="font-sans text-[12px] md:text-lg max-w-md text-black">
            Pelajari lebih lanjut tentang sejarah, visi, dan nilai-nilai yang
            membentuk kami.
          </p>
        </div>
        <Image
          src="/aboutus.png"
          alt="Armada Reborn Lombok Trans"
          width={393}
          height={323}
          className="md:w-493 md:h-423"
          priority
        />
      </section>

      {/*TAMPILAN DESKTOP (>= 1024px)*/}
      <section
        className="hidden lg:flex lg:min-h-[453px] xl:min-h-[653px] items-center w-full bg-no-repeat bg-cover bg-center"
        style={{ backgroundImage: "url('/HeroTentangKami-BG.png')" }}
      >
        <div className="container mx-auto px-2">
          <div className="flex items-center justify-between gap-12">
            <div className="w-1/2 ">
              <Image
                src="/aboutus.png"
                alt="Armada Reborn Lombok Trans"
                width={562}
                height={444}
                // className="w-full h-auto"
                priority
              />
            </div>
            <div className="w-3/5 flex flex-col justify-center gap-6">
              <h1 className="font-sans lg:text-4xl xl:text-5xl font-bold text-[#404040]">
                Mengenal Kami
                <span className="text-emerald-700"> Lebih Dekat</span>
              </h1>
              <p className="font-sans lg:text-xl xl:text-2xl text-gray-800 max-w-lg">
                Pelajari lebih lanjut tentang sejarah, visi, dan <br />{" "}
                nilai-nilai yang membentuk kami.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroAboutSection;
