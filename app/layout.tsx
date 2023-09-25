import { ClerkProvider } from "@clerk/nextjs";
import React from "react";
import "./globals.css";
import { Inter, Space_Grotesk } from "next/font/google";
import type { Metadata } from "next";
import ThemeProvider from "@/context/ThemeProvider";
export const metadata: Metadata = {
  title: "StackOverFlow Clone",
  description: "blah blah blah",
  icons: {
    icon: "/assests/images/site-logo.svg",
  },
};

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-spaceGrotesk",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${spaceGrotesk.variable}`}>
        <h1 className="h1-bold">H1 asdfasdfs</h1>
        <ClerkProvider
          appearance={{
            elements: {
              formButtonPrimary: "primary-gradient",
              footerActionLink: "primary-text-gradient hover:text-primary-500",
            },
          }}
        >
          <ThemeProvider>{children}</ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
