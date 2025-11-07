export enum Resource {
  WORKSPACE = "WORKSPACE",
  BOARD = "BOARD",
  TASKLIST = "TASKLIST",
  TASK = "TASK",
}

export enum Action {
  CREATE = "CREATE",
  VIEW = "VIEW",
  UPDATE = "UPDATE",
  DELETE = "DELETE", // ❌ Permanently removes from database
  INVITE = "INVITE",
  REMOVE = "REMOVE", // 👥 Remove a user from workspace/board & 🚫 Unassign a user from a task
  ARCHIVE = "ARCHIVE", // 📦 Moves to trash
  RESTORE = "RESTORE", // 🔄 Recover from trash
  ASSIGN = "ASSIGN",
}
