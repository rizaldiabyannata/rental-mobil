import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default async function PublicLayout({ children, params: { locale } }) {
  let messages;
  try {
    messages = await getMessages({ locale });
  } catch (error) {
    console.error("Failed to load messages:", error);
    // Optionally, handle the error gracefully, e.g., by providing empty messages
    messages = {};
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div className="flex flex-col min-h-screen w-full bg-white">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </div>
    </NextIntlClientProvider>
  );
}
