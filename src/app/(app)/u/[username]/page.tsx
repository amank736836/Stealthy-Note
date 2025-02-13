import { messageSchema } from "@/backend/schemas/messageSchema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCompletion } from "ai/react";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const specialChar = "||";

const parseStringMessages = (messageString: string): string[] => {
  return messageString.split(specialChar);
};

const initialMessageString =
  "What's your favorite movie?||Do you have any pets?||What's your dream job?";

export default function SendMessage() {
  const params = useParams<{
    username: string;
  }>();

  const username = params.username;

  const {
    completion: messageString,
    setCompletion: setMessageString,
    isLoading: isCompletionLoading,
    error: completionError,
  } = useCompletion({
    api: "/api/suggest-messages",
    initialCompletion: initialMessageString,
  });

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const messageContent = form.watch("content");

  const handleMessageClick = (message: string) => {
    form.setValue("content", message);
  };

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);

    try {
      const response = await axios.post<ApiResponse>("api/send-message", {
        ...data,
        username,
      });

      if (response.data.success) {
        form.reset({
          ...form.getValues(),
          content: "",
        });
      }

      toast({
        title: response.data.success
          ? response.data.message || "Message sent"
          : "Error sending message",
        variant: response.data.success ? "default" : "destructive",
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;

      toast({
        title: "Error sending message",
        description:
          axiosError.response?.data.message ??
          `An error occurred while sending the message, ${error}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSuggestedMessages = async () => {
    try {
      setMessageString("");
    } catch (error) {
      console.error("Failed to fetch suggested messages", error);
    }
  };

  return (
    <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Public Profile Link
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Send Anonymous Message to @{username}</FormLabel>
                <FormControl>
                  <textarea
                    {...field}
                    className="resize-none"
                    placeholder="Write your anonymous message here"
                  />
                </FormControl>
                {/* <FormMessage>
                  {form.formState.errors.content?.message}
                </FormMessage> */}
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center">
            {isLoading ? (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please Wait
              </Button>
            ) : (
              <Button type="submit" disabled={isLoading || !messageContent}>
                Send Message
              </Button>
            )}
          </div>
        </form>
      </Form>

      <div className="space-y-4 my-8">
        <div className="space-y-2">
          <Button
            onClick={fetchSuggestedMessages}
            className="my-4"
            disabled={isCompletionLoading}
          >
            {isCompletionLoading ? "Loading..." : "Suggest Messages"}
          </Button>
          {completionError && (
            <p className="text-red-500">{completionError.message}</p>
          )}

          <p>Click on the any message below to select it.</p>
        </div>

        <Card>
          <CardHeader>
            <h3 className="text-4xl font-semibold">Messages</h3>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4">
            {completionError ? (
              <p className="text-red-500">{completionError.message}</p>
            ) : messageString ? (
              parseStringMessages(messageString).map((message, index) => (
                <Button
                  key={index}
                  variant={"outline"}
                  onClick={() => handleMessageClick(message)}
                  className="mb-2"
                >
                  {message}
                </Button>
              ))
            ) : (
              <p>No messages to suggest</p>
            )}
          </CardContent>
        </Card>
      </div>
      <Separator className="my-6" />
      <div className="text-center">
        <div className="mb-4">Get Your Own Message Board</div>
        <Link href="/sign-up">
          <Button>Create Your Account</Button>
        </Link>
      </div>
    </div>
  );
}
