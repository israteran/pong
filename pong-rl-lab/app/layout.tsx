import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pong RL Lab",
  description: "An educational reinforcement learning visualization through Pong.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
