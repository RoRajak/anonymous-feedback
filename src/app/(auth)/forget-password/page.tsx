"use client"
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { forgetPasswordSchema } from '@/Schemas/forgetPasswordSchema';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { Loader2 } from 'lucide-react';

import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import * as z from "zod";
const Page = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();
    const form =useForm<z.infer<typeof forgetPasswordSchema>>({
        resolver:zodResolver(forgetPasswordSchema)
    })

    const onSubmit = async (data: z.infer<typeof forgetPasswordSchema>) => {
        setIsSubmitting(true);
        try {
          const response = await axios.post<ApiResponse>("/api/forget-password", data);
          toast({
            title: "Success",
            description: response.data.message,
          });

        } catch (error) {
          console.log("Error in sending forget email", error);
          const axiosError = error as AxiosError<ApiResponse>;
          let errorMessages = axiosError.response?.data.message;
          toast({
            title: "Reset email failed",
            description: errorMessages,
            variant: "destructive",
          });
        } finally {
          setIsSubmitting(false);
        }
      };
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-8 shadow-md rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Forgot Password</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="email" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" disabled={isSubmitting}>
              {
                isSubmitting?(
                <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin"/> Sending...
                </>
                ):('Sent reset link')
              }
            </Button>
          </form>
        </Form>

        
      </div>
    </div>
  )
}

export default Page