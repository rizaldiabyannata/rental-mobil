"use client";

import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const termsData = [
  {
    id: 1,
    title: "Ketentuan Umum",
    content:
      "Penyewa wajib menunjukkan identitas diri yang valid (KTP/Paspor, SIM A). Kendaraan hanya boleh dikemudikan oleh penyewa atau supir yang terdaftar. Penggunaan kendaraan untuk aktivitas ilegal dilarang keras.",
  },
  {
    id: 2,
    title: "Pemesanan & Pembayaran",
    content:
      "Pemesanan dianggap sah setelah pembayaran uang muka (DP) sebesar 30%. Pelunasan dilakukan saat serah terima kendaraan. Pembatalan H-3 akan dikenakan potongan 50% dari DP, pembatalan H-1 atau kurang akan membuat DP hangus.",
  },
  {
    id: 3,
    title: "Penggunaan Kendaraan",
    content:
      "Harga sewa tidak termasuk BBM (kecuali paket All-in-one). Kendaraan harus dikembalikan dengan level BBM yang sama seperti saat diterima. Penggunaan kendaraan di luar wilayah Lombok harus dengan persetujuan terlebih dahulu.",
  },
  {
    id: 4,
    title: "Biaya Overtime",
    content:
      "Kelebihan waktu penggunaan akan dikenakan biaya overtime sebesar 10% dari harga sewa per jam. Keterlambatan lebih dari 6 jam akan dihitung sebagai biaya sewa satu hari penuh.",
  },
  {
    id: 5,
    title: "Kerusakan & Asuransi",
    content:
      "Penyewa bertanggung jawab penuh atas segala kerusakan, kehilangan, atau kecelakaan yang disebabkan oleh kelalaian. Kendaraan kami dilindungi asuransi All Risk, namun klaim tunduk pada syarat dan ketentuan dari pihak asuransi.",
  },
];

const SyaratSection = () => {
  const [selectedTerm, setSelectedTerm] = useState(termsData[0]);

  return (
    <section className="bg-white py-[25px] md:py-[50px] flex justify-center items-center">
      <div className="container mx-auto px-4">
        {/*TAMPILAN MOBILE & TABLET (< 1024px)*/}
        <div className="text-center mx-auto mb-12">
          <h2 className="font-sans text-[24px] md:text-3xl lg:text-4xl font-bold text-emerald-700">
            Syarat dan Ketentuan
          </h2>
          <div className="w-[147px] md:w-[268px] h-[1px] bg-[#FF9700] mt-2 mx-auto" />
          <p className="text-gray-600 mt-6 text-base md:text-lg lg:text-xl">
            Temukan syarat dan ketentuan penyewaan di sini.
          </p>
        </div>
        <div className="lg:hidden">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {termsData.map((term) => (
              <AccordionItem
                key={term.id}
                value={`item-${term.id}`}
                className="border border-gray-200 rounded-lg shadow-sm bg-white px-4"
              >
                <AccordionTrigger className="font-sans font-semibold text-left hover:no-underline">
                  {term.title}
                </AccordionTrigger>
                <AccordionContent className="font-sans text-gray-600">
                  {term.content}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* TAMPILAN DESKTOP (>= 1024px)*/}
        <div className="hidden lg:flex w-full max-w-6xl mx-auto shadow-md rounded-lg">
          <div className="w-1/3 bg-[#F8F8F8] p-8 rounded-l-lg">
            <ul className="space-y-4">
              {termsData.map((term) => (
                <li key={term.id}>
                  <button
                    onClick={() => setSelectedTerm(term)}
                    className={`w-full text-left p-3 rounded-md transition-colors font-semibold flex items-center gap-3 text-gray-600 ${
                      selectedTerm.id === term.id
                        ? "bg-emerald-100 text-emerald-800"
                        : "hover:bg-gray-200"
                    }`}
                  >
                    <svg
                      className="size-5 flex-shrink-0"
                      xmlns="http://www.w.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {term.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="w-2/3 bg-emerald-50 p-8 rounded-r-lg">
            <h2 className="font-geist text-3xl font-semibold text-black mb-2">
              {selectedTerm.title}
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Update{" "}
              {new Date().toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
            <div className="prose max-w-none prose-p:font-geist prose-p:text-base prose-p:text-black">
              <p>{selectedTerm.content}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SyaratSection;
