"use client";

import { signUpSchema } from "@/backend/schemas/signUpSchema";
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
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDebounceCallback } from "usehooks-ts";
import * as z from "zod";

function SignUp({
  searchParams,
}: {
  searchParams: Promise<{
    identifier: string;
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

  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const setDebouncedUsername = useDebounceCallback(setUsername, 500);
  const [error, setError] = useState<string>("");

  const { identifier } = use(searchParams);

  useEffect(() => {
    if (identifier?.includes("@")) {
      form.setValue("email", identifier);
    } else {
      form.setValue("username", identifier || "");
    }
  }, [identifier]);

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: identifier?.includes("@") ? identifier : "",
      username: identifier || "",
    },
  });

  const watchFields = form.watch([
    "password",
    "confirmPassword",
    "username",
    "email",
  ]);
  const isButtonDisabled =
    watchFields.some((field) => !field) || watchFields[0] !== watchFields[1];

  useEffect(() => {
    if (watchFields.some((field) => !field)) {
      setError("Please fill all the fields");
    } else if (watchFields[0] !== watchFields[1]) {
      setError("Passwords do not match");
    } else {
      setError("");
    }
  }, [watchFields]);

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (!username || username.length < 2) return;
      setIsCheckingUsername(true);
      setUsernameMessage("");
      try {
        const response = await axios.get(
          `/api/check-username-unique?username=${username}`
        );
        setUsernameMessage(response.data.message);
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        setUsernameMessage(
          axiosError.response?.data.message || "Error checking username"
        );
      } finally {
        setIsCheckingUsername(false);
      }
    };

    checkUsernameUnique();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>("/api/sign-up", data);

      if (response.data.success) {
        toast({
          title: "Success",
          description: response.data.message,
        });
      }

      router.replace(`/verify?identifier=${data.username}`);
    } catch (error) {
      console.error("Error in signup of user ", error);

      const axiosError = error as AxiosError<ApiResponse>;

      const errorMessage =
        axiosError.response?.data.message ||
        "Some error occurred. Please try again later";

      toast({
        title: "Sign Up Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center  h-[calc(100vh-125px)]  bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6 text-gray-900 dark:text-white">
            Join Stealthy Note 🥷📝
          </h1>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            Sign up to start stealing notes from your friends
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-900 dark:text-gray-300">
                    Username
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Username"
                      {...field}
                      type="text"
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      onChange={(e) => {
                        field.onChange(e);
                        setDebouncedUsername(e.target.value);
                      }}
                    />
                  </FormControl>
                  {isCheckingUsername && (
                    <Loader2 className="animate-spin text-gray-500 dark:text-gray-400" />
                  )}
                  <p
                    className={`text-sm flex items-center ${usernameMessage === "Username is unique" ? "text-green-500" : "text-red-500"}`}
                  >
                    {usernameMessage === "Username is unique" ? "✅" : "❌"}{" "}
                    {usernameMessage}
                  </p>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-900 dark:text-gray-300">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Email"
                      {...field}
                      type="email"
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
                      placeholder="Confirm Password"
                      type="password"
                      {...field}
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <p className="text-red-500 dark:text-red-400 flex justify-center w-full">
              {error}
            </p>

            <div className="flex justify-center w-full">
              <Button
                type="submit"
                disabled={isButtonDisabled || isSubmitting}
                className="dark:bg-gray-700 dark:text-white"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please
                    wait
                  </>
                ) : (
                  "Sign Up"
                )}
              </Button>
            </div>
          </form>
        </Form>

        <div className="text-center mt-4">
          <p className="text-gray-700 dark:text-gray-300">
            Already have an account?{" "}
            <Link
              href={{
                pathname: "/sign-in",
                query: {
                  identifier: form.getValues("email")
                    ? form.getValues("email")
                    : form.getValues("username")
                      ? form.getValues("username")
                      : identifier,
                },
              }}
              className="text-blue-500 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
