import "./globals.css";
import {
  Space_Grotesk,
  Instrument_Serif,
  Space_Mono,
  Raleway,
  Fraunces,
} from "next/font/google";
import Providers from "./providers";
import { generalData } from "@/data/general";
import type { Metadata, Viewport } from "next";
import HalftoneBackground from "@/components/halftone-bg";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-display",
  weight: "400",
  style: ["normal", "italic"],
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-mono",
});

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "mehedi hassan",
  description: "engineer building fun things :)",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "",
    siteName: "mehedi hassan",
    title: "mehedi hassan",
    description: "engineer building fun things :)",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: `${generalData.name}`,
      },
    ],
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} ${instrumentSerif.variable} ${spaceMono.variable} ${raleway.variable} ${fraunces.variable} font-sans`}
      >
        <Providers>
          <HalftoneBackground>{children}</HalftoneBackground>
        </Providers>
      </body>
    </html>
  );
}
