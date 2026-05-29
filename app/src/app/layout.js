import { Montserrat } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "Kasa — Location de logements entre particuliers",
  description:
    "Avec Kasa, vivez des séjours uniques dans des hébergements chaleureux, sélectionnés avec soin par nos hôtes.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={montserrat.className}>
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
