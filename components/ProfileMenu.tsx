'use client'

import { useState } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { ChangePlanModal } from './ChangePlanModal'

interface ProfileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export function ProfileMenu({ isOpen, onClose }: ProfileMenuProps) {
  const [isChangePlanModalOpen, setIsChangePlanModalOpen] = useState(false)

  // Mock user data - replace with actual user data in a real application
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    currentPlan: "Pro"
  }

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Profile</SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-6">
            <div>
              <h3 className="font-semibold">Name</h3>
              <p>{user.name}</p>
            </div>
            <div>
              <h3 className="font-semibold">Email</h3>
              <p>{user.email}</p>
            </div>
            <div>
              <h3 className="font-semibold">Current Plan</h3>
              <p>{user.currentPlan}</p>
              <Button 
                variant="outline" 
                className="mt-2"
                onClick={() => setIsChangePlanModalOpen(true)}
              >
                Change Plan
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
      <ChangePlanModal 
        isOpen={isChangePlanModalOpen} 
        onClose={() => setIsChangePlanModalOpen(false)}
        currentPlan={user.currentPlan}
      />
    </>
  )
}

