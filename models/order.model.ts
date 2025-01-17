import mongoose, {Schema,models,model} from 'mongoose';
import {ImageVariant} from "@/models/product.model";


interface  PopulatedUser{
    _id:mongoose.Types.ObjectId,
    email:String,
}

interface  PopulatedProduct{
    _id:mongoose.Types.ObjectId,
    name:String,
    imageUrl:String,
}

export interface IOrder {
    _id:mongoose.Types.ObjectId;
    userId:mongoose.Types.ObjectId | PopulatedUser;
    productId:mongoose.Types.ObjectId | PopulatedProduct;
    variant:ImageVariant;
    razorpayOrderId:string;
    razorpayPaymentId?:string;
    amount:number;
    status:"pending" | "completed" | "failed";
    downloadUrl?:string;
    previewUrl?:string;
    createdAt?:Date;
    updatedAt?:Date;

}

const orderSchema = new Schema<IOrder>({
   userId:{
       type:Schema.Types.ObjectId,
       ref: 'User',
       required: true
   },
    productId:{
       type:Schema.Types.ObjectId,
        ref: 'Product',
    },
    variant:{
       type:{
           type:String,
           enum:[ "SQUARE" , "WIDE" ,"PORTRAIT"],
           required:true,
       },
        price:{
           type:Number,
            required:true,
        },
        license:{
           type:String,
            required:true,
            enum:["personal","commercial"],
        }
    },
    razorpayOrderId:{
       type:String,
        required:true,
    },
    razorpayPaymentId:{
       type:String,
        required:true,
    },
    amount:{
       type:Number,
        required:true,
    },
    status:{
       type:String,
        enum:[ "pending" , "completed" ,"failed" ],
        required:true,
        default:"pending"
    },
    downloadUrl:{
       type:String,
    },
    previewUrl:{
       type:String,
    }


},{timestamps:true});

const Order = models?.Order || model<IOrder>('Order',orderSchema);
export default Order;