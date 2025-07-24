"use server";

import { db } from "@/database/drizzle";
import { eq } from "drizzle-orm";
import { usersTable } from "@/database/schema";
import bcrypt from "bcryptjs";
import { signIn } from "@/auth";
import { headers } from "next/headers";
import ratelimit from "../ratelimit";
import { redirect } from "next/navigation";
import { workflowClient } from "../workflow";
import config from "../config";

export const siginInWithCredentials = async (
  params: Pick<AuthCredentials, "email" | "password">
) => {
  const { email, password } = params;

  const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1";
  const { success } = await ratelimit.limit(ip);
  if (!success) return redirect("/too-fast");

  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (result?.error) return { success: false, error: result.error };
    return { success: true };
  } catch (error) {
    console.log(error, "Signup error");
    return { success: false, error: "Something went wrong" };
  }
};

export const signUp = async (params: AuthCredentials) => {
  const { fullName, email, universityId, universityCard, password } = params;

  // ratelimiting
  const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1";
  const { success } = await ratelimit.limit(ip);
  if (!success) return redirect("/too-fast");

  // Check if user already exists
  const existingUser = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email))
    .limit(1);

  if (existingUser.length > 0) {
    return { success: false, error: "User already exists" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await db.insert(usersTable).values({
      fullName,
      email,
      universityId,
      universityCard,
      password: hashedPassword,
    });

    await workflowClient.trigger({
      url: `${config.env.prodApiEndpoint}/api/workflow`,
      body: {
        email,
        fullName,
      },
    });

    await siginInWithCredentials({ email, password });
    return { success: true };
  } catch (error) {
    console.log(error, "Signup error");
    return { success: false, error: "Something went wrong" };
  }
};
