import "./globals.css";
import { Inter } from "next/font/google";
import { ServerThemeProvider } from "next-themes";
import Providers from "./providers";
import { generalData } from "@/data/general";
import type { Metadata } from "next";
import GradientBackground from "@/components/gradient-bg";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: `${generalData.name}`,
  description:
    " hey! i am mehedi - a software engineer who loves simplicity and building fun products",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "",
    siteName: `${generalData.name} - ${generalData.jobTitle}`,
    title: `${generalData.name} - ${generalData.jobTitle}`,
    description:
      "hey! i am mehedi - a software engineer who loves simplicity and building fun products",
    images: [
      {
        url: "./cover.pong",
        width: 1200,
        height: 630,
        alt: `${generalData.name} - ${generalData.jobTitle}`,
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ServerThemeProvider attribute="class">
      <html lang="en">
        <Head>
          <title>mehedi hassan</title>
          <meta
            name="description"
            content="a software engineer based in london"
          />

          <meta property="og:title" content="mehedi hassan" key="title" />
          <meta
            property="og:description"
            content="a software engineer based in london"
          />
          <meta
            property="og:image"
            content="https://builtbymeh.com/cover.png"
          />
          <link rel="shortcut icon" href="/favicon.ico" />
        </Head>
        <body className={`${inter.className}`}>
          <GradientBackground>
            <Providers>{children}</Providers>
          </GradientBackground>
        </body>
      </html>
    </ServerThemeProvider>
  );
}
