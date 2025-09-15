import { Unbounded, Manrope } from "next/font/google";
import Header from "@/src/components/common/Header";
import Footer from "@/src/components/common/Footer";
import { AuthProvider } from "@/src/contexts/AuthContext";
import "./globals.css";

const unbounded = Unbounded({
  subsets: ["latin"],
  variable: "--font-unbounded",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

export const metadata = {
  title: "Gambrills Partners",
  description: "Gambrills Partners - A global consulting firm.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${unbounded.variable} ${manrope.variable} font-primary`}
      >
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main>{children}</main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
