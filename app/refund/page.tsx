'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function RefundPolicy() {
    return (
        <Card className="max-w-4xl mx-auto my-8">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">Refund and Cancellation Policy</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm">
                <div className="space-y-6">
                    <section>
                        <h2 className="text-xl font-semibold">1. Subscription Cancellation</h2>
                        <p>
                            You may cancel your subscription at any time through your account settings. Upon cancellation:
                        </p>
                        <ul className="list-disc pl-6">
                            <li>You will maintain access to the service until the end of your current billing period</li>
                            <li>No partial refunds will be issued for unused time in the current billing period</li>
                            <li>You will not be charged for subsequent billing periods</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold">2. Refund Policy</h2>
                        <p>
                            2.1. 7-Day Money-Back Guarantee
                        </p>
                        <ul className="list-disc pl-6">
                            <li>New subscribers are eligible for a full refund within 7 days of their initial subscription purchase</li>
                            <li>The refund must be requested within this 7-day period</li>
                            <li>This guarantee applies only to first-time subscribers</li>
                        </ul>

                        <p className="mt-4">
                            2.2. Refund Exclusions
                        </p>
                        <ul className="list-disc pl-6">
                            <li>Refunds are not available for partial months of service</li>
                            <li>Subscription renewals are not eligible for refunds</li>
                            <li>Used backtesting credits cannot be refunded</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold">3. How to Request a Refund</h2>
                        <p>
                            To request a refund:
                        </p>
                        <ol className="list-decimal pl-6">
                            <li>Email us at corevatsal@gmail.com</li>
                            <li>Include your account email and reason for the refund</li>
                            <li>Provide the date of purchase</li>
                        </ol>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold">4. Processing of Refunds</h2>
                        <ul className="list-disc pl-6">
                            <li>Refunds will be processed through the original payment method</li>
                            <li>Processing time may take 5-10 business days</li>
                            <li>You will receive an email confirmation once the refund is processed</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold">5. Contact Information</h2>
                        <p>
                            For any questions about our refund and cancellation policy, please contact us at:
                        </p>
                        <p className="mt-2">
                            Email: corevatsal@gmail.com<br />
                            Address: Dadar, Mumbai, 400014
                        </p>
                    </section>

                    <p className="mt-4">
                        Last Updated: {new Date().toLocaleDateString()}
                    </p>
                </div>
            </CardContent>
        </Card>
    )
} 