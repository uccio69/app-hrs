import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HR Support Web App",
  description: "Soluzioni per Human Resource, Welfare e Sviluppo Software",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" suppressHydrationWarning>
      <body className="antialiased bg-bg-base text-text-main h-screen flex flex-col" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
