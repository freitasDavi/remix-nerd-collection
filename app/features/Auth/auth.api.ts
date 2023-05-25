import { z } from "zod";
import { db } from "~/db";
import { compare } from "bcryptjs";
import { LoginError } from "~/lib/errors/LoginError";


export const LoginInputSchema = z.object({
    email: z.string().email().trim(),
    password: z.string().min(1)
})

export type LoginInput = z.infer<typeof LoginInputSchema>;

export async function login(values: LoginInput) {
    const user = await db.user.findUnique({
        where: {
            email: values.email
        }
    });

    if (!user) {
        throw new LoginError();
    }

    const passwordIsValid = await compare(values.password, user.password);

    if (!passwordIsValid) {
        throw new Error("Erro ao realizar login");
    }

    return user;
}