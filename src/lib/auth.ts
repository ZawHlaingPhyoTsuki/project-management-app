import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { openAPI } from "better-auth/plugins";
import prisma from "./db";
import { organization } from "better-auth/plugins";
// import { getEnvVar } from "./utils";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: true,
    async sendResetPassword(_data, _request) {
      // Send an email to the user with a link to reset their password
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 300, // 5 minutes
    },
  },
  // socialProviders: {
  //   google: {
  //     clientId: process.env.GOOGLE_CLIENT_ID as string,
  //     clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
  //   },
  //   github: {
  //     clientId: getEnvVar("GITHUB_CLIENT_ID"),
  //     clientSecret: getEnvVar("GITHUB_CLIENT_SECRET"),
  //   },
  // },
  // plugins: [openAPI(), organization()],
  plugins: [openAPI()],
});
