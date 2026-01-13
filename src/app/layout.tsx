import type { Metadata } from "next";
import "./globals.css";
import VisualEditsMessenger from "../visual-edits/VisualEditsMessenger";
import Script from "next/script";
import { AuthProvider } from "@/components/AuthContext";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "e-WasteX | Electronic Waste Exchange",
  description: "Connect sellers with certified recyclers for a circular, sustainable future.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Script
          id="orchids-browser-logs"
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts/orchids-browser-logs.js"
          strategy="afterInteractive"
          data-orchids-project-id="7a34e62c-992d-4faa-ad76-3b9d10a9ae18"
        />
        <AuthProvider>
          <Navbar />
          <main className="pt-20">
            {children}
          </main>
          <Toaster position="top-center" />
          <VisualEditsMessenger />
        </AuthProvider>
      </body>
    </html>
  );
}
