import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import AuthForm from "../components/AuthForm";
import { Card, Container, Typography } from "@mui/material";

const Login: React.FC = () => {
	const auth = useContext(AuthContext);

	if (!auth) {
		return null;
	}

	return (
		<Container
			sx={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				height: "calc(100vh - 5rem)",
			}}
		>
			<Card sx={{ padding: 4 }}>
				<Typography
					variant="h4"
					sx={{
						marginBottom: 2,
					}}
				>
					Fazer login
				</Typography>
				<AuthForm onSubmit={auth.login} buttonText="Continuar" />
			</Card>
		</Container>
	);
};

export default Login;
