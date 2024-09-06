import z from 'zod';

export const messageSchema=z.object({
    content:z
            .string()
            .min(10,{message:'Content must be at lest of 10 characters'})
            .max(300,{message:'content must not be exceed more than 300 characters'}),
   
})