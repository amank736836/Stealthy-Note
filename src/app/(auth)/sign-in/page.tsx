"use client";

import { signInSchema } from "@/backend/schemas/signInSchema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

function SignIn() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session && session.user) {
      router.push("/dashboard");
      return;
    }
  }, [session, router]);

  const searchParams = useSearchParams();
  const identifier = searchParams.get("identifier");

  useEffect(() => {
    if (identifier) {
      form.setValue("identifier", identifier);
    }
  }, [identifier]);

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);
    const result = await signIn("credentials", {
      redirect: false,
      baseUrl: window.location.origin,
      identifier: data.identifier.toLowerCase(),
      password: data.password,
    });

    if (result?.error) {
      toast({
        title: "Login failed",
        description:
          result.error === "CredentialsSignin"
            ? "Invalid username or password"
            : "Check Verify or Credentials",
        variant: "destructive",
      });
    } else if (result?.url) {
      router.replace("/dashboard");
    }

    setIsSubmitting(false);
  };

  return (
    <div className="flex justify-center items-center h-[calc(100vh-92px)] bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6 text-gray-900 dark:text-white">
            Join Stealthy Note 🥷📝
          </h1>
          <p className="mb-6 text-gray-700 dark:text-gray-300">
            Sign In to start stealing notes from your friends
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-900 dark:text-gray-300 mt-8">
                    Username or Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Username or Email"
                      {...field}
                      type="text"
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-900 dark:text-gray-300 mt-8">
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Password"
                      type="password"
                      {...field}
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-center w-full">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="dark:bg-gray-700 dark:text-white mt-8"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please
                    wait
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </div>
          </form>
        </Form>

        <div className="text-center mt-6">
          <p className="text-gray-700 dark:text-gray-300 mt-8">
            Forgot your password?{" "}
            <Link
              href={{
                pathname: "/forgot-password",
                query: { identifier: form.getValues("identifier") },
              }}
              className="text-blue-500 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              Forgot Password
            </Link>
          </p>
        </div>

        <div className="text-center mt-6">
          <p className="text-gray-700 dark:text-gray-300 mt-8">
            Don&apos;t have an account?{" "}
            <Link
              href={{
                pathname: "/sign-up",
                query: {
                  identifier: form.getValues("identifier")
                    ? form.getValues("identifier")
                    : identifier,
                },
              }}
              className="text-blue-500 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
