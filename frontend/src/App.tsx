import React from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { AuthContext } from "./context/AuthContext";
import { IconButton, Tooltip } from "@mui/material";
import { DarkMode, LightMode } from "@mui/icons-material";
import { AuthProvider } from "./context/AuthProvider";
import InternalLayout from "./components/InternalLayout";
import UserManagement from "./pages/UserManagement";

const PrivateRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
	const auth = React.useContext(AuthContext);

	if (!auth) {
		throw new Error("Erro no AuthContext.");
	}

	if (auth.loading) return <div>Carregando...</div>;
	return auth.user ? children : <Navigate to="/" />;
};

const PublicRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
	const auth = React.useContext(AuthContext);

	if (!auth) {
		throw new Error("Erro no AuthContext.");
	}

	return auth.user ? <Navigate to="/dashboard" /> : children;
};

const PrivateRoutes: React.FC = () => (
	<PrivateRoute>
		<Routes>
			<Route path="/" element={<InternalLayout />}>
				<Route path="dashboard" element={<Dashboard />} />
				<Route path="users" element={<UserManagement />} />
				<Route path="profile" element={<div>Profile</div>} />
				<Route path="reports" element={<div>Reports</div>} />
				<Route path="materials" element={<div>Materials</div>} />
				<Route path="processing" element={<div>Processing</div>} />
			</Route>
		</Routes>
	</PrivateRoute>
);

interface AppProps {
	mode: "light" | "dark";
	setMode: React.Dispatch<React.SetStateAction<"light" | "dark">>;
}

const App: React.FC<AppProps> = ({ mode, setMode }) => {
	return (
		<Router>
			<Tooltip
				sx={{
					position: "fixed",
					top: 16,
					right: 16,
				}}
				title={`Mudar para o modo ${mode === "light" ? "escuro" : "claro"}`}
			>
				<IconButton
					onClick={() => setMode(mode === "light" ? "dark" : "light")}
				>
					{mode === "light" ? <DarkMode /> : <LightMode />}
				</IconButton>
			</Tooltip>

			<AuthProvider>
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
};

export default App;
