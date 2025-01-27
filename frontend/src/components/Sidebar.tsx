import {
	Box,
	Button,
	Divider,
	Tooltip,
	Typography,
	useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import {
	DashboardRounded,
	DescriptionRounded,
	GroupsRounded,
	HourglassBottomRounded,
	InventoryRounded,
	LogoutRounded,
} from "@mui/icons-material";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

interface SidebarItemProps {
	label: string;
	icon?: React.ReactNode;
	onClick?: () => void;
}

function SidebarItem({ label, icon, onClick }: SidebarItemProps) {
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
				}}
				onClick={onClick}
			>
				{icon && (
					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							marginRight: "0.5rem",
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
	items: { label: string; icon?: React.ReactNode; onClick?: () => void }[];
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
					icon: <DashboardRounded />,
					onClick: () => navigate("/dashboard"),
				},
			],
		},
		{
			title: "Gestão de Usuários",
			items: [
				{
					label: "Gerenciamento de Usuários",
					icon: <GroupsRounded />,
					onClick: () => navigate("/users"),
				},
			],
		},
		{
			title: "Materiais e Processos",
			items: [
				{
					label: "Materiais",
					icon: <InventoryRounded />,
					onClick: () => navigate("/materials"),
				},
				{
					label: "Processamento",
					icon: <HourglassBottomRounded />,
					onClick: () => navigate("/processing"),
				},
			],
		},
		{
			title: "Relatórios",
			items: [
				{
					label: "Visualizar e Exportar",
					icon: <DescriptionRounded />,
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
			}}
		>
			<Box sx={{ padding: "1rem 0 0", textAlign: "center" }}>
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
