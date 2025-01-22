import ImageKit from "imagekit";
import {NextResponse} from "next/server";


const imagekit = new ImageKit({
    publicKey:process.env.NEXT_PUBLICNEXT_PUBLIC_PUBLIC_KEY as string,
    privateKey:process.env.NEXTIMAGEKIT_PRIVATE_KEY as string,
    urlEndpoint:process.env.NEXT_PUBLIC_URL_ENDPOINT as string,
})


export async function GET(){
    try{
        const authenticationParameters=imagekit.getAuthenticationParameters();
        return NextResponse.json(authenticationParameters);
    }catch(error){
        console.error("Imagekit server error:", error);
        
        return NextResponse.json(
            {error: "Imagekit server error:",},
            {
                status:500,
            }
        )
    }
}