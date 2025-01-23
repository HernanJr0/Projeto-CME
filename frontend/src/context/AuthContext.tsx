import React, { createContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../utils/api";

interface User {
	username: string;
}

interface AuthContextType {
	user: User | null;
	login: (credentials: Credentials) => Promise<void>;
	register: (credentials: Credentials) => Promise<void>;
	logout: () => void;
}

interface Credentials {
	username: string;
	password: string;
}

export const AuthContext = createContext<AuthContextType | undefined>(
	undefined
);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [user, setUser] = useState<User | null>(null);
	const navigate = useNavigate();

	useEffect(() => {
		const token = localStorage.getItem("access");

		if (token) {
			try {
				const decoded = jwtDecode<{ username: string }>(token);
				setUser({ username: decoded.username });
				navigate("/dashboard");
			} catch (error) {
				console.error("Token inválido ou expirado:", error);
			}
		}
	}, [navigate]);

	const login = async (credentials: Credentials) => {
		const { data } = await api.post("login/", credentials);
		localStorage.setItem("access", data.access);
		localStorage.setItem("refresh", data.refresh);

		const decoded = jwtDecode<{ username: string }>(data.access);
		setUser({ username: decoded.username });
		navigate("/dashboard");
	};

	const register = async (credentials: Credentials) => {
		await api.post("register/", credentials);
		navigate("/");
	};

	const logout = () => {
		localStorage.removeItem("access");
		localStorage.removeItem("refresh");
		setUser(null);
		navigate("/");
	};

	return (
		<AuthContext.Provider value={{ user, login, register, logout }}>
			{children}
		</AuthContext.Provider>
	);
};
