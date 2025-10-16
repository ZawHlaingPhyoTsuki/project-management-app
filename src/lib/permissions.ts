import { Action, Resource, Role } from "@/types/permission";

export const permissions: Record<Resource, Record<Action, Role[]>> = {
  [Resource.WORKSPACE]: {
    [Action.CREATE]: [Role.ADMIN],
    [Action.UPDATE]: [Role.ADMIN, Role.OWNER],
    [Action.DELETE]: [Role.ADMIN],
    [Action.VIEW]: [Role.ADMIN, Role.OWNER, Role.MEMBER, Role.VIEWER],
  },
  [Resource.BOARD]: {
    [Action.CREATE]: [Role.ADMIN, Role.OWNER, Role.MEMBER],
    [Action.UPDATE]: [Role.ADMIN, Role.OWNER, Role.MEMBER],
    [Action.DELETE]: [Role.ADMIN, Role.OWNER],
    [Action.VIEW]: [Role.ADMIN, Role.OWNER, Role.MEMBER, Role.VIEWER],
  },
  [Resource.TASK]: {
    [Action.CREATE]: [Role.ADMIN, Role.OWNER, Role.MEMBER],
    [Action.UPDATE]: [Role.ADMIN, Role.OWNER, Role.MEMBER],
    [Action.DELETE]: [Role.ADMIN, Role.OWNER, Role.MEMBER],
    [Action.VIEW]: [Role.ADMIN, Role.OWNER, Role.MEMBER, Role.VIEWER],
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
