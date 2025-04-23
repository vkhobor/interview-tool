import { create } from "zustand";
import type { User } from "../types";

interface UserState {
	user: User | null;
	setUser: (user: User | null) => void;
}

export const userUserStore = create<UserState>((set) => ({
	user: null,
	setUser: (user) => set({ user }),
}));
