import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Blogeek",
  description: "Um blog para compartilhar ideias",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-gray-950 text-gray-100`}>
        <AuthProvider>
          <main className="min-h-screen">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}