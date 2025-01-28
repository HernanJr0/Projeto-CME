import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";

import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";

const Root = () => {
	const [mode, setMode] = useState<"light" | "dark">(
		() => (localStorage.getItem("theme") as "light" | "dark") || "light"
	);

	useEffect(() => {
		localStorage.setItem("theme", mode);
	}, [mode]);

	const theme = createTheme({
		custom: {
			background: {
				primary: mode === "light" ? "#fff" : "#2D3748",
			},
			icon: {
				primary: mode === "light" ? "#2563EB" : "#F59E0B",
			}
		},
		palette: {
			mode: mode,
			primary: {
				main: "#5082EF",
			},
			secondary: {
				main: "#F59E0B",
			},
			background: {
				default: mode === "light" ? "#fff" : "#0f172a",
				paper: mode === "light" ? "#f7fafc" : "#1A202C",
			},
			text: {
				primary: mode === "light" ? "#2D3748" : "#EDF2F7",
				secondary: mode === "light" ? "#4A5568" : "#CBD5E0",
			},
		},
		typography: {
			fontFamily: "Plus Jakarta Sans, sans-serif",
			h1: {
				fontSize: "2rem",
				fontWeight: 600,
				color: mode === "light" ? "#2D3748" : "#EDF2F7",
			},
			h2: {
				fontSize: "1.75rem",
				fontWeight: 600,
				color: mode === "light" ? "#2D3748" : "#EDF2F7",
			},
			body1: {
				fontSize: "1rem",
				color: mode === "light" ? "#4A5568" : "#CBD5E0",
			},
		},
		components: {
			MuiButton: {
				styleOverrides: {
					root: {
						textTransform: "none",
						borderRadius: "12px",
						fontWeight: 600,
					},
				},
			},
			MuiCard: {
				styleOverrides: {
					root: {
						borderRadius: 8,
						backgroundColor: mode === "light" ? "#fff" : "#0f172a",
						boxShadow:
							mode === "light"
								? "0px 4px 32px rgba(0, 0, 0, 0.1)"
								: "0px 4px 32px rgba(255, 255, 255, 0.05)",
						padding: "16px",
					},
				},
			},
			MuiTextField: {
				styleOverrides: {
					root: {
						borderRadius: 8,
						backgroundColor: mode === "light" ? "#fff" : "#2D3748",
						"& .MuiOutlinedInput-root": {
							"& fieldset": {
								borderColor: mode === "light" ? "#E2E8F0" : "#4A5568",
							},
							"&:hover fieldset": {
								borderColor: mode === "light" ? "#2563EB" : "#F59E0B",
							},
							"&.Mui-focused fieldset": {
								borderColor: mode === "light" ? "#2563EB" : "#F59E0B",
							},
						},
					},
				},
			},
			MuiSelect: {
				styleOverrides: {
					root: {
						borderRadius: 8,
						backgroundColor: mode === "light" ? "#fff" : "#2D3748",
						"& .MuiOutlinedInput-root": {
							"& fieldset": {
								borderColor: mode === "light" ? "#E2E8F0" : "#4A5568",
							},
							"&:hover fieldset": {
								borderColor: mode === "light" ? "#2563EB" : "#F59E0B",
							},
							"&.Mui-focused fieldset": {
								borderColor: mode === "light" ? "#2563EB" : "#F59E0B",
							},
						},
					},
				},
			},
		},
	});

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<App mode={mode} setMode={setMode} />
		</ThemeProvider>
	);
};

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<Root />
	</StrictMode>
);
