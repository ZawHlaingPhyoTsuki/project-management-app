import { create } from "zustand";

interface TaskListState {
  isTaskListModalOpen: boolean;
  setIsTaskListModalOpen: (isOpen: boolean) => void;
}

export const useTaskListStore = create<TaskListState>((set) => ({
  isTaskListModalOpen: false,
  setIsTaskListModalOpen: (isOpen: boolean) =>
    set({ isTaskListModalOpen: isOpen }),
}));
