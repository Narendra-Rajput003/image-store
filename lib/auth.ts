import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectToDB } from "@/lib/db";
import User from "@/models/user.model";
import { z } from "zod";

// Define the shape of your credentials
const credentialsSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                try {
                    const validatedCredentials = credentialsSchema.safeParse(credentials);

                    if (!validatedCredentials.success) {
                        throw new Error("Invalid email or password format");
                    }

                    const { email, password } = validatedCredentials.data;

                    await connectToDB();
                    const user = await User.findOne({ email });

                    if (!user) {
                        throw new Error("No user found with this email");
                    }

                    const isValid = await bcrypt.compare(password, user.password);

                    if (!isValid) {
                        throw new Error("Invalid password");
                    }

                    return {
                        id: user._id.toString(),
                        email: user.email,
                        role: user.role,
                    };
                } catch (error) {
                    console.error("Auth error:", error);
                    throw new Error(error instanceof Error ? error.message : "Authentication failed");
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role;
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.role = token.role as string;
                session.user.id = token.id as string;
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
        error: "/login",
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    secret: process.env.NEXTAUTH_SECRET,
};