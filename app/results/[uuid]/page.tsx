'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function ResultsPage({ params }: { params: { uuid: string } }) {
  const [results, setResults] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch(`/api/v1/backtest?id=${params.uuid}`)
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        const data = await response.json()
        setResults(data)
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchResults()
  }, [params.uuid])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <main className="flex min-h-screen w-full p-4">
      <Card className="flex flex-col w-full h-full">
        <CardHeader>
          <CardTitle>Backtesting Results</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow overflow-auto">
          {/* Display results here */}
          <pre>{JSON.stringify(results, null, 2)}</pre>
        </CardContent>
        <CardFooter className="mt-auto flex flex-col sm:flex-row justify-between gap-4">
          <Button onClick={() => router.push('/')} className="w-full sm:w-auto">
            Generate New Backtesting Report
          </Button>
          <Button 
            onClick={() => router.push('/')} 
            className="w-full sm:w-auto bg-white text-black magical-border"
            variant="outline"
          >
            Alter Your Requirements
          </Button>
        </CardFooter>
      </Card>
    </main>
  )
}

