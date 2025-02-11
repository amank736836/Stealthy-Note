"use client";

import { verifySchema } from "@/backend/schemas/verifySchema";
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
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

function VerifyAccount() {
  const router = useRouter();

  const param = useParams<{ username: string; verifyCode: string }>();

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });

  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      setLoading(true);
      const response = await axios.post("/api/verifyCode", {
        username: param.username,
        code: param.verifyCode || data.verifyCode,
      });

      toast({
        title: "Success",
        description: response.data.message,
      });

      router.replace("../../sign-in");
    } catch (error) {
      console.error("Error in verifying user", error);

      const axiosError = error as AxiosError<ApiResponse>;

      let errorMessage =
        axiosError.response?.data.message || "Error verifying user";

      if (
        errorMessage ===
        "Verification Code has expired, please signup again to get a new code"
      ) {
        router.replace("../../sign-up");
      } else if (errorMessage === "User is already verified") {
        router.replace("../../sign-in");
      } else {
        router.replace("../../sign-up");
      }

      console.log("working");

      toast({
        title: "Sign Up Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      form.reset();
      setLoading(false);
    }
  };

  useEffect(() => {
    if (param.verifyCode) {
      form.setValue("verifyCode", param.verifyCode);
    }
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Verify Your Account
          </h1>
          <p className="mb-4">Enter the verification code sent to your email</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="verifyCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Verification Code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default VerifyAccount;
