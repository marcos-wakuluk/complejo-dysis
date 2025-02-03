"use client";

import "./globals.css";
import { ColorSchemeScript } from "@mantine/core";
import { usePathname } from "next/navigation";
import { CommonLayout } from "@/components/layouts/CommonLayout";
import { Providers } from "./providers";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/";

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript defaultColorScheme="dark" />
      </head>
      <body>
        <Providers>{isLoginPage ? children : <CommonLayout>{children}</CommonLayout>}</Providers>
      </body>
    </html>
  );
}
