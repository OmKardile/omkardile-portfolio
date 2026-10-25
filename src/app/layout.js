import { Jost } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import "../styles/portfolio-editorial.css";

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://omkardile.is-a.dev"),
  title: {
    default: "Omkar Kardile — Developer & UI/UX Designer",
    template: "%s | Omkar Kardile",
  },
  description:
    "Portfolio of Omkar Kardile: a developer and UI/UX designer building thoughtful web, mobile, and product experiences.",
  openGraph: {
    title: "Omkar Kardile — Developer & UI/UX Designer",
    description:
      "Thoughtful digital products, interface explorations, and projects across design and development.",
    url: "https://omkardile.is-a.dev",
    siteName: "Omkar Kardile Portfolio",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Omkar Kardile — Developer & UI/UX Designer",
    description:
      "Thoughtful digital products, interface explorations, and projects across design and development.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={jost.variable}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
