import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SlideLife — A day moves around the world",
  description: "Turn your day into a visual story and pass it on.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
