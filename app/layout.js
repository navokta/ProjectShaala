import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CursorProvider } from '@/context/CursorContext';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "ProjectShaala",
  description: "A dynamic marketplace to buy and sell software projects.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CursorProvider>
          {children}
        </CursorProvider>
      </body>
    </html>
  );
}