import { Typography, Box, Card } from "@mui/material";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Profile() {
	const auth = useContext(AuthContext);

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				height: "100%",
				width: "100%",
			}}
		>
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					marginBottom: 2,
				}}
			>
				<Box>
					<Typography variant="h4" gutterBottom>
						Perfil
					</Typography>
					<Typography variant="subtitle1" gutterBottom>
						Visualize e edite suas informações
					</Typography>
				</Box>
			</Box>

			<Box>
				<Card sx={{ padding: "30px 30px 24px", width: "fit-content" }}>
					<Box>
						<Typography variant="h6" sx={{ marginBottom: 2 }}>
							Informações
						</Typography>
						<Typography variant="body1" gutterBottom>
							<strong>Nome de Usuário:</strong> {auth?.user?.username || "-"}
						</Typography>
						<Typography variant="body1" gutterBottom>
							<strong>Email:</strong> {auth?.user?.email || "-"}
						</Typography>
						<Typography variant="body1" gutterBottom>
							<strong>Cargo:</strong> {auth?.user?.role || "-"}
						</Typography>
					</Box>
				</Card>
			</Box>
		</div>
	);
}
