import React, { useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../utils/api";
import { Snackbar, Alert } from "@mui/material";
import { AuthContext } from "./AuthContext";

interface User {
	id?: number;
	username: string;
	email?: string;
	role?: string;
}

interface Credentials {
	username: string;
	password: string;
	email?: string;
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const [openSnackbar, setOpenSnackbar] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState("");
	const navigate = useNavigate();

	const showErrorSnackbar = (message: string) => {
		setSnackbarMessage(message);
		setOpenSnackbar(true);
	};

	const refreshToken = async () => {
		const refresh = localStorage.getItem("refresh");
		if (!refresh) return null;

		try {
			const { data } = await api.post("token/refresh/", { refresh });
			localStorage.setItem("access", data.access);
			return data.access;
		} catch {
			logout();
			return null;
		}
	};

	const fetchUserProfile = async () => {
		const token = localStorage.getItem("access");
		if (!token) return;

		try {
			const { data } = await api.get("profile/", {
				headers: { Authorization: `Bearer ${token}` },
			});
			setUser({
				id: data.id,
				username: data.username,
				email: data.email,
				role: data.role,
			});
		} catch {
			const newToken = await refreshToken();
			if (newToken) {
				await fetchUserProfile();
			} else {
				showErrorSnackbar("Sessão expirada. Faça login novamente.");
			}
		} finally {
			setLoading(false);
		}
	};

	const login = async (credentials: Credentials) => {
		try {
			const { data } = await api.post("login/", credentials);
			localStorage.setItem("access", data.access);
			localStorage.setItem("refresh", data.refresh);

			const decoded = jwtDecode<{ username: string }>(data.access);
			setUser({ username: decoded.username });
			navigate("/dashboard");
		} catch {
			showErrorSnackbar("Erro ao fazer login. Verifique seus dados.");
		}
	};

	const register = async (credentials: Credentials) => {
		try {
			await api.post("register/", credentials);
		} catch {
			showErrorSnackbar("Erro ao criar conta. Verifique os dados.");
		}
	};

	const logout = () => {
		localStorage.removeItem("access");
		localStorage.removeItem("refresh");
		setUser(null);
		navigate("/");
	};

	useEffect(() => {
		const initializeAuth = async () => {
			const token = localStorage.getItem("access");

			if (token) {
				try {
					const decoded = jwtDecode<{ username: string }>(token);
					setUser({ username: decoded.username });
					await fetchUserProfile();
				} catch {
					logout();
				}
			}
			setLoading(false);
		};
		initializeAuth();
	}, [navigate]);

	return (
		<AuthContext.Provider value={{ user, loading, login, register, logout }}>
			{children}
			<Snackbar
				open={openSnackbar}
				autoHideDuration={6000}
				onClose={() => setOpenSnackbar(false)}
			>
				<Alert onClose={() => setOpenSnackbar(false)} severity="error">
					{snackbarMessage}
				</Alert>
			</Snackbar>
		</AuthContext.Provider>
	);
};
