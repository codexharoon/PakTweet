"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getPostDataInclude } from "@/lib/types";
import { submitPostSchema } from "@/schema/zodValidation";

export async function submitPost(values: {
  content: string;
  mediaIds: string[];
}) {
  const { user } = await validateRequest();

  if (!user) throw new Error("Unauthorized");

  const validateContent = submitPostSchema.safeParse(values);

  if (!validateContent.success)
    throw new Error(validateContent.error.errors[0].message);

  const { content, mediaIds } = validateContent.data;

  const newPost = await prisma.post.create({
    data: {
      content,
      userId: user.id,
      attachments: {
        connect: mediaIds.map((id) => ({ id })),
      },
    },
    include: getPostDataInclude(user.id),
  });

  return newPost;

  // can't use revalidatePath here bcz our input fields are client side and we refresh the feed with react query
}
