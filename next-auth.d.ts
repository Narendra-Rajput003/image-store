import {DefaultSession} from "next-auth";


declare  module "next/auth" {
    interface Session {
        user:{
            id: string;
            role: string;
        } & DefaultSession["user"];
    }


    //Why Not Just Use the Session Interface?
    // If you only defined the Session interface, TypeScript would not know about the role field in the User object. This could lead to type errors in the next-auth callbacks or when working with the raw user object.
    //important
    interface User{
        role: string;
    }
}