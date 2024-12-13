'use client'

import { useState } from 'react'
import { Menu, User } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { SideDrawer } from './SideDrawer'
import { ProfileMenu } from './ProfileMenu'
import { LandingHeader } from './LandingHeader'
import { usePathname } from 'next/navigation'

export function Header() {
  const [isSideDrawerOpen, setIsSideDrawerOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const pathname = usePathname()
  const useLandingHeader = ['/', '/privacy', '/about', '/subscription', '/pricing', '/terms'].includes(pathname)

  if (useLandingHeader) return <LandingHeader />;

  return (
    <header className="bg-primary text-primary-foreground py-4 px-6 flex items-center justify-between">
      <Button variant="ghost" size="icon" onClick={() => setIsSideDrawerOpen(true)}>
        <Menu className="h-6 w-6" />
      </Button>
      <div className="flex flex-col items-center">
        <h1 className="text-2xl font-bold tracking-tight">AlphaBench</h1>
        <p className="text-xs text-primary-foreground/70">Backtesting Engine powered by alphaedge</p>
      </div>
      <Button variant="ghost" size="icon" onClick={() => setIsProfileMenuOpen(true)}>
        <User className="h-6 w-6" />
      </Button>
      <SideDrawer isOpen={isSideDrawerOpen} onClose={() => setIsSideDrawerOpen(false)} />
      <ProfileMenu isOpen={isProfileMenuOpen} onClose={() => setIsProfileMenuOpen(false)} />
    </header>
  )
}

