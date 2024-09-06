import NextAuth from 'next-auth';
import CredentialsProvider from "next-auth/providers/credentials";

const nextauthoptions = {
    session: {
        strategy: 'jwt',
        maxAge: 24 * 60 * 60,
    },
    providers: [
        CredentialsProvider({
            type: 'credentials',
            credentials: {
                email: { label: "Email", type: "email", placeholder: "admin@gmail.com" },
                password: { label: "Password", type: "password" }
            },
            authorize: async (credentials) => {
                const { email, password } = credentials;
                if (email === 'admin@gmail.com' && password === 'admin') {
                    console.log("first-auth");
                    return { email: email };
                } else {
                    throw new Error('Credentials Invalid');
                }
            }
        })
    ],
    pages: {} // Define pages if you have custom sign-in, error, or other authentication pages
};

const handler = NextAuth(nextauthoptions);
export { handler as GET, handler as POST };
