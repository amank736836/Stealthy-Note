"use client";

import { userVerifySchema } from "@/backend/schemas/userVerifySchema";
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
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

function VerifyAccount({
  searchParams,
}: {
  searchParams: Promise<{
    identifier: string;
    verifyCode: number;
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

  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof userVerifySchema>>({
    resolver: zodResolver(userVerifySchema),
  });

  const watchFields = form.watch(["identifier", "verifyCode"]);
  const isButtonDisabled = watchFields.some((field) => !field) || loading;

  const { identifier, verifyCode } = use(searchParams);

  useEffect(() => {
    if (identifier) {
      form.setValue("identifier", identifier);
    }

    if (verifyCode) {
      form.setValue("verifyCode", Number(verifyCode));
    }
  }, [identifier, verifyCode]);

  const onSubmit = async (data: z.infer<typeof userVerifySchema>) => {
    try {
      setLoading(true);
      const response = await axios.post("/api/verifyCode", {
        identifier: data.identifier,
        verifyCode: data.verifyCode,
      });

      toast({
        title: "Success",
        description: response.data.message || "User verified successfully",
      });

      router.replace(`/sign-in?identifier=${data.identifier}`);
    } catch (error) {
      console.error("Error in verifying user", error);

      const axiosError = error as AxiosError<ApiResponse>;

      const errorMessage =
        axiosError.response?.data.message ||
        "Some error occurred. Please try again later";

      toast({
        title: "Verification Failed",
        description: errorMessage,
        variant: "destructive",
      });

      if (errorMessage === "User is already verified") {
        router.replace(`/sign-in?identifier=${data.identifier}`);
      }
    } finally {
      form.reset();
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-[calc(100vh-125px)] bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6 text-gray-900 dark:text-white">
            Verify Your Account
          </h1>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            Enter the verification code sent to your email
          </p>
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
                      placeholder="Enter your username or email"
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
                      placeholder="Verification Code"
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
              disabled={isButtonDisabled || loading}
            >
              {loading ? "Verifying..." : "Submit"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default VerifyAccount;
