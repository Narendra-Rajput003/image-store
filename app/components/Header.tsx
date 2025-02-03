"use client"
import { Home } from "lucide-react";
import { useSession } from "next-auth/react";
import { useNotification } from "./Notification";
import Link from "next/link";



export default function Header(){

   const {data:session} = useSession();
   const {showNotification}  = useNotification();

    return(
       <div className="navbar bg-base-300 sticky top-0 z-40">
        <div className="container mx-auto">
            <div className="flex-1 px-2 lg:flex-none">
            <Link
                href="/"
                prefetch={true}
                className="btn btn-ghost normal-case text-xl gap-2 font-bold"
                onClick={()=>showNotification("Welcome to ImageKit Shop", "success")}
                >
                    <Home className="w-6 h-6"/>
                    ImageKit Shop
                </Link>
            </div>
        </div>
       </div>
    )
}