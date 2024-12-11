import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'

interface BacktestingModalProps {
  progress: number
  uuid: string
}

export function BacktestingModal({ progress, uuid }: BacktestingModalProps) {
  const router = useRouter()

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4">
          {progress < 100 ? 'Backtesting...' : 'Backtesting Complete'}
        </h2>
        <Progress value={progress} className="mb-4" />
        {progress === 100 && uuid && (
          <Button onClick={() => router.push(`/results/${uuid}`)} className="w-full">
            View Results
          </Button>
        )}
      </div>
    </div>
  )
}

