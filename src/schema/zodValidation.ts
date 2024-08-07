import { z } from "zod";

// signup schema

export const signUpSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long" })
    .regex(/^[a-zA-Z0-9_-]*$/, {
      message: "Username can only contain letters, numbers, _ or -",
    }),
  email: z.string().trim().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});

export type signUpSchemaType = z.infer<typeof signUpSchema>;

// signin schema

export const signInSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});

export type signInSchemaType = z.infer<typeof signInSchema>;
