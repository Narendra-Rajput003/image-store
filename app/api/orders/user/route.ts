import { authOptions } from "@/lib/auth";
import { connectToDB } from "@/lib/db";
import Order from "@/models/order.model";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";


export async function GET(){
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user || !session.user.id) { // Added check for session.user.id
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        await connectToDB();
        const orders = await Order.find({ userId: session.user.id })
         .populate({
            path:"productId",
            select:"name imageUrl",
            options:{
                strictPopulate:false
            }
         })
         .sort({ createdAt: -1 })
         .lean();
        if (!orders || orders.length === 0) {
            return NextResponse.json([], { status: 200 });
        }

        const validOrders = orders.map((order)=>({
            ...order,
            productId:order.productId || {
                imageUrl:null,
                name:"Product no longer available"
            }

        }));

        return NextResponse.json(validOrders, { status: 200 });

    } catch (error) {
        console.error("Error fetching orders:", error);
        return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
        
    }
}