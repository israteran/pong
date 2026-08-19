import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pong RL Lab",
  description: "Visualización educativa de reinforcement learning a través de Pong.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
