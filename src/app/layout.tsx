"use client";

import "./globals.css";
import { ColorSchemeScript } from "@mantine/core";
import { usePathname } from "next/navigation";
import { CommonLayout } from "@/components/layouts/CommonLayout";
import { Providers } from "./providers";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const noLayoutPages = ["/", "/register", "/forgot-password"];
  const isNoLayoutPage = noLayoutPages.includes(pathname);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript defaultColorScheme="dark" />
      </head>
      <body>
        <Providers>{isNoLayoutPage ? children : <CommonLayout>{children}</CommonLayout>}</Providers>
      </body>
    </html>
  );
}
