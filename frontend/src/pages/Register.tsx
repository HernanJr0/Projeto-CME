import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import AuthForm from "../components/AuthForm";

const Register: React.FC = () => {
	const auth = useContext(AuthContext);

	if (!auth) {
		return null;
	}

	return (
		<div>
			<h1>Register</h1>
			<AuthForm onSubmit={auth.register} buttonText="Register" />
		</div>
	);
};

export default Register;
