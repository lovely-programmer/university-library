import { db } from "@/database/drizzle";
import { usersTable } from "@/database/schema";
import { sendEmail } from "@/lib/workflow";
import { serve } from "@upstash/workflow/nextjs";
import { eq } from "drizzle-orm";

type UserState = "non-active" | "active";

type InitialData = {
  email: string;
  fullName: string;
};

const ONE_DAY_IN_MS = 60 * 60 * 24 * 1000;
const THREE_DAYS_IN_MS = ONE_DAY_IN_MS * 3;
const ONE_MONTH_IN_MS = ONE_DAY_IN_MS * 30;

export const { POST } = serve<InitialData>(async (context) => {
  const { email, fullName } = context.requestPayload;

  await context.run("new-signup", async () => {
    await sendEmail({
      email,
      subject: "Welcome to the platform",
      message: `Hello ${fullName},\n\nThank you for signing up! We are excited to have you on board.\n\nBest regards,\nThe Team`,
    });
  });

  await context.sleep("wait-for-3-days", 60 * 60 * 24 * 3);

  while (true) {
    const state = await context.run("check-user-state", async () => {
      return await getUserState(email);
    });

    if (state === "non-active") {
      await context.run("send-email-non-active", async () => {
        await sendEmail({
          email,
          subject: "We miss you!",
          message: `Hello ${fullName},\n\nWe noticed you haven't been active for a while. We would love to see you back!\n\nBest regards,\nThe Team`,
        });
      });
    } else if (state === "active") {
      await context.run("send-email-active", async () => {
        await sendEmail({
          email,
          subject: "Welcome back!",
          message: `Hello ${fullName},\n\nIt's great to see you back! We hope you're enjoying your time on the platform.\n\nBest regards,\nThe Team`,
        });
      });
    }

    await context.sleep("wait-for-1-month", 60 * 60 * 24 * 30);
  }
});

const getUserState = async (email: string): Promise<UserState> => {
  const user = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email))
    .limit(1);

  if (user.length === 0) return "non-active";

  const lastActivityDate = new Date(user[0].lastActivityDate!);
  const now = new Date();

  const timeDifference = now.getTime() - lastActivityDate.getTime();

  if (timeDifference > THREE_DAYS_IN_MS && timeDifference <= ONE_MONTH_IN_MS) {
    return "non-active";
  }

  return "active";
};
