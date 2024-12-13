'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PrivacyPolicy() {
    return (
        <Card className="max-w-4xl mx-auto my-8">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">Privacy Policy</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm">
                <div className="space-y-6">
                    <section>
                        <h2 className="text-xl font-semibold">1. Introduction</h2>
                        <p>
                            Welcome to AlphaBench. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our backtesting platform. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the platform.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold">2. Information We Collect</h2>
                        <h3 className="text-lg font-medium">2.1 Personal Data</h3>
                        <ul className="list-disc pl-6">
                            <li>Name and email address when you create an account</li>
                            <li>Payment information when you subscribe to our services</li>
                            <li>Trading strategies and preferences you input for backtesting</li>
                            <li>Usage data and interaction with our platform</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold">3. How We Use Your Information</h2>
                        <ul className="list-disc pl-6">
                            <li>To provide and maintain our backtesting service</li>
                            <li>To notify you about changes to our service</li>
                            <li>To provide customer support</li>
                            <li>To process your payments</li>
                            <li>To analyze usage patterns and improve our platform</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold">4. Data Storage and Security</h2>
                        <p>
                            We implement appropriate technical and organizational security measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold">5. Third-Party Services</h2>
                        <p>
                            We use Razorpay for payment processing. Their use of your personal information is governed by their respective privacy policies.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold">6. Your Rights</h2>
                        <p>
                            You have the right to:
                        </p>
                        <ul className="list-disc pl-6">
                            <li>Access your personal data</li>
                            <li>Correct inaccurate data</li>
                            <li>Request deletion of your data</li>
                            <li>Object to processing of your data</li>
                            <li>Request data portability</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold">7. Contact Information</h2>
                        <p>
                            If you have any questions about this Privacy Policy, please contact us at:
                        </p>
                        <p className="mt-2">
                            Email: corevatsal@gmail.com<br />
                            Address: Dadar, Mumbai, 400014
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold">8. Updates to This Policy</h2>
                        <p>
                            We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page and updating the &quot;Last Updated&quot; date.
                        </p>
                        <p className="mt-4">
                            Last Updated: {new Date().toLocaleDateString()}
                        </p>
                    </section>
                </div>
            </CardContent>
        </Card>
    )
} 