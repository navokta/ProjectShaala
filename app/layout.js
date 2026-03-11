// app/layout.tsx
import { Inter, Poppins, Dancing_Script } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

const dancingScript = Dancing_Script({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-signature",
  display: "swap",
});

export const metadata = {
  title: "ProjectShaala",
  description: "A dynamic marketplace to buy and sell software projects.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${poppins.variable}${dancingScript.variable} font-sans antialiased`}
    >
      <head />
      <link
        href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600;700&display=swap"
        rel="stylesheet"
      />
      <head />
      <body className="antialiased">{children}</body>
    </html>
  );
}
