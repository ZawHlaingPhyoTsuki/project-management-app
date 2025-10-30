import { create } from "zustand";

interface BoardState {
  currentBoardId: string | null;
  setCurrentBoardId: (boardId: string) => void;
  isBoardModalOpen: boolean;
  setIsBoardModalOpen: (isOpen: boolean) => void;
}

export const useBoardStore = create<BoardState>((set) => ({
  currentBoardId: null,
  isBoardModalOpen: false,
  // currentBoardId: "077c9ba4-6e31-486e-a4d4-aca36c1305fd",
  setCurrentBoardId: (boardId: string) => set({ currentBoardId: boardId }),
  setIsBoardModalOpen: (isOpen: boolean) => set({ isBoardModalOpen: isOpen }),
}));
