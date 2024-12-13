'use client'

import './globals.css'

import { Inter } from 'next/font/google'
import { Header } from '@/components/Header'
import { AuthProvider } from '@/components/AuthProvider'
import { AuthHeader } from '@/components/AuthHeader'
import { usePathname } from 'next/navigation'
import { Provider } from 'react-redux'
import { store } from './store/store'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider store={store}>
          <AuthProvider>
            {pathname === '/login' || pathname === '/signup' ? <AuthHeader /> : <Header />}
            <main className="container mx-auto px-4 py-8">
              {children}
            </main>
          </AuthProvider>
        </Provider>
      </body>
    </html>
  )
}

