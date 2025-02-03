import nodemailer from "nodemailer";
import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import Order from "@/models/order.model";

export async function POST(request: NextRequest) {
    try {
        // Validate environment variables
        if (!process.env.RAZORPAY_WEBHOOK_SECRET || !process.env.MAILTRAP_USER || !process.env.MAILTRAP_PASS) {
            return NextResponse.json({ error: "Missing required environment variables" }, { status: 500 });
        }

        // Read request body and signature
        const body = await request.text();
        const signature = request.headers.get("x-razorpay-signature");
        if (!signature) {
            return NextResponse.json({ error: "No signature provided" }, { status: 400 });
        }

        // Verify webhook signature
        const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
        const expectedSignature = crypto
            .createHmac("sha256", secret)
            .update(body)
            .digest("hex");

        if (signature !== expectedSignature) {
            return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
        }

        // Parse event data
        const event = JSON.parse(body);
        console.log("Webhook event received:", event.event);

        // Connect to the database
        try {
            await connectToDB();
        } catch (error) {
            console.error("Database connection error:", error);
            return NextResponse.json({ error: "Failed to connect to the database" }, { status: 500 });
        }

        // Handle payment.captured event
        if (event.event === "payment.captured") {
            const payment = event.payload.payment.entity;
            console.log("Payment details:", payment);

            // Update order status in the database
            const order = await Order.findOneAndUpdate(
                { razorpayOrderId: payment.order_id },
                {
                    razorpayPaymentId: payment.id,
                    status: "completed",
                },
                { new: true } // Return the updated document
            ).populate([
                { path: "userId", select: "email" },
                { path: "productId", select: "name" },
            ]);

            if (order) {
                console.log("Updated order:", order);

                // Send email notification
                const transporter = nodemailer.createTransport({
                    service: "sandbox.smtp.mailtrap.io",
                    auth: {
                        user: process.env.MAILTRAP_USER,
                        pass: process.env.MAILTRAP_PASS,
                    },
                });

                try {
                    await transporter.sendMail({
                        from: '"Imagekit Store" <noreply@imagekitstore>',
                        to: order.userId.email,
                        subject: "Order Completed",
                        html: `
                            <h1>Order Completed</h1>
                            <p>Hi ${order.userId.email},</p>
                            <p>Thank you for your order of ${order.productId.name}.</p>
                            <p>Order Id: ${order._id}</p>
                            <p>Amount: ${order.amount}</p>
                            <p>Order Details:</p>
                            <ul>
                                <li>Product: ${order.productId.name}</li>
                                <li>Variant: ${order.variant.type}</li>
                                <li>License: ${order.variant.license}</li>
                            </ul>
                            <p>Your order has been successfully completed. We look forward to serving you again in the future.</p>
                            <p>Thank you for shopping with Imagekit Store.</p>
                        `.trim(),
                    });
                    console.log("Email sent successfully");
                } catch (error) {
                    console.error("Error sending email:", error);
                }
            }
        }

        return NextResponse.json({ status: "success", message: "Webhook processed successfully" });
    } catch (error) {
        console.error("Error processing Razorpay webhook:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}