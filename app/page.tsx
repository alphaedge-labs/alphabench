import { BacktestForm } from '@/components/BacktestForm'
import { ProtectedRoute } from '@/components/ProtectedRoute'

export default function Home() {
  return (
    <ProtectedRoute>
      <main className="container mx-auto px-4 py-8">
        <BacktestForm />
      </main>
    </ProtectedRoute>
  )
}

