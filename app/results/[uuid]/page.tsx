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
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Backtesting Results</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Display results here */}
          <pre>{JSON.stringify(results, null, 2)}</pre>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={() => router.push('/')}>Generate New Backtesting Report</Button>
          <Button onClick={() => router.push('/')}>Alter Your Requirements</Button>
        </CardFooter>
      </Card>
    </main>
  )
}

