"use server";

import prisma from "@/lib/prisma";
import { signInSchema, signInSchemaType } from "@/schema/zodValidation";
import { isRedirectError } from "next/dist/client/components/redirect";
import { redirect } from "next/navigation";
import { verify } from "@node-rs/argon2";
import { cookies } from "next/headers";
import { lucia } from "@/auth";

export async function login(
  credientials: signInSchemaType,
): Promise<{ error: String }> {
  try {
    const validateCredientials = signInSchema.safeParse(credientials);

    if (!validateCredientials.success) {
      return {
        error:
          validateCredientials.error.format()._errors[0] ||
          "Invalid credientials",
      };
    }

    const { username, password } = validateCredientials.data;

    const user = await prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: "insensitive",
        },
      },
    });

    if (!user || !user.hashPassword) {
      return {
        error: "Incorrect username or password",
      };
    }

    const validPassword = await verify(user?.hashPassword!, password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    if (!validPassword) {
      return {
        error: "Incorrect username or password",
      };
    }

    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );

    return redirect("/");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return { error: "Semething went wrong!" };
  }
}
