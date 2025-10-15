import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import SectionHeading from "../SectionHeading";

const defaultFaq = [
  {
    question: "Apa saja syarat untuk menyewa mobil?",
    answer:
      "Untuk menyewa mobil, Anda hanya perlu menyiapkan KTP/Paspor dan SIM A yang masih berlaku. Untuk beberapa paket, mungkin diperlukan jaminan tambahan yang akan kami informasikan lebih lanjut.",
  },
  {
    question: "Apakah harga sewa sudah termasuk bensin dan supir?",
    answer:
      "Ya, sebagian besar paket kami adalah 'All-in-one' yang sudah termasuk mobil, supir profesional, dan BBM. Namun, kami juga menyediakan paket sewa mobil lepas kunci (tanpa supir) sesuai permintaan.",
  },
  {
    question: "Bagaimana jika terjadi kerusakan atau ban bocor di jalan?",
    answer:
      "Jangan khawatir. Tim kami siaga 24/7. Segera hubungi nomor darurat yang kami berikan, dan kami akan mengirimkan bantuan atau mobil pengganti secepatnya.",
  },
  {
    question: "Apakah mobil bisa dibawa keluar kota Lombok?",
    answer:
      "Bisa, namun wajib dengan konfirmasi terlebih dahulu kepada kami saat proses pemesanan untuk penyesuaian syarat dan ketentuan perjalanan luar pulau.",
  },
  {
    question: "Bagaimana sistem pembayarannya?",
    answer:
      "Kami memerlukan uang muka (DP) minimal 30% saat pemesanan untuk mengunci jadwal. Sisa pembayaran bisa dilunasi saat serah terima mobil di lokasi penjemputan.",
  },
];

const FaqSection = ({ faqs }) => {
  const faqData =
    Array.isArray(faqs) && faqs.length
      ? faqs.map((f) => ({ question: f.question, answer: f.answer }))
      : defaultFaq;
  return (
    <section className="bg-white py-[25px] md:py-[50px]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <SectionHeading
          title={"Pertanyaan yang Sering Diajukan"}
          align="center"
          size="md"
          underline
          underlineColor="bg-amber-500"
          underlineWidth="lg"
          underlineOffset="md"
          titleClassName="text-emerald-700"
          underlineClassName="h-[3px] w-24 md:w-32 lg:w-40"
          className="mb-6 md:mb-10"
          description={"Temukan jawaban atas pertanyaan umum di sini."}
        />

        <Accordion type="single" collapsible className="w-full space-y-4 pb-12">
          {faqData.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border border-emerald-900/50 rounded-[15px] shadow-md bg-white
                           px-4 py-2 md:px-8 md:py-4 md:border-2"
            >
              <AccordionTrigger className="font-geist text-lg md:text-xl font-semibold text-left hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="font-geist text-sm md:text-base font-normal text-gray-800 pt-2">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FaqSection;
