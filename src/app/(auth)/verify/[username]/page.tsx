"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { useParams, useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { useForm } from "react-hook-form";
import { verifySchema } from "@/Schemas/verifySchema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function VerifyCode() {
  const { toast } = useToast();
  const router = useRouter();
  const params=useParams<{username:string}>();
  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });
  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      const response = await axios.post(`/api/verify-code`, {
        username:params.username,
        code:data.code
      });
      toast({
        title: "success",
        description: response.data.message,
      });
    } catch (error) {
      console.log("Error in SigninUP", error);
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessages = axiosError.response?.data.message;
      toast({
        title: "Verfication failed",
        description: errorMessages,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className=" w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Verify your email
          </h1>
          <p className="mb-4">
            Enter the Verfication code that sent to your email
          </p>
        </div>
      
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Verification code</FormLabel>
                    <FormControl>
                      <Input placeholder="verify code" {...field} />
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

export default VerifyCode;
