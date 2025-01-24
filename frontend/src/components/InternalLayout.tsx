import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function InternalLayout() {
	return (
		<Box sx={{ display: "flex", height: "100vh" }}>
			<Sidebar />
			<Box sx={{ flex: 1, padding: "4rem 4rem 1rem", marginLeft: "240px" }}>
				<Outlet />
			</Box>
		</Box>
	);
}
