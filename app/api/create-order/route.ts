import { NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
	key_id: process.env.RAZORPAY_KEY_ID!,
	key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: Request) {
	try {
		const { amount } = await request.json();

		const order = await razorpay.orders.create({
			amount: amount * 100, // amount in paise
			currency: "INR",
		});

		return NextResponse.json({ orderId: order.id });
	} catch (error) {
		console.error("Create order error:", error);
		return NextResponse.json(
			{ message: "Failed to create order" },
			{ status: 500 }
		);
	}
}
