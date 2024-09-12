"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";

import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { signInSchema } from "@/Schemas/signInSchema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signIn } from 'next-auth/react'
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";


function SignIN() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router=useRouter()
  const form =useForm<z.infer<typeof signInSchema>>({
    resolver:zodResolver(signInSchema),
    defaultValues:{
      identifier:"",
      password:""
    }
   
  })

  const onSubmit=async(data:z.infer<typeof signInSchema>)=>{
    setIsSubmitting(true)
    const response=await signIn("credentials", {
      redirect:false,
      identifier:data.identifier,
      password:data.password
    })
    if (response?.error) {
      if (response.error==="CredentialsSignin") {
        toast({
          title:"Login failed",
          description:"incorrect username or password",
          variant:'destructive'
        })
      }else{
        toast({
          title:"Login Error",
          description:response.error,
          variant:'destructive'
        })
      }
    }
    

    if (response?.url) {
      router.replace('/dashboard')
    }
    setIsSubmitting(false)
  }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
    <div className=" w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">Join Mystery Messages</h1>
        <p className="mb-4">Sign in to start your anonymous adventure</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="identifier"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email/Username</FormLabel>
                <FormControl>
                  <Input  placeholder="email/password" {...field} />
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
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="password" {...field} />
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
              ):('Signin')
            }
          </Button>
        </form>
      </Form>
      <div>
        <p>Don&apos;have an account?{' '}
          <Link href={"/signup"} className="text-blue-600 hover:text-blue-800">
          Sign up
          </Link>
        </p>
      </div>
    </div>
  </div>
  )
}

export default SignIN