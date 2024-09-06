"use client"
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { messageSchema } from "@/Schemas/messageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const Page = () => {
  const[isLoading,setIsLoading]=useState(false)
  const params=useParams<{username:string}>()
  const username=params.username
  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });
  const { toast } = useToast();

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true)
    try {
      const response = await axios.post<ApiResponse>(
        "/api/send-messages",
        {...data,username}
      );
      toast({
        description: response.data.message,
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Failed to send messages",
        description: axiosError.response?.data.message,
        variant:"destructive"
      });
    }finally{
      setIsLoading(false)
    }
  };

  
  return (
    <div className="container mx-auto p-6 my-8 max-w-4xl">
      <h1 className="text-4xl font-bold text-center mb-6">Public Profile Link</h1>
      <Form {...form}>
        <form
         
        onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ">
          <FormField
          
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel >Send Anonymous Message to @{username}</FormLabel>
                <FormControl>
                  <Textarea placeholder="Write your anonymous message here." {...field} className="resize-none" />
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
              <Button type="submit" disabled={isLoading}>
                Send It
              </Button>
            )}
          </div>
          </form>
      </Form>
    </div>
  );
};

export default Page;
