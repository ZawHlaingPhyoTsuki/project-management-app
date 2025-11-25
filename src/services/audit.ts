"use server";
import { CreateAudLog, User } from "@/interfaces";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { headers } from "next/headers";

export const createAudLog = async (props: CreateAudLog) => {
  try {
    const { tableId, tableTitle, tableType, action, orgId } = props;
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session) {
      return {
        error: "user not found",
      };
    }
    const user = await prisma.user.findFirst({
      where: { email: session.user.email },
    });

    if (!user) {
      return {
        error: "user not found",
      };
    }

    console.log(user, "user");
    const audit = await prisma.auditLog.create({
      data: {
        tableId,
        tableTitle,
        tableType,
        action,
        orgId,
        userId: user.id,
        userImage: user.image || "",
        userName: user.name,
      },
    });
    console.log(user, "user", audit);
  } catch (error) {
    console.log("audit error", error);
  }
};
