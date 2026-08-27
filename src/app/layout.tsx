import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const satoshi = localFont({
  src: [
    {
      path: "../../public/fonts/Satoshi-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/Satoshi-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Satoshi-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/Satoshi-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-satoshi",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://danitherapies.com"),
  title: {
    default: "Dani Therapies | Cuidado energético e espiritual",
    template: "%s | Dani Therapies",
  },
  description:
    "Sessões online de cuidado energético, orientação espiritual e desenvolvimento pessoal.",
  icons: {
    icon: "/dani-therapies-logo-transparent.webp",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt"
      className={`${satoshi.variable} antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
