import type { Metadata } from "next";
import { Outfit, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Silent Learn — India's Learning Platform for Deaf Students",
  description: "A comprehensive visual learning ecosystem for Deaf students in India. Master Indian Sign Language (ISL), explore AR experiences, and learn through interactive visual lessons.",
  keywords: ["Deaf Education", "Indian Sign Language", "ISL", "AR Learning", "Accessibility", "Sign Language Detection", "Visual Learning", "India"],
  authors: [{ name: "Silent Learn Team" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Silent Learn — India's Learning Platform for Deaf Students",
    description: "Master ISL, explore AR lessons, and learn visually. Built for Deaf students in India.",
    url: "https://silentlearn.com",
    siteName: "Silent Learn",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Silent Learn — India's Learning Platform for Deaf Students",
    description: "Master ISL, explore AR lessons, and learn visually. Built for Deaf students in India.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${outfit.variable} ${geistMono.variable} font-sans antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
