"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { postDataInclude } from "@/lib/types";
import { submitPostSchema } from "@/schema/zodValidation";

export async function submitPost(content: string) {
  const { user } = await validateRequest();

  if (!user) throw new Error("Unauthorized");

  const validateContent = submitPostSchema.safeParse({ content });

  if (!validateContent.success)
    throw new Error(validateContent.error.errors[0].message);

  const newPost = await prisma.post.create({
    data: {
      content,
      userId: user.id,
    },
    include: postDataInclude,
  });

  return newPost;

  // can't use revalidatePath here bcz our input fields are client side and we refresh the feed with react query
}
