import { Action, Resource } from "@/types/permission";
import { Role } from "../../prisma/generated/enums";

export const permissions: Record<Resource, Partial<Record<Action, Role[]>>> = {
  [Resource.WORKSPACE]: {
    [Action.CREATE]: [Role.ADMIN],
    [Action.VIEW]: [Role.ADMIN, Role.OWNER, Role.MEMBER, Role.VIEWER],
    [Action.UPDATE]: [Role.ADMIN, Role.OWNER],
    [Action.DELETE]: [Role.ADMIN],

    [Action.INVITE]: [Role.ADMIN, Role.OWNER],
    [Action.REMOVE]: [Role.ADMIN, Role.OWNER],
    [Action.ARCHIVE]: [Role.ADMIN, Role.OWNER],
  },
  [Resource.BOARD]: {
    [Action.CREATE]: [Role.ADMIN, Role.OWNER, Role.MEMBER],
    [Action.VIEW]: [Role.ADMIN, Role.OWNER, Role.MEMBER, Role.VIEWER],
    [Action.UPDATE]: [Role.ADMIN, Role.OWNER, Role.MEMBER],
    [Action.DELETE]: [Role.ADMIN, Role.OWNER],

    [Action.INVITE]: [Role.ADMIN, Role.OWNER, Role.MEMBER],
    [Action.REMOVE]: [Role.ADMIN, Role.OWNER],
    [Action.ARCHIVE]: [Role.ADMIN, Role.OWNER],
    [Action.ASSIGN]: [Role.ADMIN, Role.OWNER, Role.MEMBER],
  },
  [Resource.TASK]: {
    [Action.CREATE]: [Role.ADMIN, Role.OWNER, Role.MEMBER],
    [Action.VIEW]: [Role.ADMIN, Role.OWNER, Role.MEMBER, Role.VIEWER],
    [Action.UPDATE]: [Role.ADMIN, Role.OWNER, Role.MEMBER],
    [Action.DELETE]: [Role.ADMIN, Role.OWNER, Role.MEMBER],

    [Action.ASSIGN]: [Role.ADMIN, Role.OWNER, Role.MEMBER],
    [Action.ARCHIVE]: [Role.ADMIN, Role.OWNER, Role.MEMBER],
    [Action.INVITE]: [],
    [Action.REMOVE]: [],
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
