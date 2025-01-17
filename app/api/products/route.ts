import {NextRequest, NextResponse} from "next/server";
import {connectToDB} from "@/lib/db";
import Product, {IProduct} from "@/models/product.model";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";


export async function GET(){
    try{
        await connectToDB();

        ////test the lean method
        const products = await Product.find({}).lean();
        console.log("products",products);

        if(!products || products.length===0){
            return  NextResponse.json([],{status:404})
        }
        return NextResponse.json(products);
    }catch(error){
        console.error("Get Products  error:", error);
        return NextResponse.json(error);

    }
}


export async function POST(req:NextRequest){
    try{

        const session = await  getServerSession(authOptions);
        if(session?.user.role!=="admin"){
            return  NextResponse.json({error:"Unauthorized"},{status:401});
        }
        await connectToDB();

        const body:IProduct=await req.json();
        if(!body.name || !body.imageUrl || !body.variants.length===0){
            return NextResponse.json(
                {error:"All the fields are required"},
                {status:400}
            );

        }

        //validate variants

        for(const variant of body.variants){
            if(!variant.type || !variant.license || !variant.price ){
                return  NextResponse.json({error:"Unknown variant type"});
            }
        }

        const newProduct = await Product.create(body);
        return  NextResponse.json(newProduct);

    }catch(error){
        console.error("Product creation error:", error)
        return NextResponse.json(
            {error:"Product creation error"},
            {status:500}
        )
    }
}