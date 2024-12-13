import { Check } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "For beginners, hobbyists, and casual investors",
    features: [
      "Simple strategies in natural language",
      "Basic fields: Asset class, date range, simple asset search",
      "Equity & Mutual Funds (Limited selection)",
      "Minimal FnO (index futures only)",
      "Up to 6 months of historical data",
      "Daily or 30-minute data intervals",
      "Limited daily requests",
      "Basic search for well-known securities",
      "Single-asset, simple strategies",
      "Basic close-to-close simulations",
      "Total Return, Win Rate, Maximum Drawdown",
      "Standard PDF/HTML report",
      "Basic executive summary & key metrics",
      "Few pre-built template strategies",
      "Basic price data (OHLC) only"
    ],
    cta: "Start Free"
  },
  {
    name: "Pro",
    price: "$20",
    description: "For intermediate traders, analysts, and small teams",
    features: [
      "Complex, multi-parameter strategies",
      "Advanced parameters: volatility filters, multiple indicators",
      "Equities (stocks & ETFs), full Mutual Fund coverage",
      "Broad FnO (popular futures & options)",
      "Up to 2 years of historical data",
      "1-minute and 5-minute intervals available",
      "Increased daily request limits",
      "Advanced search with filters",
      "Multi-asset strategies",
      "Technical indicators (RSI, MACD)",
      "Intraday-level simulations with 1-minute granularity",
      "Sharpe Ratio, Sortino Ratio, Annualized Returns",
      "Detailed trade statistics",
      "Extended reports with methodology",
      "Export to PDF, CSV, Excel",
      "Expanded library of strategies",
      "Basic implied volatility for FnO",
      "Invite 1-2 team members",
      "Basic commenting on strategies"
    ],
    cta: "Upgrade to Pro"
  },
  {
    name: "Plus",
    price: "$40",
    description: "For professional traders, quantitative researchers, and small funds",
    features: [
      "Saved strategy templates for quick re-use",
      "Custom basket backtesting",
      "Up to 5+ years of historical data",
      "Full interval granularity (1-second to 1-day)",
      "Highest daily request limits",
      "Bulk selection from watchlists",
      "Custom asset groupings",
      "User-defined ticker sets",
      "Complex, algorithmic strategies",
      "Dynamic position sizing, advanced volatility models",
      "Rolling Sharpe, Monte Carlo simulations",
      "White-labeled, fully customizable reports",
      "Version-controlled strategy reports",
      "Strategy sharing within a private community",
      "Advanced greeks (Delta, Gamma, Theta, Vega)",
      "Sentiment indicators from integrated market news feeds",
      "Full API access",
      "Integrate custom datasets",
      "Webhook triggers for automated backtesting schedules",
      "Integration with Slack/Teams notifications"
    ],
    cta: "Upgrade to Plus"
  }
]

export function SubscriptionPlans() {
  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">Pricing</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Choose the right plan for you
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-8 sm:mt-20 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <Card key={plan.name} className={`flex flex-col justify-between ${index === 1 ? 'border-indigo-600 shadow-indigo-500/50 shadow-lg' : ''}`}>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <CardDescription className="text-sm text-gray-500">{plan.description}</CardDescription>
                <p className="mt-6">
                  <span className="text-4xl font-bold tracking-tight text-gray-900">{plan.price}</span>
                  <span className="text-sm font-semibold leading-6 tracking-wide text-gray-600">/month</span>
                </p>
              </CardHeader>
              <CardContent>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex">
                      <Check className="h-6 w-5 flex-shrink-0 text-indigo-600" />
                      <span className="ml-3 text-sm leading-6 text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant={index === 1 ? "default" : "outline"}>{plan.cta}</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

