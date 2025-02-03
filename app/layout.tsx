import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import Providers from "./components/Providers";
import Header from "./components/Header";

const inter =  Inter({subsets:['latin']})


export const metadata: Metadata = {
  title: "Image Store",
  description: "Store ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={inter.className}
      >
        <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
        />
        <Providers>
          <Header/>
          <main className="container mx-auto px-4 py-8">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
