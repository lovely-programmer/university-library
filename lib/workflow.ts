import { Client as WorkflowClient } from "@upstash/workflow";
import config from "./config";
import { Client as QstarchClient, resend } from "@upstash/qstash";

export const workflowClient = new WorkflowClient({
  baseUrl: config.env.upstash.qstashUrl,
  token: config.env.upstash.qstashToken,
});

const qstashClient = new QstarchClient({
  token: config.env.upstash.qstashToken,
});

export const sendEmail = async ({
  email,
  message,
  subject,
}: {
  email: string;
  message: string;
  subject: string;
}) => {
  await qstashClient.publishJSON({
    api: {
      name: "email",
      provider: resend({ token: config.env.resendToken! }),
    },
    body: {
      from: "Codenway <hello.firstrustbk.com>",
      to: [email],
      subject,
      html: message,
    },
  });
};
