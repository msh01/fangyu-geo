import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "古代地缘形势推演",
  description: "用地图、拓扑网络和指标图探索古代区域地缘形势。",
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
