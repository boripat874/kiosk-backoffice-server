import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: [
    { path: "./fonts/Geist-Thin.ttf", weight: "100", style: "normal" },
    { path: "./fonts/Geist-ThinItalic.ttf", weight: "100", style: "italic" },
    { path: "./fonts/Geist-ExtraLight.ttf", weight: "200", style: "normal" },
    { path: "./fonts/Geist-ExtraLightItalic.ttf", weight: "200", style: "italic" },
    { path: "./fonts/Geist-Light.ttf", weight: "300", style: "normal" },
    { path: "./fonts/Geist-LightItalic.ttf", weight: "300", style: "italic" },
    { path: "./fonts/Geist-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/Geist-Italic.ttf", weight: "400", style: "italic" },
    { path: "./fonts/Geist-Medium.ttf", weight: "500", style: "normal" },
    { path: "./fonts/Geist-MediumItalic.ttf", weight: "500", style: "italic" },
    { path: "./fonts/Geist-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "./fonts/Geist-SemiBoldItalic.ttf", weight: "600", style: "italic" },
    { path: "./fonts/Geist-Bold.ttf", weight: "700", style: "normal" },
    { path: "./fonts/Geist-BoldItalic.ttf", weight: "700", style: "italic" },
    { path: "./fonts/Geist-ExtraBold.ttf", weight: "800", style: "normal" },
    { path: "./fonts/Geist-ExtraBoldItalic.ttf", weight: "800", style: "italic" },
    { path: "./fonts/Geist-Black.ttf", weight: "900", style: "normal" },
    { path: "./fonts/Geist-BlackItalic.ttf", weight: "900", style: "italic" },
  ],
  variable: "--font-geist-sans",
});

const geistMono = localFont({
  src: [
    { path: "./fonts/Geist-Regular.ttf", weight: "400", style: "normal" },
  ],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Kiosk Backoffice",
  description: "Kiosk Backoffice Management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* แก้ไขเพิ่มเติม: ใน Next.js สิ่งที่อยู่ในโฟลเดอร์ public ไม่ต้องใส่คำว่า /public ใน path ครับ */}
        <link rel="stylesheet" href="/css/all.min.css" />
        <link rel="icon" type="image/ico" sizes="32x32" href="/logo/logobackoffice.ico" />
      </head>

      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}