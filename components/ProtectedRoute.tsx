'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'

import { RootState } from '@/app/store/store'

import { Loading } from './Loading'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useSelector((state: RootState) => state.auth)
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && user === null) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return <Loading />
  }

  if (user === null) {
    return null
  }

  return <>{children}</>
}