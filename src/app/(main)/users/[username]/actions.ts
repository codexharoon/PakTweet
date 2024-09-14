"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import streamServerClient from "@/lib/stream";
import { getUserSelectData } from "@/lib/types";
import {
  updateUserProfileSchema,
  updateUserProfileSchemaType,
} from "@/schema/zodValidation";

export async function updateUserProfile(values: updateUserProfileSchemaType) {
  const validateValues = updateUserProfileSchema.safeParse(values);

  if (!validateValues.success) {
    throw new Error(
      validateValues.error.format()._errors[0] || "Invalid values",
    );
  }

  const { user } = await validateRequest();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { displayName, bio, username } = validateValues.data;

  const updatedUser = await prisma.$transaction(async (tx) => {
    const updatedUser = await tx.user.update({
      where: { id: user.id },
      data: {
        username,
        displayName,
        bio,
      },
      select: getUserSelectData(user.id),
    });

    await streamServerClient.partialUpdateUser({
      id: user.id,
      set: {
        username,
        name: displayName,
      },
    });

    return updatedUser;
  });

  return updatedUser;
}
