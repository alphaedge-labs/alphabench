'use client'

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { useSelector } from 'react-redux'
import { RootState } from '@/app/store/store'

export function LandingHeader() {
  const user = useSelector((state: RootState) => state.auth.user)

  return (
    <header className="bg-white py-4 px-6 flex flex-col sm:flex-row items-center justify-between">
      <div className="flex flex-col items-center sm:items-start mb-4 sm:mb-0">
        <h1 className="text-2xl font-bold text-gray-900">AlphaBench</h1>
        <p className="text-sm text-gray-600">powered by alphaedge</p>
      </div>
      <nav className="flex space-x-4 mb-4 sm:mb-0">
        <Link href="/about" className="text-gray-600 hover:text-gray-900">About</Link>
        <Link href="/privacy" className="text-gray-600 hover:text-gray-900">Privacy</Link>
        <Link href="/subscription" className="text-gray-600 hover:text-gray-900">Pricing</Link>
      </nav>
      <Button asChild>
        <Link href={user ? '/' : '/login'}>
          {user ? 'Resume Testing' : 'App Login'}
        </Link>
      </Button>
    </header>
  )
}

