import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Voice Assistant",
  description: "Created by Max Braun",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-slate-900 text-white">
        {children}
      </body>
    </html>
  );
}
