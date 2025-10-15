import { Button } from "@/components/ui/button";
import Link from "next/link";

const Pertanyaan = () => {
  return (
    <section className="py-[15px] md:py-[25px]">
      <div className="container mx-auto p-12 lg:p-[50-x] lg:bg-gray-50 lg:rounded-[25px] lg:shadow-lg lg:my-12 lg:w-auto lg:h-auto lg:mx-auto lg:py-12">
        <h1 className="font-sans text-2xl md:text-4xl lg:text-5xl font-bold text-black text-center mb-6">
          Ada Pertanyaan atau Ingin Melakukan <br />
          Pemesanan? <br />
          Silakan Hubungi Kami
        </h1>
        <div className="justify-center flex mt-6">
          <Link href="https://wa.me/6287741861681">
            <Button size="lg" className="mt-4 rounded-full">
              Hubungi Kami
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
export default Pertanyaan;
