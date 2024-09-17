"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { useParams, useRouter,useSearchParams } from "next/navigation";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { useForm } from "react-hook-form";
import { resetPasswordSchema } from "@/Schemas/resetPasswordSchema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

function ResetPassword() {
  const [isSubmitting,setIsSubmitting]=useState(false)
  const [token, setToken] = useState<string>("");
  const { toast } = useToast();
  const router = useRouter();
  const params=useParams<{username:string}>();
  const searchParams=useSearchParams();
  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
  });

  useEffect(() => {
    const urlToken = searchParams ? searchParams.get('token') : null;
    setToken(urlToken || "");
    
}, [searchParams]);
  const onSubmit = async (data: z.infer<typeof resetPasswordSchema>) => {
    try {
      setIsSubmitting(true)
      const response = await axios.post(`/api/verify-token`, {
        username:params?.username,
        password:data.password,
        token:token
      });
      toast({
        title: "success",
        description: response.data.message,
      });
      router.push("/signin")
    } catch (error) {
      console.log("Error in resetting passowrd", error);
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessages = axiosError.response?.data.message;
      toast({
        title: "token Verfication failed",
        description: errorMessages,
        variant: "destructive",
      });
    }
    finally{
      setIsSubmitting(false)
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className=" w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
          {params?.username ? `${params.username} Greetings!!` : "Greetings!!"}
          </h1>
          <p className="mb-4">
            please reset your password below
          </p>
        </div>
      
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reset Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="reset password" {...field} />
                    </FormControl>
                   
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isSubmitting}>
            {
              isSubmitting?(
              <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin"/> please wait
              </>
              ):('Submit')
            }
          </Button>
            </form>
          </Form>
      
      </div>
    </div>
  );
}

export default ResetPassword;
