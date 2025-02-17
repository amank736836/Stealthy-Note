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
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

function ForgotPassword() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session && session.user) {
      router.push("/dashboard");
      return;
    }
  }, [session, router]);

  const param = useParams<{ identifier: string; verifyCode: string }>();

  const form = useForm<z.infer<typeof verifyForgotPasswordSchema>>({
    resolver: zodResolver(verifyForgotPasswordSchema),
  });

  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = async (data: z.infer<typeof verifyForgotPasswordSchema>) => {
    try {
      setLoading(true);
      const response = await axios.post("/api/verify-forgot-password", {
        identifier: param.identifier,
        code: param.verifyCode || data.verifyCode,
      });

      toast({
        title: "Success",
        description: response.data.message || "Password reset successfully",
      });

      router.replace("../sign-in");
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

      if (errorMessage === "No user found with this username or email") {
        router.replace("../sign-up");
      }
    } finally {
      setLoading(false);
      form.reset();
    }
  };

  useEffect(() => {
    if (param.verifyCode) {
      form.setValue("verifyCode", param.verifyCode);
    }
  }, [form, param.verifyCode]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6 text-gray-900 dark:text-white">
            Forgot Your Password
          </h1>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            Enter your email to receive a verification code and reset your
            password
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
            <Button
              type="submit"
              className="w-full bg-blue-600 dark:bg-blue-500 dark:hover:bg-blue-600 text-white"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default ForgotPassword;
