import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import AuthForm from "../components/AuthForm";

const Login: React.FC = () => {
	const auth = useContext(AuthContext);

	if (!auth) {
		return null;
	}

	return (
		<div>
			<h1>Login</h1>
			<AuthForm onSubmit={auth.login} buttonText="Login" />
		</div>
	);
};

export default Login;
