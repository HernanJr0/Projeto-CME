import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";

/* import "@fontsource/nunito-sans/400.css";
import "@fontsource/nunito-sans/500.css";
import "@fontsource/nunito-sans/700.css"; */
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";

const Root = () => {
	const [mode, setMode] = useState<"light" | "dark">(
		() => (localStorage.getItem("theme") as "light" | "dark") || "light"
	);

	useEffect(() => {
		localStorage.setItem("theme", mode);
	}, [mode]);

	const theme = createTheme({
		palette: {
			mode: mode,
			background: { default: mode === "light" ? "#f0f0f0" : "#121212" },
		},
		typography: {
			fontFamily: "Plus Jakarta Sans, sans-serif",
		},
		components: {
			MuiButton: {
				styleOverrides: {
					root: {
						textTransform: "none",
					},
				},
			},
			MuiCard: {
				styleOverrides: {
					root: {
						borderRadius: 7,
					},
				},
			}
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
