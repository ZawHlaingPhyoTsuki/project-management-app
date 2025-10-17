import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./db";
// import { getEnvVar } from "./utils";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
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
  //     clientId: getEnvVar("GOOGLE_CLIENT_ID"),
  //     clientSecret: getEnvVar("GOOGLE_CLIENT_SECRET"),
  //   },
  //   github: {
  //     clientId: getEnvVar("GITHUB_CLIENT_ID"),
  //     clientSecret: getEnvVar("GITHUB_CLIENT_SECRET"),
  //   },
  // },
});
