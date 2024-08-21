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

// post schema

export const submitPostSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, { message: "Post content cannot be empty" }),
});

export type submitPostSchemaType = z.infer<typeof submitPostSchema>;

// user profile schema

export const updateUserProfileSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(3, { message: "Display name must be at least 3 characters long" })
    .max(30, { message: "Display name must be at most 30 characters long" }),
  bio: z
    .string()
    .trim()
    .max(160, { message: "Bio must be at most 160 characters long" }),
});

export type updateUserProfileSchemaType = z.infer<
  typeof updateUserProfileSchema
>;
