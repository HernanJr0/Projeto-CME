import { createContext } from "react";

interface User {
	id: number;
	username: string;
	email: string;
	role: string;
}

interface AuthContextType {
	user: User | null;
	loading: boolean;
	login: (credentials: Credentials) => Promise<void>;
	register: (credentials: Credentials) => Promise<void>;
	logout: () => void;
}

interface Credentials {
	username: string;
	password: string;
	email?: string;
	role?: string;
}

export const AuthContext = createContext<AuthContextType | undefined>(
	undefined
);
