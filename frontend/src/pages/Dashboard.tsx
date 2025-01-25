import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Box, Typography } from "@mui/material";

export default function Dashboard() {
	const auth = useContext(AuthContext);

	if (!auth) {
		return null;
	}

	return (
		<Box sx={{ display: "flex" }}>
			<Box>
				<Typography variant="h4">Bem-vindo, {auth.user?.username}</Typography>
			</Box>
		</Box>
	);
}
