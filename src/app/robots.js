const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.rentalmobil.com";

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
