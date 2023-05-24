import { z } from "zod";

const schema = z.object({
    URL: z.string().min(1),
    SESSION_SECRET: z.string().min(1),
    NODE_ENV: z.enum(['production', 'development', 'test']).default('production'),
});

type ENV = z.infer<typeof schema>;

declare global {
    var ENV: ENV
};

export function getEnv() {
    return schema.parse(process.env);
}