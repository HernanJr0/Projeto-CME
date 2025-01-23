import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Dashboard: React.FC = () => {
	const auth = useContext(AuthContext);

	if (!auth) {
		return null;
	}

	return (
		<div>
			<h1>Olá, {auth.user?.username}!</h1>
			<button onClick={auth.logout}>Logout</button>
		</div>
	);
};

export default Dashboard;
