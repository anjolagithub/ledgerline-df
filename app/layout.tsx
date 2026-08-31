import { Geist, Geist_Mono } from 'next/font/google'
import type { Metadata, Viewport } from 'next'
import './globals.css'
import { WalletProvider } from '../lib/WalletContext'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })

export const metadata: Metadata = {
  title: 'LedgerLine | Cross-chain credit intelligence',
  description: 'LedgerLine cross-chain credit intelligence for modern finance.',
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#030303',
  userScalable: false,
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="bg-[#0A0A0A]">
      <body className={`${geist.variable} ${geistMono.variable} antialiased`}>
        <WalletProvider>{children}</WalletProvider>
      </body>
    </html>
  )
}
