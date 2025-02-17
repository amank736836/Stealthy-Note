import { sendVerificationEmail } from "@/backend/helpers/sendVerificationEmail";
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
        baseUrl: {
          label: "Base URL",
          type: "text",
          placeholder: "Base URL",
        },
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
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          });

          const baseUrl = credentials.baseUrl as string;

          if (!user) {
            throw new Error("No user found with this username or email");
          }

          if (!user.isVerified) {
            if (user.verifyCodeExpiry < new Date()) {
              const verifyCode = Math.floor(
                100000 + Math.random() * 900000
              ).toString();

              const verifyCodeExpiry = new Date();
              verifyCodeExpiry.setHours(verifyCodeExpiry.getHours() + 1);

              user.verifyCode = verifyCode;
              user.verifyCodeExpiry = verifyCodeExpiry;

              await user.save();

              const emailResponse = await sendVerificationEmail({
                baseUrl,
                email: user.email,
                username: user.username,
                verifyCode,
              });

              if (!emailResponse.success) {
                return Response.json(
                  {
                    success: false,
                    message: `Failed to send verification email: ${emailResponse.message}`,
                  },
                  {
                    status: 500,
                  }
                );
              }

              throw new Error(
                "User is not verified and Verification code expired. New verification code sent to your email"
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
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.AUTH_SECRET,
};

export const { handlers, signIn, signOut, auth } = NextAuth(authOptions);
