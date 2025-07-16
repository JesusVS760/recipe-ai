"use server";

import bcrypt from "bcryptjs";
import { createSession } from "./auth";
import { prisma } from "./prisma";

export async function hashPassword(password: string) {
  const rounds = parseInt(process.env.BCRYPT_ROUNDS || "12");
  return bcrypt.hash(password, rounds);
}

export async function verifyPassword(password: string, hashedPassword: string) {
  return bcrypt.compare(password, hashedPassword);
}

export async function signUp(formData: FormData) {
  const firstName = formData.get("firstname") as string;
  const lastName = formData.get("lastname") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!firstName || !lastName || !email || !password) {
    return { error: "All fields are required" };
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return { error: "User already exists" };
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: { firstName, lastName, email, hashedPassword },
    });

    await createSession(user.id);
    return { success: true, firstName: user.firstName };
  } catch (error) {
    return { error: "Failed to create account. Please try again!" };
  }
}

export async function signIn(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Missing required fields." };
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return { error: "Invalid credentials ❌!" };
    }

    const isVerified = await verifyPassword(password, user.hashedPassword);

    if (!isVerified) {
      return { error: "Invalid credentials ❌!" };
    }

    await createSession(user.id);
    return { success: true, firstName: user.firstName };
  } catch (error) {
    if (error) {
      return { error: "Session already exists" };
    }
    return { error: "Failed to sign in. Please try again!" };
  }
}
