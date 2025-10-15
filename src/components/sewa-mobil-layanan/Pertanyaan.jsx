import { Button } from "@/components/ui/button";
import Link from "next/link";

const Pertanyaan = () => {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-2xl bg-gray-50 p-8 text-center shadow-lg md:p-12">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Ada Pertanyaan atau Ingin Melakukan Pemesanan?
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Jangan ragu, silakan hubungi kami. Tim kami siap membantu Anda
            merencanakan perjalanan terbaik di Lombok.
          </p>
          <div className="mt-8">
            <Link href="https://wa.me/6287741861681">
              <Button size="lg" className="rounded-full px-8 py-6 text-lg">
                Hubungi Kami
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Pertanyaan;
