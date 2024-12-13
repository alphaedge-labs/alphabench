'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { loadRazorpay } from '@/lib/razorpay'

interface RazorpayResponse {
    razorpay_payment_id: string
    razorpay_order_id: string
    razorpay_signature: string
}

interface Plan {
    id: string
    name: string
    price: number
    credits: number
    features: string[]
}

interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description: string;
    order_id: string;
    handler: (response: RazorpayResponse) => void;
    prefill: {
        email: string;
    };
    theme: {
        color: string;
    };
}

interface RazorpayConstructor {
    new(options: RazorpayOptions): {
        open(): void;
    };
}

const plans: Plan[] = [
    {
        id: 'basic',
        name: 'Basic',
        price: 999,
        credits: 10,
        features: [
            '10 Backtesting Credits',
            'Basic Reports',
            'Email Support',
        ]
    },
    {
        id: 'pro',
        name: 'Professional',
        price: 1999,
        credits: 25,
        features: [
            '25 Backtesting Credits',
            'Advanced Reports',
            'Priority Support',
            'Strategy Optimization'
        ]
    },
    {
        id: 'enterprise',
        name: 'Enterprise',
        price: 4999,
        credits: 100,
        features: [
            '100 Backtesting Credits',
            'Premium Reports',
            '24/7 Support',
            'Strategy Optimization',
            'Custom Indicators'
        ]
    }
]

export function PaymentFlow() {
    const { toast } = useToast()
    const [isProcessing, setIsProcessing] = useState(false)

    const handlePayment = async (plan: Plan) => {
        setIsProcessing(true)

        try {
            // Load Razorpay script
            await loadRazorpay()

            // Create order on your backend
            const response = await fetch('/api/create-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    planId: plan.id,
                    amount: plan.price,
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Failed to create order')
            }

            if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
                throw new Error('Razorpay key is not configured');
            }

            // Initialize Razorpay payment
            const options: RazorpayOptions = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: plan.price * 100, // Amount in paise
                currency: "INR",
                name: "AlphaBench",
                description: `${plan.name} Plan Subscription`,
                order_id: data.orderId,
                handler: async function (response: RazorpayResponse) {
                    // Verify payment on your backend
                    const verificationResponse = await fetch('/api/verify-payment', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature,
                        }),
                    })

                    const verificationData = await verificationResponse.json()

                    if (verificationResponse.ok) {
                        toast({
                            title: "Payment Successful",
                            description: `Your ${plan.name} plan is now active!`,
                        })
                    } else {
                        throw new Error(verificationData.message || 'Payment verification failed')
                    }
                },
                prefill: {
                    email: "user@example.com", // Replace with actual user email
                },
                theme: {
                    color: "#000000",
                },
            }

            const razorpay = new ((window as unknown as { Razorpay: RazorpayConstructor }).Razorpay)(options)
            razorpay.open()
        } catch (error) {
            console.error('Payment error:', error)
            toast({
                title: "Payment Failed",
                description: error instanceof Error ? error.message : "Something went wrong",
                variant: "destructive",
            })
        } finally {
            setIsProcessing(false)
        }
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto my-8">
            {plans.map((plan) => (
                <Card key={plan.id} className="flex flex-col">
                    <CardHeader>
                        <CardTitle>{plan.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <p className="text-3xl font-bold">₹{plan.price}</p>
                        <p className="text-sm text-muted-foreground">per month</p>
                        <ul className="mt-4 space-y-2">
                            {plan.features.map((feature, index) => (
                                <li key={index} className="flex items-center">
                                    <span className="mr-2">✓</span>
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button
                            className="w-full"
                            onClick={() => handlePayment(plan)}
                            disabled={isProcessing}
                        >
                            {isProcessing ? 'Processing...' : 'Subscribe Now'}
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    )
} 