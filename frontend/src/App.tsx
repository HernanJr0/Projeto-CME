import React from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import { AuthContext, AuthProvider } from "./context/AuthContext";

const PrivateRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
	const auth = React.useContext(AuthContext);
	return auth?.user ? children : <Navigate to="/" />;
};

const App: React.FC = () => {
	return (
		<Router>
			<AuthProvider>
				<Routes>
					<Route path="/" element={<Login />} />
					<Route path="/register" element={<Register />} />
					<Route
						path="/dashboard"
						element={
							<PrivateRoute>
								<Dashboard />
							</PrivateRoute>
						}
					/>
				</Routes>
			</AuthProvider>
		</Router>
	);
};

export default App;
