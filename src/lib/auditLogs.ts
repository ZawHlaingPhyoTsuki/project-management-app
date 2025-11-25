import { ACTION } from "@/app/generated/prisma/enums";
import { CreateAudLog } from "@/types";

export const auditLogs = (log: CreateAudLog) => {
  const { action, tableTitle, tableType } = log;
  switch (action) {
    case ACTION.CREATE:
      return `created ${tableType?.toLowerCase()} ${tableTitle}`;
    case ACTION.UPDATE:
      return `updated ${tableType?.toLowerCase()} ${tableTitle}`;
    case ACTION.DELETE:
      return `deleted ${tableType?.toLowerCase()} ${tableTitle}`;
  }
};
