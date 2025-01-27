import {
	Typography,
	Dialog,
	DialogContent,
	DialogActions,
	Button,
	useTheme,
} from "@mui/material";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { EmailRounded, PersonRounded, WorkRounded } from "@mui/icons-material";

interface ProfileModalProps {
	isOpen: boolean;
	onClose: () => void;
}

interface InfoItemProps {
	icon: React.ElementType;
	label: string;
	value: string;
}

function InfoItem({ icon: Icon, label, value }: InfoItemProps) {
	const theme = useTheme();
	return (
		<>
			<Typography variant="body1" gutterBottom fontWeight={500}>
				{label}
			</Typography>
			<Typography
				variant="body1"
				gutterBottom
				sx={{
					backgroundColor: theme.custom.background.primary,
					border: `1px solid ${theme.palette.divider}`,
					padding: "8px",
					borderRadius: "4px",
					marginBottom: "16px",
					display: "flex",
					alignItems: "center",
					gap: "0.5rem",
				}}
			>
				<Icon />
				{value || "-"}
			</Typography>
		</>
	);
}

function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
	const { user } = useContext(AuthContext) || {};

	return (
		<Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="xs">
			<div style={{ padding: "20px 24px 0" }}>
				<Typography variant="h4">Perfil</Typography>
				<Typography variant="subtitle1">
					Visualize e edite suas informações
				</Typography>
			</div>
			<DialogContent>
				<InfoItem
					icon={PersonRounded}
					label="Nome de Usuário"
					value={user?.username || "-"}
				/>
				<InfoItem
					icon={EmailRounded}
					label="Email"
					value={user?.email || "-"}
				/>
				<InfoItem icon={WorkRounded} label="Cargo" value={user?.role || "-"} />
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Fechar</Button>
			</DialogActions>
		</Dialog>
	);
}

export default ProfileModal;
