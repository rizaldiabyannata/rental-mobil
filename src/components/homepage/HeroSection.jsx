import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import WhatsAppCta from "@/components/shared/WhatsAppCta";
import PropTypes from "prop-types";

const HeroSection = ({
  title = (
    <>
      Sewa Mobil <span className="text-emerald-700">Terbaik di Lombok</span>
    </>
  ),
  subtitle = "Jelajahi keindahan Lombok dengan nyaman bersama Reborn Lombok Trans. Armada terawat, supir profesional, dan harga terbaik.",
  imageSrc = "/ImageHero.png",
  imageAlt = "Hero Image",
  imageOnRight = false,
  primaryLabel = "Lihat Armada",
  primaryHref = "/#armada",
  waProps = {
    waUrlBase: "https://wa.me/6287741861681",
    label: "Hubungi Kami",
    buttonClassName: "w-full bg-emerald-700 hover:bg-emerald-800 py-5",
    iconClassName: "h-6 w-6",
    anchorClassName: "inline-flex items-center justify-center gap-3 w-full",
  },
}) => {
  // Mobile: text first, image second. On large screens, swap based on imageOnRight
  const textOrder = imageOnRight ? "order-1 lg:order-1" : "order-1 lg:order-2";
  const imageOrder = imageOnRight ? "order-2 lg:order-2" : "order-2 lg:order-1";
  const imageJustify = imageOnRight ? "lg:justify-end" : "lg:justify-start";

  return (
    <section className="w-full bg-white">
      <div className="mx-auto w-full max-w-md md:max-w-3xl lg:max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center`}>
          {/* Text column */}
          <div className={`text-center lg:text-left ${textOrder}`}>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
              {title}
            </h1>
            <p className="mt-4 text-base md:text-lg text-gray-600">
              {subtitle}
            </p>

            <div className="mt-6 flex flex-row items-center lg:items-start gap-4">
              <Link href={primaryHref}>
                <Button size="lg" className="w-full lg:w-auto">
                  {primaryLabel}
                </Button>
              </Link>

              <div className="w-full lg:w-auto">
                <WhatsAppCta {...waProps} />
              </div>
            </div>
          </div>

          {/* Image column - circular white card */}
          <div className={`flex justify-center ${imageJustify} ${imageOrder}`}>
            <div className="relative bg-white p-2">
              <div className="relative overflow-hidden w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-96 lg:h-96">
                <Image
                  src={imageSrc}
                  alt={imageAlt}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

HeroSection.propTypes = {
  title: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  subtitle: PropTypes.string,
  imageSrc: PropTypes.string,
  imageAlt: PropTypes.string,
  imageOnRight: PropTypes.bool,
  primaryLabel: PropTypes.string,
  primaryHref: PropTypes.string,
  waProps: PropTypes.object,
};

export default HeroSection;
