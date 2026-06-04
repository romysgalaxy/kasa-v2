import { Montserrat } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { AuthProvider } from "@/context/AuthContext";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "Kasa — Location de logements entre particuliers",
  description:
    "Avec Kasa, vivez des séjours uniques dans des hébergements chaleureux, sélectionnés avec soin par nos hôtes.",
};

/**
 * Layout racine : structure commune à toutes les pages (header + footer),
 * police Montserrat et providers globaux (session de connexion, favoris).
 * @param {Object} props
 * @param {import("react").ReactNode} props.children - La page active.
 */
export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={montserrat.className}>
      <body>
        <AuthProvider>
          <FavoritesProvider>
            <Header />
            {children}
            <Footer />
          </FavoritesProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
