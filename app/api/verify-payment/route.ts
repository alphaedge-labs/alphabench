import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: Request) {
	try {
		const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
			await request.json();

		// Verify signature
		const text = `${razorpay_order_id}|${razorpay_payment_id}`;
		const generated_signature = crypto
			.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
			.update(text)
			.digest("hex");

		if (generated_signature === razorpay_signature) {
			// Payment is verified
			// Update user's subscription status in your database
			return NextResponse.json({ success: true });
		} else {
			return NextResponse.json(
				{ message: "Invalid signature" },
				{ status: 400 }
			);
		}
	} catch (error) {
		console.error("Verify payment error:", error);
		return NextResponse.json(
			{ message: "Payment verification failed" },
			{ status: 500 }
		);
	}
}
