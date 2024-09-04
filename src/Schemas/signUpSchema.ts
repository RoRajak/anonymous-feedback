import {z} from 'zod'

export const usernameValidation=z
    .string()
    .min(2,"Username must be atleast 2 chareacters")
    .max(20,"username should not exceed more than 20 chareacters")
    .regex(/^[[a-zA-Z0-9_]+$/,"username must not contain special character")

export const signUpSchema=z.object({
    username:usernameValidation,
    email:z.string().email({message:"Invalid email address"}),
    password:z.string().min(6,{message:"pasword must be at least 6 characterss"})
})