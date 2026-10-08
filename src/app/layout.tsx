import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ajay A - Full-stack developer",
  description:
    "Full-stack developer based in Bengaluru, India. I build web products from the interface to the API.",
  metadataBase: new URL("https://ajayha.dev"),
  openGraph: {
    title: "Ajay A - Full-stack developer",
    description: "I build web products from the interface to the API. Based in Bengaluru.",
    url: "https://ajayha.dev",
    siteName: "Ajay A Portfolio",
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#E8EAEE",
  colorScheme: "light dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-bg text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
