import dbConnect from "@/backend/lib/dbConnect";
import UserModel from "@/backend/model/User";
import bcrypt from "bcryptjs";
import NextAuth, { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

const authOptions: NextAuthConfig = {
  providers: [
    Credentials({
      id: "credentials",
      name: "Credentials",
      credentials: {
        identifier: {
          label: "Username or Email",
          type: "text",
          placeholder: "Username or Email",
        },
        password: {
          label: "Password",
          type: "text",
          placeholder: "Password",
        },
      },
      async authorize(credentials): Promise<any> {
        await dbConnect();
        try {
          console.log(credentials);

          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          });

          if (!user) {
            throw new Error("No user found with this username or email");
          }

          if (!user.isVerified) {
            if (user.verifyCodeExpiry < new Date()) {
              throw new Error(
                "Verification code expired. Please request a new one"
              );
            } else {
              throw new Error("Please verify your account before logging in");
            }
          }

          const isValid = await bcrypt.compare(
            credentials.password as string,
            user.password
          );

          if (!isValid) {
            throw new Error("Invalid password");
          }

          return user;
        } catch (error) {
          throw new Error(`Error in authorize: ${error}`);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id.toString();
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages;
        token.username = user.username;
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id as string;
        session.user.isVerified = token.isVerified as boolean;
        session.user.isAcceptingMessages = token.isAcceptingMessages as boolean;
        session.user.username = token.username as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
};

export const { handlers, signIn, signOut, auth } = NextAuth(authOptions);
