import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import AuthForm from "../components/AuthForm";
import {
	Card,
	Container,
	IconButton,
	Tooltip,
	Typography,
} from "@mui/material";
import { InfoOutlined } from "@mui/icons-material";

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
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
					}}
				>
					<Typography
						variant="h4"
						sx={{
							marginBottom: 2,
						}}
					>
						Fazer login
					</Typography>

					<div>
						<Tooltip title="Caso não tenha uma conta, entre em contato com o setor administrativo." arrow>
							<IconButton>
								<InfoOutlined />
							</IconButton>
						</Tooltip>
					</div>
				</div>
				<AuthForm onSubmit={auth.login} buttonText="Continuar" />
			</Card>
		</Container>
	);
};

export default Login;
