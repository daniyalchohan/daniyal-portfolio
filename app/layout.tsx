import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Daniyal Ali - UX/UI Designer',
  description: 'Portfolio of Daniyal Ali - UX/UI Designer with expertise in web design, app design, SaaS, and AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-primary text-text-primary`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
} 