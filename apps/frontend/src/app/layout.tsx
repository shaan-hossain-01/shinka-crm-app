import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthProvider";

export const metadata: Metadata = {
  title: "Shinka - Social Media Platform",
  description: "Connect with friends and share moments",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
