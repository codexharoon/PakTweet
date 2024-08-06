"use server";

import prisma from "@/lib/prisma";
import { signUpSchema, signUpSchemaType } from "@/schema/zodValidation";
import { isRedirectError } from "next/dist/client/components/redirect";
import { redirect } from "next/navigation";
import { hash } from "@node-rs/argon2";
import { generateIdFromEntropySize } from "lucia";
import { cookies } from "next/headers";
import { lucia } from "@/auth";

export async function signup(
  credientials: signUpSchemaType,
): Promise<{ error: String }> {
  try {
    const validateCredientials = signUpSchema.safeParse(credientials);

    if (!validateCredientials.success) {
      return {
        error:
          validateCredientials.error.format()._errors[0] ||
          "Invalid credientials",
      };
    }

    const { username, email, password } = validateCredientials.data;

    const existingUsername = await prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: "insensitive",
        },
      },
    });

    if (existingUsername) {
      return {
        error: "Username already exists",
      };
    }

    const existingEmail = await prisma.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: "insensitive",
        },
      },
    });

    if (existingEmail) {
      return {
        error: "Email already exists",
      };
    }

    const passwordHash = await hash(password, {
      // recommended minimum parameters
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    const userId = generateIdFromEntropySize(10); // 16 characters long

    await prisma.user.create({
      data: {
        id: userId,
        username,
        email,
        hashPassword: passwordHash,
        displayName: username,
      },
    });

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );

    return redirect("/");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.log(error);
    return { error: "Something went wrong!" };
  }
}
