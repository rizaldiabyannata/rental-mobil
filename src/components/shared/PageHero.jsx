
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

const Breadcrumb = ({ items }) => {
  return (
    <nav className="flex items-center text-sm text-gray-200">
      <Link href="/" className="hover:text-white">
        Home
      </Link>
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          <ChevronRight className="mx-2 size-4" />
          {item.href ? (
            <Link href={item.href} className="hover:text-white">
              {item.label}
            </Link>
          ) : (
            <span className="font-semibold text-white">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
};

const PageHero = ({ title, breadcrumbs, backgroundImage }) => {
  const bgImage = backgroundImage || "/gallery-3.jpg"; // Fallback image

  return (
    <section className="relative bg-cover bg-center py-24 md:py-32">
      <div className="absolute inset-0">
        <Image
          src={bgImage}
          alt={title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>
      <div className="container relative z-10 mx-auto px-4 text-center text-white">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          {title}
        </h1>
        {breadcrumbs && (
          <div className="mt-4 flex justify-center">
            <Breadcrumb items={breadcrumbs} />
          </div>
        )}
      </div>
    </section>
  );
};

export default PageHero;
