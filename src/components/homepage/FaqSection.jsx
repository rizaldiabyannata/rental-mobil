import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqData = [
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

const FaqSection = () => {
  return (
    <section className="bg-white py-[25px] md:py-[50px]">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mx-auto mb-12">
          <h2 className="font-sans text-[24px] md:text-3xl lg:text-4xl font-bold text-emerald-700">
            Pertanyaan yang Sering Diajukan
          </h2>
          <div className="w-[147px] md:w-[268px] h-[1px] bg-[#FF9700] mt-2 mx-auto" />
          <p className="text-gray-600 mt-6 text-base md:text-lg lg:text-xl">
            Temukan jawaban atas pertanyaan umum di sini.
          </p>
        </div>

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
