import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dekh Education - Admin Panel",
  description: "Modern Neumorphic Education Admin Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body
        className="min-h-full flex flex-col font-sans bg-[#F4F6FB] text-slate-800"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
