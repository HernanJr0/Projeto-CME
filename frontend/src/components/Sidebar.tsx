import {
	Box,
	Button,
	Divider,
	Tooltip,
	Typography,
	useTheme,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

import {
	DashboardOutlined,
	DescriptionOutlined,
	GroupsOutlined,
	HourglassEmptyOutlined,
	InventoryOutlined,
	LogoutRounded,
} from "@mui/icons-material";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

interface SidebarItemProps {
	label: string;
	url: string;
	icon?: React.ReactNode;
	onClick?: () => void;
}

function SidebarItem({ label, icon, url, onClick }: SidebarItemProps) {
	const theme = useTheme();
	const location = useLocation();

	return (
		<Tooltip
			title={label}
			arrow
			placement="right"
			enterDelay={500}
			leaveDelay={200}
		>
			<Button
				sx={{
					width: "100%",
					justifyContent: "flex-start",
					textTransform: "none",
					marginBottom: "0.5rem",
					backgroundColor:
						location.pathname === url ? theme.palette.primary.main : undefined,
				}}
				onClick={onClick}
			>
				{icon && (
					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							marginRight: "0.5rem",

							"& svg": {
								fill: location.pathname === url ? "#fff" : undefined,
							},
						}}
					>
						{icon}
					</Box>
				)}
				<Typography
					sx={{
						overflow: "hidden",
						textOverflow: "ellipsis",
						whiteSpace: "nowrap",
						fontSize: "0.875rem",
						fontWeight: 500,
						color: location.pathname === url ? "#fff" : undefined,
					}}
				>
					{label}
				</Typography>
			</Button>
		</Tooltip>
	);
}

const SidebarSection: React.FC<{
	title: string;
	items: {
		url: string;
		label: string;
		icon?: React.ReactNode;
		onClick?: () => void;
	}[];
}> = ({ title, items }) => (
	<Box sx={{ mb: 3 }}>
		<Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
			{title}
		</Typography>
		{items.map((item, index) => (
			<SidebarItem key={index} {...item} />
		))}
	</Box>
);

function Sidebar() {
	const auth = useContext(AuthContext);

	const navigate = useNavigate();
	const theme = useTheme();

	if (!auth) {
		return null;
	}

	const sidebarSections = [
		{
			title: "Home",
			items: [
				{
					label: "Dashboard",
					url: "/dashboard",
					icon: <DashboardOutlined />,
					onClick: () => navigate("/dashboard"),
				},
			],
		},
		{
			title: "Gestão de Usuários",
			items: [
				{
					label: "Gerenciamento de Usuários",
					url: "/users",
					icon: <GroupsOutlined />,
					onClick: () => navigate("/users"),
				},
			],
		},
		{
			title: "Materiais e Processos",
			items: [
				{
					label: "Materiais",
					url: "/materials",
					icon: <InventoryOutlined />,
					onClick: () => navigate("/materials"),
				},
				{
					label: "Processos",
					url: "/processing",
					icon: <HourglassEmptyOutlined />,
					onClick: () => navigate("/processing"),
				},
			],
		},
		{
			title: "Relatórios",
			items: [
				{
					label: "Visualizar e Exportar",
					url: "/reports",
					icon: <DescriptionOutlined />,
					onClick: () => navigate("/reports"),
				},
			],
		},
	];

	return (
		<Box
			sx={{
				width: 240,
				padding: 1,
				position: "fixed",
				height: "100vh",
				overflowY: "auto",
				borderRight: `1px solid ${theme.palette.divider}`,
				backgroundColor: theme.palette.background.paper,
				display: "flex",
				flexDirection: "column",
			}}
		>
			<Box sx={{ textAlign: "center", margin: "1rem auto" }}>
				<Typography variant="h6">CME</Typography>
				<Typography variant="subtitle1">
					Central de Materiais e Esterilização
				</Typography>
			</Box>

			<Box sx={{ padding: "1rem" }}>
				<Divider sx={{ mb: 2 }} />

				{sidebarSections.map((section, index) => (
					<SidebarSection key={index} {...section} />
				))}

				<Divider sx={{ my: 2 }} />

				<Button
					onClick={auth.logout}
					color="error"
					sx={{
						width: "100%",
					}}
				>
					<LogoutRounded
						sx={{
							marginRight: "0.5rem",
						}}
					/>
					Fazer Logout
				</Button>
			</Box>
		</Box>
	);
}

export default Sidebar;
