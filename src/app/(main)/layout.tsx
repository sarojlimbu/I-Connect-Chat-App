import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { Toaster } from "sonner";
import Sidebar from "@/components/sidebar/Sidebar";

import PresenceTracker from "@/components/chat/PresenceTracker";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "I-Connect",
  description: "Seamless chatting application",
};

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-row justify-center items-center h-screen w-screen`}
      >
        <PresenceTracker />
        <Sidebar />
        <main className="w-full h-full">
          {children}
          <Toaster />
        </main>
      </body>
    </html>
  );
}
