'use client';

import './globals.css'

import { Inter } from 'next/font/google'
import { Header } from '@/components/Header'
import { AuthProvider } from '@/components/AuthProvider'
import { AuthHeader } from '@/components/AuthHeader'
import { usePathname } from 'next/navigation'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const paths_without_auth = ['/login', '/signup', '/privacy', '/terms', '/refund', '/contact']

  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {paths_without_auth.includes(pathname) ? <AuthHeader /> : <Header />}
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  )
}

