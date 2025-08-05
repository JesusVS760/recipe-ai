"use server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { createSession } from "./auth";
import { prisma } from "./prisma";
import { sendVerificationEmail } from "./resend";

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

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export async function sendVerificationCode(formData: FormData) {
  const email = formData.get("email") as string;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return { error: "User not found" };
    }

    const code = generateCode();
    const token = generateToken();
    const expires = new Date(Date.now() + 60 * 60 * 1000);

    await prisma.verificationToken.deleteMany({ where: { userId: user?.id } });

    await prisma.verificationToken.create({
      data: {
        token,
        code,
        expires,
        userId: user.id,
      },
    });

    await sendVerificationEmail(email, code); // resend

    return { success: true };
  } catch (error) {
    return { error: "Failed to send verification code" };
  }
}

export async function VerifyResetCode(formData: FormData) {
  const code = formData.get("code") as string;
  const email = formData.get("email") as string;

  if (!code || !email) {
    return { error: "Missing required fields" };
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return { error: "User not found!" };
    }
    const verify = await prisma.verificationToken.findFirst({
      where: {
        code: code.trim(),
        userId: user.id,
        type: "EMAIL_VERIFICATION",
        used: false,
        expires: {
          gt: new Date(),
        },
      },
    });

    if (!verify) {
      return { error: "Invalid or expired verification code" };
    }

    await prisma.verificationToken.update({
      where: { id: verify.id },
      data: { used: true },
    });

    // await createSession(user.id);

    return { success: true };
  } catch (error) {
    return { error: "Verifcation failed" };
  }
}

export async function changePassword(formData: FormData) {
  const oldPassword = formData.get("oldPassword") as string;
  const newPassword = formData.get("newPassword") as string;
  const email = formData.get("email") as string;

  if (!oldPassword || !newPassword || !email) {
    return { error: "Missing required fields" };
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return { error: "User not found!" };
  }

  try {
    // const result = await verifyPassword(oldPassword, user.hashedPassword);
    // if (!result) {
    //   return { error: "Current password does not match!" };
    // }

    const hashed = await hashPassword(newPassword);

    await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        hashedPassword: hashed,
      },
    });
    return { success: true };
  } catch (error) {
    return { error: "An unexpected error occurred, please try again!" };
  }
}
