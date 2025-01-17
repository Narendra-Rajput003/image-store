import * as mongoose from "mongoose";


const MONGODB_URI = process.env.MONGODB_URI as string;
if (!MONGODB_URI) {
    console.error("MongoDB URI doesn't exist");
}

let cached =global.mongoose;


if(!cached){
    cached=global.mongoose={conn:null,promise:null};
}


export async function connectToDB() {
    if(cached.conn){
        return cached.conn;
    }
    if(!cached.promise){
        const options={
            bufferCommands:true,
            maxPoolSize:5
        };

        cached.promise = mongoose.connect(MONGODB_URI, options).then(()=>mongoose.connection)
    }
    try{
       cached.conn = await cached.promise;
    }catch(e){
        console.error(e);
        cached.promise = null;
    }

    return cached.conn;
}



