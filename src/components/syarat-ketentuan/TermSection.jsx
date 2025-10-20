"use client";

import { useState, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useTranslations } from "next-intl";

const SyaratSection = ({ terms }) => {
  const t = useTranslations("terms");

  // The component uses props for the main content, but has some static UI text.
  // We'll translate the static text.
  const items =
    Array.isArray(terms) && terms.length
      ? terms
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
          .map((t, idx) => ({
            id: t.id || idx + 1,
            title: t.title,
            content: t.content,
          }))
      : []; // Fallback to empty if no terms from server

  const [selectedTerm, setSelectedTerm] = useState(items.length > 0 ? items[0] : null);
  const [dateString, setDateString] = useState("");

  useEffect(() => {
    const formattedDate = new Date().toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    setDateString(formattedDate);
  }, []);

  if (!selectedTerm) {
    return null; // Don't render if there's no data
  }

  return (
    <section className="bg-white py-[25px] md:py-[50px] flex justify-center items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mx-auto mb-12">
          <h2 className="font-sans text-[24px] md:text-3xl lg:text-4xl font-bold text-primary">
            {t("sectionTitle")}
          </h2>
          <div className="w-[147px] md:w-[268px] h-[1px] bg-[#FF9700] mt-2 mx-auto" />
          <p className="text-gray-600 mt-6 text-base md:text-lg lg:text-xl">
            {t("sectionDescription")}
          </p>
        </div>
        <div className="lg:hidden">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {items.map((term) => (
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

        <div className="hidden lg:flex w-full max-w-6xl mx-auto shadow-md rounded-lg">
          <div className="w-1/3 bg-white p-8 rounded-l-lg">
            <ul className="space-y-4">
              {items.map((term) => (
                <li key={term.id}>
                  <button
                    onClick={() => setSelectedTerm(term)}
                    className={`w-full text-left p-3 rounded-md transition-colors font-semibold flex items-center gap-3 text-gray-600 ${
                      selectedTerm.id === term.id
                        ? "bg-[#EFF7FF] text-primary"
                        : "hover:[#E0E0E0]"
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

          <div className="w-2/3 bg-[#8FA6C3]/50 p-8 rounded-r-lg">
            <h2 className="font-geist text-3xl font-semibold text-black mb-2">
              {selectedTerm.title}
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              {t("lastUpdated")} {dateString}
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
