'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface Plan {
  name: string
  price: string
  features: string[]
}

interface ChangePlanModalProps {
  isOpen: boolean
  onClose: () => void
  currentPlan: string
}

const plans: Plan[] = [
  {
    name: "Basic",
    price: "$9.99/month",
    features: ["Feature 1", "Feature 2", "Feature 3"]
  },
  {
    name: "Pro",
    price: "$19.99/month",
    features: ["All Basic features", "Feature 4", "Feature 5"]
  },
  {
    name: "Enterprise",
    price: "$49.99/month",
    features: ["All Pro features", "Feature 6", "Feature 7", "Feature 8"]
  }
]

export function ChangePlanModal({ isOpen, onClose, currentPlan }: ChangePlanModalProps) {
  const handleSwitchPlan = (planName: string) => {
    // Implement plan switching logic here
    console.log(`Switching to ${planName} plan`)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px]">
        <DialogHeader>
          <DialogTitle>Change Plan</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {plans.map((plan) => (
            <Card key={plan.name}>
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{plan.price}</p>
                <ul className="mt-4 space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => handleSwitchPlan(plan.name)}
                  disabled={plan.name === currentPlan}
                >
                  {plan.name === currentPlan ? "Current Plan" : "Switch Plan"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

