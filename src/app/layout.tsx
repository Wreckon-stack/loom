import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import AIChatWidget from "@/components/AIChatWidget";
import { AuthProvider } from "@/lib/auth-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Loom - Crypto Community Platform",
  description:
    "The ultimate crypto community platform powered by AI. Join discussions, share alpha, and connect with fellow degens.",
  metadataBase: new URL(
    process.env.NEXTAUTH_URL || "http://localhost:3000"
  ),
  openGraph: {
    title: "Loom - Crypto Community Platform",
    description:
      "The ultimate crypto community platform powered by AI. Join discussions, share alpha, and connect with fellow degens.",
    siteName: "Loom",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Loom - Crypto Community Platform",
    description:
      "The ultimate crypto community platform powered by AI.",
  },
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <AIChatWidget />
        </AuthProvider>
      </body>
    </html>
  );
}
