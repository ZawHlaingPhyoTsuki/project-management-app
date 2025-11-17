export interface User {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
}

export interface WorkspaceMember {
  user: User;
}

export interface Board {
  id: string;
  name: string;
  description: string | null;
  workspaceId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Workspace {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  members: WorkspaceMember[];
  boards: Board[];
  _count: {
    boards: number;
    members: number;
  };
}
