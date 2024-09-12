"use client";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { messageSchema } from "@/Schemas/messageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useCompletion } from "ai/react";
import { error } from "console";
import { Separator } from "@/components/ui/separator";

const specialChar = "||";

const initialMessageString =
  "What's your favorite movie?||Do you have any pets?||What's your dream job?";

const parseStringMessages = (messageString: string): string[] => {
  return messageString.split(specialChar);
};

const Page = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedMessages, setSuggestedMessages] = useState<string[]>(parseStringMessages(initialMessageString));
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const params = useParams<{ username: string }>();
  const username = params.username;

  const router=useRouter()



  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const messageContent=form.watch('content');
  const handleMessageCLick=(message:string)=>{
    form.setValue('content',message)
  }

  const { toast } = useToast();

  const fetchSuggestedMessages = async () => {
    setIsSuggesting(true);
    setError(null);
    try {
      const response = await axios.post("/api/suggest-messages");
      if (response.data && response.data.questions) {
        setSuggestedMessages(parseStringMessages(response.data.questions));
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Error while fetching from Gemini:", error);
      setError("Failed to fetch suggested messages. Please try again.");
    } finally {
      setIsSuggesting(false);
    }
  };


  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>("/api/send-messages", {
        ...data,
        username,
      });
      toast({
        description: response.data.message,
      });
      form.reset({...form,content:""})

    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Failed to send messages",
        description: axiosError.response?.data.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="container mx-auto p-6 my-8 max-w-4xl">
      <h1 className="text-4xl font-bold text-center mb-6">
        Public Profile Link
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Send Anonymous Message to @{username}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your anonymous message here."
                    {...field}
                    className="resize-none"
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center">
            {isLoading ? (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button type="submit" disabled={isLoading || !messageContent}>
                Send It
              </Button>
            )}
          </div>
        </form>
      </Form>
      <div className="my-8 space-y-4">
        <div className="space-y-2">
          <Button className=" my-4 " disabled={isSuggesting}
          onClick={fetchSuggestedMessages}>
            Suggest Message
          </Button>
          <p>Click on any message below to select it.</p>
        </div>

        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold">Messages</h3>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4">
          {error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              suggestedMessages.map((message, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="mb-2"
                  onClick={() => handleMessageCLick(message)}
                >
                  {message}
                </Button>
              ))
            )}
          </CardContent>
        </Card>
        <Separator className="mt-10"/>
        <div className="flex flex-col items-center justify-center">
          <p className="mt-4">Get Your Message Board</p>
          <Button onClick={()=>router.push("/signup")} className="p-2 mt-4 bg-black">Create your acount</Button>
        </div>
      </div>
    </div>
  );
};

export default Page;
