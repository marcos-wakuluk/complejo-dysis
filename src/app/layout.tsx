import type { Metadata } from "next";
import "./globals.css";
import { ColorSchemeScript } from "@mantine/core";

export const metadata: Metadata = {
  title: "Complejo Dysis",
  description: "Complejo Dysis",
};

import { Providers } from "./providers";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript defaultColorScheme="dark" />
      </head>
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
