import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "3todos",
  description: "Only 3 todos. That's it.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${ibmPlexMono.variable} h-full antialiased`}
    >
      <body className={`min-h-full flex flex-col font-mono ${ibmPlexMono.variable}`} style={{ fontFamily: "var(--font-ibm-plex-mono), monospace" }}>{children}</body>
    </html>
  );
}
