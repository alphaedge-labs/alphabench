'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { DatePickerWithRange } from './DatePickerWithRange'
import { AssetSearch } from './AssetSearch'
import { BacktestingModal } from './BacktestingModal'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import { Info } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

const borderAnimation = keyframes`
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 300% 50%;
  }
`;

const MagicalTextarea = styled(Textarea)`
  &.magical-border {
    border: 1px solid transparent;
    background-image: linear-gradient(#fff, #fff), 
                      linear-gradient(90deg, #00f260, #0575e6, #00f260);
    background-origin: border-box;
    background-clip: padding-box, border-box;
    animation: ${borderAnimation} 3s linear infinite;
    background-size: 300% 100%;
  }
`;

export function BacktestForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [uuid, setUuid] = useState('')
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null)
  const [strategyText, setStrategyText] = useState('')

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    setNotification(null)

    const formData = new FormData(event.currentTarget)
    const data = Object.fromEntries(formData)

    try {
      console.log('Submitting data:', data)

      const response = await fetch('/api/v1/backtest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Network response was not ok: ${response.status} ${response.statusText}. ${errorText}`)
      }

      const result = await response.json()
      console.log('API response:', result)

      if (!result.uuid) {
        throw new Error('UUID not received from the server')
      }

      setUuid(result.uuid)

      // Simulate progress
      for (let i = 0; i <= 100; i += 10) {
        setProgress(i)
        await new Promise(resolve => setTimeout(resolve, 500))
      }

      setNotification({ type: 'success', message: "Backtesting Complete. Your report is ready to view." })
      router.push(`/results/${result.uuid}`)

    } catch (error) {
      console.error('Error in handleSubmit:', error)
      setNotification({ type: 'error', message: error instanceof Error ? error.message : "An unknown error occurred" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Backtesting Form</CardTitle>
      </CardHeader>
      <CardContent>
        {notification && (
          <Alert variant={notification.type === 'error' ? "destructive" : "default"} className="mb-4">
            <AlertTitle>{notification.type === 'error' ? "Error" : "Success"}</AlertTitle>
            <AlertDescription>{notification.message}</AlertDescription>
          </Alert>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label>What asset class are you aiming for?</Label>
            <RadioGroup defaultValue="equity" name="assetClass">
              <div className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="equity" id="equity" />
                  <Label htmlFor="equity">Equity</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="fno" id="fno" />
                  <Label htmlFor="fno">FnO</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="mutualFunds" id="mutualFunds" />
                  <Label htmlFor="mutualFunds">Mutual Funds</Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>What is the date range you&apos;re aiming for?</Label>
            <DatePickerWithRange />
          </div>

          <div className="space-y-2">
            <Label>What is the asset (or group of assets) you&apos;re targeting?</Label>
            <AssetSearch />
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Label htmlFor="strategy">Tell me your strategy in simplest words</Label>
              <Dialog>
                <DialogTrigger asChild>
                  <Info className="h-4 w-4 text-gray-500 cursor-pointer" />
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Strategy Examples</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-2">
                    {['Buy low, sell high', 'Dollar-cost averaging', 'Trend following'].map((strategy, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        onClick={() => {
                          setStrategyText(strategy)
                          document.getElementById('strategy')?.focus()
                        }}
                      >
                        {strategy}
                      </Button>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <MagicalTextarea
              id="strategy"
              name="strategy"
              placeholder="Describe your strategy here..."
              maxLength={800}
              className="magical-border bg-white"
              value={strategyText}
              onChange={(e) => setStrategyText(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Submitting...' : 'Submit'}
          </Button>
        </form>
      </CardContent>
      {isLoading && (
        <BacktestingModal progress={progress} uuid={uuid} />
      )}
    </Card>
  )
}

