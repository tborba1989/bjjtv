// src/app/layout.tsx
import Header from '@/components/homepage/Header'
import MainBanner from '@/components/homepage/MainBanner'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  )
}
