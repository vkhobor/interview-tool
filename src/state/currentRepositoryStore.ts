import { create } from "zustand";
import type { Repository } from "../types";

interface CurrRepoState {
	repo: Repository | null;
	setRepo: (user: Repository | null) => void;
}

export const useCurrRepoStore = create<CurrRepoState>((set) => ({
	repo: null,
	setRepo: (user) => set({ repo: user }),
}));
