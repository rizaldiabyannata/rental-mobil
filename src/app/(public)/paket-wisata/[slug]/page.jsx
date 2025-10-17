import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import PageHero from "@/components/shared/PageHero";
import TourGallery from "@/components/tours/TourGallery";
import { TourInclusions, TourPriceMatrix } from "@/components/tours/TourDetails";
import WhatsAppCtaSection from "@/components/shared/WhatsAppCtaSection";
import { Badge } from "@/components/ui/badge";

const prisma = new PrismaClient();

// Generate static pages for better performance
export async function generateStaticParams() {
    const packages = await prisma.tourPackage.findMany({
        select: { slug: true },
    });
    return packages.map((pkg) => ({
        slug: pkg.slug,
    }));
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }) {
    const tourPackage = await prisma.tourPackage.findUnique({
        where: { slug: params.slug },
        select: { name: true, description: true },
    });

    if (!tourPackage) {
        return {
            title: "Paket Tidak Ditemukan",
        };
    }

    return {
        title: `${tourPackage.name} | Paket Wisata Lombok`,
        description: tourPackage.description.substring(0, 160),
    };
}

async function getTourPackage(slug) {
    const tourPackage = await prisma.tourPackage.findUnique({
        where: { slug },
        include: {
            hotelTiers: {
                orderBy: { order: 'asc' },
                include: {
                    priceTiers: {
                        orderBy: { price: 'asc' },
                    },
                },
            },
        },
    });

    if (!tourPackage) {
        notFound();
    }

    return tourPackage;
}


export default async function TourDetailPage({ params }) {
    const { slug } = params;
    const tour = await getTourPackage(slug);

    return (
        <main>
            <PageHero
                title={tour.name}
                subtitle={`Paket Wisata ${tour.duration}`}
                imageUrl={tour.galleryImages[0] || "/Hero-1.png"}
            />
            <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
                <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
                    <div className="lg:col-span-2 space-y-8">
                        <TourGallery images={tour.galleryImages} alt={tour.name} />
                        <div>
                            <h2 className="text-2xl font-semibold mb-4">Deskripsi Paket</h2>
                            <p className="text-gray-700 whitespace-pre-wrap">{tour.description}</p>
                        </div>
                        <TourInclusions inclusions={tour.inclusions} />
                    </div>
                    <div className="lg:col-span-1 space-y-8">
                        <div className="p-6 border rounded-lg shadow-sm">
                            <h2 className="text-2xl font-bold mb-1">{tour.name}</h2>
                            <Badge variant="secondary">{tour.duration}</Badge>
                            <div className="mt-6">
                                <WhatsAppCtaSection
                                     message={`Halo, saya tertarik dengan paket wisata "${tour.name}". Mohon informasinya.`}
                                />
                            </div>
                        </div>
                        <TourPriceMatrix hotelTiers={tour.hotelTiers} showHotels={tour.showHotels} />
                    </div>
                </div>
            </div>
        </main>
    );
}