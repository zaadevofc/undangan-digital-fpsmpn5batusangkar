import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import prisma from "./prisma";

export const NextAuthConfig: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID as string,
      clientSecret: process.env.AUTH_GOOGLE_SECRET as string,
    })
  ],
  pages: {
    signIn: "/",
    signOut: "/",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  callbacks: {
    async signIn({ user }: any) {
      const payload = {
        name: user.name,
        email: user.email,
        picture: user.image,
        username: user.email.split("@").shift(),
      }

      const upsert: any = await prisma.user.upsert({
        where: { username: payload.username, email: payload.email },
        update: { picture: user.image },
        create: payload
      })

      Object.keys(upsert).forEach(x => {
        user[x] = upsert[x]
      });

      return true;
    },
    async redirect({ baseUrl }) {
      return `${baseUrl}`;
    },
    async session({ token }: any) {
      const user = await prisma.user.findUnique({
        where: { email: token.email }
      })
      
      if (!user) return false
      return { ...token, role: user?.role };
    },
    async jwt(x) {
      let { token, user, account, trigger, session }: any = x;
      if (account) {
        token.accessToken = account.access_token;
      }
      if (trigger == "update") {
        token = { ...token, ...session };
      }
      if (user) {
        token = { ...token, ...user };
      }
      return token;
    },
  },
  useSecureCookies: process.env.NODE_ENV === "production",
  cookies: {
    sessionToken: {
      name: "fpsmpn5batusangkar-passport.session-token",
      options: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 1 * 60 * 60 * 24 * 30, // satu bulan
      },
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
