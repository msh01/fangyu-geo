import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "读史方舆纪要可视化",
  description: "读史方舆纪要各区域序的历史地理可视化阅读界面",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
