"use client";

import { verifyForgotPasswordSchema } from "@/backend/schemas/verifyForgotPasswordSchema";
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
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { use, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

function VerifyForgotPassword({
  searchParams,
}: {
  searchParams: Promise<{
    identifier: string;
    verifyCode: string;
  }>;
}) {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session && session.user) {
      router.push("/dashboard");
      return;
    }
  }, [session, router]);

  const form = useForm<z.infer<typeof verifyForgotPasswordSchema>>({
    resolver: zodResolver(verifyForgotPasswordSchema),
  });

  const { identifier, verifyCode } = use(searchParams);

  useEffect(() => {
    if (identifier) {
      form.setValue("identifier", identifier);
    }

    if (verifyCode) {
      form.setValue("verifyCode", verifyCode);
    }
  }, [identifier, verifyCode]);

  const [loading, setLoading] = useState<boolean>(false);

  const watchFields = form.watch([
    "password",
    "confirmPassword",
    "verifyCode",
    "identifier",
  ]);
  const isButtonDisabled =
    watchFields.some((field) => !field) || watchFields[0] !== watchFields[1];

  const onSubmit = async (data: z.infer<typeof verifyForgotPasswordSchema>) => {
    setLoading(true);

    try {
      const response = await axios.post("/api/verify-forgot-password", {
        verifyCode: data.verifyCode,
        identifier: data.identifier,
        password: data.password,
      });

      toast({
        title: "Success",
        description: response.data.message || "Password reset successfully",
      });

      router.replace(`/sign-in?identifier=${data.identifier}`);
    } catch (error) {
      console.error("Error in resetting password", error);

      const axiosError = error as AxiosError<ApiResponse>;

      const errorMessage =
        axiosError.response?.data.message ||
        "Some error occurred. Please try again later";

      toast({
        title: "Password Reset Failed",
        description: errorMessage,
        variant: "destructive",
      });

      if (
        errorMessage === "No user found with this username or email" ||
        errorMessage === "New password cannot be the same as the old password"
      ) {
        router.replace(`/sign-up?identifier=${data.identifier}`);
      }
    } finally {
      setLoading(false);
      form.reset();
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6 text-gray-900 dark:text-white">
            Forgot Your Password
          </h1>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-900 dark:text-gray-300">
                    Username or Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter the username or email"
                      {...field}
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="verifyCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-900 dark:text-gray-300">
                    Verification Code
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter the code sent to your email"
                      {...field}
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
                  <FormLabel className="text-gray-900 dark:text-gray-300">
                    New Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your new password"
                      {...field}
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-900 dark:text-gray-300">
                    Confirm Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your Confirm password"
                      {...field}
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-blue-600 dark:bg-blue-500 dark:hover:bg-blue-600 text-white"
              disabled={isButtonDisabled}
            >
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default VerifyForgotPassword;
