

import {withAuth} from "next-auth/middleware";
import { NextResponse } from "next/server";


export default withAuth(

    function middleware(){
         return NextResponse.next()
    },
    {
        callbacks:{
            authorized:({token,req})=>{
                const {pathname} = req.nextUrl;

                if(pathname.startsWith("/api/webhook")){
                    return true;
                }

                if(pathname.startsWith("/api/auth") ||
                pathname==="/login"||
                pathname==="/register"){
                    return true;
                }

                // public routes 
                if(
                    pathname==="/" ||
                    pathname.startsWith("/api/products")||
                    pathname.startsWith("/products")
                ){
                    return true
                }

                //Admin route require admin role

                if(pathname.startsWith("/admin")){
                    return token?.role ==="admin"
                }

                //All other routes require authentication

                return !!token;
            },
        }
    }
);

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api/auth (authentication routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
    ]
}