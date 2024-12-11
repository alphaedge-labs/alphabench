'use client'

import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"

interface BacktestResult {
  id: string
  date: string
  assetClass: string
  asset: string
}

interface SideDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function SideDrawer({ isOpen, onClose }: SideDrawerProps) {
  const [results, setResults] = useState<BacktestResult[]>([])

  useEffect(() => {
    // Fetch past results when the drawer opens
    if (isOpen) {
      fetchPastResults()
    }
  }, [isOpen])

  const fetchPastResults = async () => {
    try {
      const response = await fetch('/api/v1/past-backtests')
      if (!response.ok) {
        throw new Error('Failed to fetch past results')
      }
      const data = await response.json()
      setResults(data)
    } catch (error) {
      console.error('Error fetching past results:', error)
    }
  }

  const groupedResults = results.reduce((acc, result) => {
    const date = format(new Date(result.date), 'yyyy-MM-dd')
    if (!acc[date]) {
      acc[date] = []
    }
    acc[date].push(result)
    return acc
  }, {} as Record<string, BacktestResult[]>)

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Past Backtested Results</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-80px)] mt-6">
          {Object.entries(groupedResults).map(([date, dateResults]) => (
            <div key={date} className="mb-6">
              <h3 className="font-semibold mb-2">{format(new Date(date), 'MMMM d, yyyy')}</h3>
              <ul className="space-y-2">
                {dateResults.map((result) => (
                  <li key={result.id} className="bg-secondary p-2 rounded">
                    <p className="font-medium">{result.assetClass}</p>
                    <p className="text-sm text-muted-foreground">{result.asset}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

