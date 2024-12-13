'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TermsAndConditions() {
    return (
        <Card className="max-w-4xl mx-auto my-8">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">Terms and Conditions</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm">
                <div className="space-y-6">
                    <section>
                        <h2 className="text-xl font-semibold">1. Agreement to Terms</h2>
                        <p>
                            By accessing and using AlphaBench, you agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, you may not access the service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold">2. Description of Service</h2>
                        <p>
                            AlphaBench is a backtesting platform that allows users to test trading strategies using historical market data. The service includes:
                        </p>
                        <ul className="list-disc pl-6">
                            <li>Access to backtesting tools</li>
                            <li>Generation of performance reports</li>
                            <li>Storage of backtesting results</li>
                            <li>Subscription-based access to advanced features</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold">3. User Accounts</h2>
                        <p>
                            3.1. New users receive 3 free backtesting results upon registration.<br />
                            3.2. Additional backtesting requires a paid subscription plan.<br />
                            3.3. You are responsible for maintaining the confidentiality of your account credentials.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold">4. Subscription and Payments</h2>
                        <p>
                            4.1. Subscription fees are billed in advance.<br />
                            4.2. All payments are processed through Razorpay.<br />
                            4.3. Prices are subject to change with notice.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold">5. Intellectual Property</h2>
                        <p>
                            5.1. The platform and its original content are and will remain the exclusive property of AlphaBench.<br />
                            5.2. Your backtesting strategies remain your intellectual property.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold">6. Limitation of Liability</h2>
                        <p>
                            6.1. AlphaBench is not responsible for any financial losses incurred from using our backtesting results.<br />
                            6.2. Past performance is not indicative of future results.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold">7. Termination</h2>
                        <p>
                            We reserve the right to terminate or suspend access to our service immediately, without prior notice, for any breach of these Terms and Conditions.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold">8. Changes to Terms</h2>
                        <p>
                            We reserve the right to modify these terms at any time. We will notify users of any changes by updating the &quot;Last Updated&quot; date.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold">9. Contact Information</h2>
                        <p>
                            For any questions regarding these terms, please contact:<br />
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