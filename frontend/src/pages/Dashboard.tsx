import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Box, Card, Typography } from "@mui/material";

export default function Dashboard() {
	const auth = useContext(AuthContext);

	if (!auth) {
		return null;
	}

	return (
		<Box>
			<Box>
				<Typography variant="h4">Bem-vindo, {auth.user?.username}</Typography>
			</Box>

			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					height: "calc(100vh - 13rem)",
				}}
			>
				<Card
					sx={{
						flexGrow: 1,
						display: "flex",
						flexDirection: "column",
						gap: 2,
						textAlign: "center",
						justifyContent: "center",
						height: "600px",
						maxWidth: "1000px",
					}}
				>
					<Box sx={{ display: "flex", gap: 2 }}>
						<img
							src="/cme-icon.png"
							alt="placeholder"
							style={{
								width: "300px",
								height: "300px",
								borderRadius: "100%",
								margin: "0 auto",
							}}
						/>
					</Box>
					<Typography variant="h3">CME</Typography>
					<Typography variant="h5">
						Central de Materiais e Esterilização
					</Typography>
				</Card>
			</Box>
		</Box>
	);
}
