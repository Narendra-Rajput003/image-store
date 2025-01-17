import {NextResponse} from "next/server";
import {connectToDB} from "@/lib/db";
import Product from "@/models/product.model";


export async function GET ({params}:{params:{id:string}}){
    try{
        const {id}=params;
        await connectToDB();
        const product = await  Product.findById(id).lean();
        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        return NextResponse.json(product);

    }catch(error){
        console.error("Error fetching product:", error);
        return NextResponse.json(
            { error: "Failed to fetch product" },
            { status: 500 }
        );
    }
}