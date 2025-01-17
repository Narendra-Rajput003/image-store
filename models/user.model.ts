import mongoose, {Schema,models,model,ObjectId} from 'mongoose';
import bcrypt from 'bcryptjs';


type Role = 'user' | 'admin';
export interface IUser  {
    email: string;
    password: string;
    role: Role;
    _id?:ObjectId;
    createdAt: Date;
    updatedAt: Date;
}


const userSchema = new Schema<IUser>({
    email:{
        type: String,
        unique: true,
        trim: true,
        required:true,
        validate:{
            validator: (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
            message: 'Invalid email format',
        }
    },
    password: {
        type: String,
        required: true,
        minlength:[8,'Password must be at least 8 characters long'],

    },
    role:{
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    }
},{timestamps: true});






userSchema.pre('save',async function (next){
    if(!this.isModified('password')){
        next()
    }
     try{
        const salt= await  bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
     }catch(err:any){
        next(err);
     }
})


// add index to email field

userSchema.index({email:1},{unique:true});


const User = models?.User || model<IUser>('User',userSchema);
export default User;
