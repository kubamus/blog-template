import type { Metadata } from "next"
import { Providers } from "@/components/providers"
import { Inter } from "next/font/google"

import "./globals.scss"

export const metadata: Metadata = {
  title: "Blog template",
  description: "Created by Kuba Musielski",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
}

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`antialiased ${inter.className}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
