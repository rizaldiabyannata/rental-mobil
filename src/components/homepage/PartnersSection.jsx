import SectionHeading from "@/components/SectionHeading";
import {
  Marquee,
  MarqueeContent,
  MarqueeItem,
  MarqueeFade,
} from "@/components/ui/shadcn-io/marquee";

// Dummy logo list, replace with real logo URLs
const LOGOS = [
  "/Hero-1.png",
  "/Hero-2.png",
  "/Hero-3.png",
  "/Hero-1.png",
  "/Hero-2.png",
  "/Hero-3.png",
];

export default function PartnersSection({ logos = LOGOS }) {
  return (
    <section className="w-full py-8 md:py-12">
      <div className="mx-auto w-full max-w-md md:max-w-3xl lg:max-w-6xl px-4 md:px-6 lg:px-8">
        <SectionHeading
          title="Mitra Kami"
          align="center"
          size="md"
          underline
          underlineColor="bg-amber-500"
          underlineWidth="lg"
          underlineOffset="md"
          titleClassName="text-emerald-700"
          underlineClassName="h-[3px] w-24 md:w-32 lg:w-40"
          className="mb-6 md:mb-10"
          description="Kami bangga bekerja sama dengan berbagai mitra terpercaya untuk memberikan layanan terbaik."
        />
        <div className="relative">
          <Marquee className="w-full">
            <MarqueeFade side="left" />
            <MarqueeContent speed={40} pauseOnHover={true}>
              {logos.concat(logos).map((logo, idx) => (
                <MarqueeItem key={idx}>
                  <img
                    src={logo}
                    alt={`Logo Mitra ${(idx % logos.length) + 1}`}
                    className="h-12 md:h-16 lg:h-20 w-auto object-contain drop-shadow-md"
                    draggable={false}
                  />
                </MarqueeItem>
              ))}
            </MarqueeContent>
            <MarqueeFade side="right" />
          </Marquee>
        </div>
      </div>
    </section>
  );
}
