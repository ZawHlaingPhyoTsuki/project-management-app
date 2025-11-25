import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { TABLE_TYPE } from "@prisma/client";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

export const GET = async (
  req: Request,
  { params }: { params: Promise<{ cardId: string }> }
) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const audit = await prisma.auditLog.findMany({
      where: { tableId: (await params).cardId, tableType: TABLE_TYPE.CARD },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(audit);
  } catch (error) {
    return new NextResponse("Internat server error", { status: 500 });
  }
};
