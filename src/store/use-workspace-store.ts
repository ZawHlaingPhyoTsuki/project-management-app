import { create } from "zustand";

interface WorkspaceState {
  currentlySelectedWorkspaceId: string | undefined;
  setCurrentlySelectedWorkspaceId: (workspaceId: string) => void;
  isWorkspaceModalOpen: boolean;
  setIsWorkspaceModalOpen: (isOpen: boolean) => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  isWorkspaceModalOpen: false,
  currentlySelectedWorkspaceId: undefined,
  setIsWorkspaceModalOpen: (isOpen: boolean) =>
    set({ isWorkspaceModalOpen: isOpen }),
  setCurrentlySelectedWorkspaceId: (workspaceId: string) =>
    set({ currentlySelectedWorkspaceId: workspaceId }),
}));
