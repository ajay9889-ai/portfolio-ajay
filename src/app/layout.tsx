import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Inter_Tight } from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Ajay H A - Full-stack developer",
  description:
    "Full-stack developer based in Bengaluru, India. Crafting calm, intentional web applications with high-performance architectures.",
  metadataBase: new URL("https://ajayha.dev"),
  openGraph: {
    title: "Ajay H A - Full-stack developer",
    description: "Full-stack developer based in Bengaluru, India.",
    url: "https://ajayha.dev",
    siteName: "Ajay H A Portfolio",
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#0E0E12",
  colorScheme: "dark light",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${bricolage.variable} ${interTight.variable}`}>
      <body className="min-h-screen bg-bg text-text selection:bg-accent selection:text-bg antialiased">
        {children}
      </body>
    </html>
  );
}
