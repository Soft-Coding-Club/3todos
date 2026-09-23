import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://3todos.vercel.app"),
  title: "3todos",
  description: "three things.",
  openGraph: {
    title: "3todos",
    description: "three things.",
    url: "https://3todos.vercel.app",
    images: [{ url: "/og2.jpg" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "3todos",
    description: "three things.",
    images: ["/og2.jpg"],
  },
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
