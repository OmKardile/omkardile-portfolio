import { DM_Sans, Playfair_Display } from "next/font/google";
import UIUXPortfolioPage from "@/components/uiux/UIUXPortfolioPage";

const display = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-uiux-display",
  weight: ["400", "600"],
});

const body = DM_Sans({
  subsets: ["latin"],
  variable: "--font-uiux-body",
  weight: ["300", "400", "500"],
});

export const metadata = {
  title: "Omkar Kardile — Design Portfolio",
  description: "Editorial UI/UX portfolio page for Omkar Kardile.",
};

export default function UIUXPage() {
  return (
    <div className={`${display.variable} ${body.variable}`}>
      <UIUXPortfolioPage />
    </div>
  );
}
