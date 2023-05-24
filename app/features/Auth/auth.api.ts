import { z } from "zod";



export const LoginInputSchema = z.object({
    email: z.string().email().trim(),
    password: z.string().min(1)
})

export type LoginInput = z.infer<typeof LoginInputSchema>;

export async function login(values: LoginInput) {

}