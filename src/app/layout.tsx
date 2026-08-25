import type { Metadata } from "next";
import Navbar from "@/components/navigation/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "ICTNET101",
  description: "Interactive Networking Learning Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="blue"
      data-mode="light"
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
        <Navbar />
        {children}
      </body>
    </html>
  );
}