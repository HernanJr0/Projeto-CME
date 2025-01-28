import React, { ReactNode, useContext } from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { AuthContext } from "./context/AuthContext";
import { Box, IconButton, Tooltip } from "@mui/material";
import {
	AccountCircleRounded,
	DarkModeRounded,
	LightModeRounded,
} from "@mui/icons-material";
import { AuthProvider } from "./context/AuthProvider";
import InternalLayout from "./components/InternalLayout";
import Users from "./pages/Users";
import Materials from "./pages/Materials";
import Processing from "./pages/Processing";
import ProfileModal from "./components/ProfileModal";
import Reports from "./pages/Reports";

interface ChildrenProps {
	children: ReactNode;
}

interface ToolbarProps {
	mode: "light" | "dark";
	setMode: React.Dispatch<React.SetStateAction<"light" | "dark">>;
}

const ThemeButton: React.FC<ToolbarProps> = ({ mode, setMode }) => (
	<Tooltip
		title={`Mudar para o modo ${mode === "light" ? "escuro" : "claro"}`}
		sx={{
			position: "fixed",
			top: 16,
			right: 32,
			zIndex: 1000,
		}}
	>
		<IconButton onClick={() => setMode(mode === "light" ? "dark" : "light")}>
			{mode === "light" ? (
				<DarkModeRounded sx={{ fontSize: "2rem" }} />
			) : (
				<LightModeRounded sx={{ fontSize: "2rem" }} />
			)}
		</IconButton>
	</Tooltip>
);

function PrivateRoute({ children }: ChildrenProps) {
	const auth = useContext(AuthContext);

	if (!auth) {
		throw new Error("Erro no AuthContext.");
	}

	if (auth.loading) return <div>Carregando...</div>;
	return auth.user ? children : <Navigate to="/" />;
}

function PublicRoute({ children }: ChildrenProps) {
	const auth = useContext(AuthContext);

	if (!auth) {
		throw new Error("Erro no AuthContext.");
	}

	return auth.user ? <Navigate to="/dashboard" /> : <>{children}</>;
}

function PrivateRoutes() {
	const [open, setOpen] = React.useState(false);
	const auth = useContext(AuthContext);

	if (!auth) {
		throw new Error("Erro no AuthContext.");
	}

	if (auth.loading) return <div>Carregando...</div>;

	const userRole = auth.user?.role;

	const hasAccess = (route: string) => {
		if (userRole === "administrativo") return true;
		if (userRole === "tecnico")
			return ["materials", "processing"].includes(route);
		if (userRole === "enfermeiro") return ["reports"].includes(route);
		return false;
	};

	return (
		<>
			<Box
				sx={{
					position: "fixed",
					top: 16,
					right: 96,
					zIndex: 1000,
				}}
			>
				<Tooltip title="Perfil">
					<IconButton onClick={() => setOpen(true)}>
						<AccountCircleRounded sx={{ fontSize: "2rem" }} />
					</IconButton>
				</Tooltip>
			</Box>
			<PrivateRoute>
				<Routes>
					<Route path="/" element={<InternalLayout />}>
						<Route path="dashboard" element={<Dashboard />} />
						{hasAccess("users") && <Route path="users" element={<Users />} />}
						{hasAccess("reports") && (
							<Route path="reports" element={<Reports />} />
						)}
						{hasAccess("materials") && (
							<Route path="materials" element={<Materials />} />
						)}
						{hasAccess("processing") && (
							<Route path="processing" element={<Processing />} />
						)}
					</Route>
				</Routes>
			</PrivateRoute>
			<ProfileModal isOpen={open} onClose={() => setOpen(false)} />
		</>
	);
}

function App({ mode, setMode }: ToolbarProps) {
	return (
		<Router>
			<AuthProvider>
				<ThemeButton mode={mode} setMode={setMode} />
				<Routes>
					<Route
						path="/"
						element={
							<PublicRoute>
								<Login />
							</PublicRoute>
						}
					/>
					<Route path="/*" element={<PrivateRoutes />} />
				</Routes>
			</AuthProvider>
		</Router>
	);
}

export default App;
