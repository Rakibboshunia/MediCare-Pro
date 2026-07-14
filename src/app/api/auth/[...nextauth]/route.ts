import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        // Basic dummy authentication for testing
        if (credentials?.email && credentials?.password) {
          // Allow any login for now or specifically admin
          return { 
            id: "1", 
            name: "Dr. Admin", 
            email: credentials.email,
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"
          };
        }
        return null;
      }
    })
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "development_secret_key_12345",
});

export { handler as GET, handler as POST };
