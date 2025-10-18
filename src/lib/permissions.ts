import { Action, Resource } from "@/types/permission";
import { Role } from "../../prisma/generated/enums";

export const permissions: Record<Resource, Partial<Record<Action, Role[]>>> = {
  [Resource.WORKSPACE]: {
    [Action.CREATE]: [],
    [Action.VIEW]: [Role.ADMIN, Role.OWNER, Role.MEMBER, Role.VIEWER],
    [Action.UPDATE]: [Role.ADMIN, Role.OWNER],
    [Action.DELETE]: [Role.OWNER], // 🗑️ PERMANENT deletion

    [Action.INVITE]: [Role.ADMIN, Role.OWNER], // 👥 Invite members to workspace
    [Action.REMOVE]: [Role.ADMIN, Role.OWNER], // 👥 Remove members
    [Action.ARCHIVE]: [Role.ADMIN, Role.OWNER], // 📦 Soft delete to trash
    [Action.RESTORE]: [Role.OWNER, Role.ADMIN], // 🔄 Recover from trash
  },
  [Resource.BOARD]: {
    [Action.CREATE]: [Role.ADMIN, Role.OWNER, Role.MEMBER],
    [Action.VIEW]: [Role.ADMIN, Role.OWNER, Role.MEMBER, Role.VIEWER],
    [Action.UPDATE]: [Role.ADMIN, Role.OWNER, Role.MEMBER],
    [Action.DELETE]: [Role.OWNER, Role.ADMIN], // 🗑️ PERMANENT deletion

    [Action.INVITE]: [Role.ADMIN, Role.OWNER, Role.MEMBER], // 👥 Invite members to board
    [Action.REMOVE]: [Role.ADMIN, Role.OWNER], // 👥 Remove members
    [Action.ARCHIVE]: [Role.ADMIN, Role.OWNER], // 📦 Soft delete to trash
    [Action.RESTORE]: [Role.OWNER, Role.ADMIN], // 🔄 Recover from trash
  },
  [Resource.TASK]: {
    [Action.CREATE]: [Role.ADMIN, Role.OWNER, Role.MEMBER],
    [Action.VIEW]: [Role.ADMIN, Role.OWNER, Role.MEMBER, Role.VIEWER],
    [Action.UPDATE]: [Role.ADMIN, Role.OWNER, Role.MEMBER],
    [Action.DELETE]: [Role.ADMIN, Role.OWNER], // 🗑️ PERMANENT deletion

    [Action.ARCHIVE]: [Role.OWNER, Role.ADMIN, Role.MEMBER], // 📦 Soft delete to trash
    [Action.RESTORE]: [Role.OWNER, Role.ADMIN, Role.MEMBER], // 🔄 Recover from trash
    [Action.ASSIGN]: [Role.OWNER, Role.ADMIN, Role.MEMBER], // 📋 Assign Task
    [Action.REMOVE]: [Role.OWNER, Role.ADMIN, Role.MEMBER], // 👥 Unassign users
  },
};

// Check single permission
export const can = (
  userRole: Role,
  resource: Resource,
  action: Action,
): boolean => {
  const allowedRoles = permissions[resource]?.[action];
  return allowedRoles ? allowedRoles.includes(userRole) : false;
};

// Check multiple permissions
export const canAny = (
  userRole: Role,
  resource: Resource,
  actions: Action[],
): boolean => {
  return actions.some((action) => can(userRole, resource, action));
};

export const canAll = (
  userRole: Role,
  resource: Resource,
  actions: Action[],
): boolean => {
  return actions.every((action) => can(userRole, resource, action));
};
