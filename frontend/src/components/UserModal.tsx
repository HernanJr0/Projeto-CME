import { useState, useEffect } from "react";
import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	TextField,
	Button,
	MenuItem,
	Select,
	FormControl,
	InputLabel,
} from "@mui/material";

interface UserModalProps {
	open: boolean;
	onClose: () => void;
	onSave: (
		username: string,
		email: string,
		role: string,
		password?: string
	) => void;
	initialData?: { username: string; email: string; role: string };
}

interface ValidationErrors {
	username?: string;
	email?: string;
	password?: string;
}

export default function UserModal({
	open,
	onClose,
	onSave,
	initialData,
}: UserModalProps) {
	const [username, setUsername] = useState(initialData?.username || "");
	const [email, setEmail] = useState(initialData?.email || "");
	const [role, setRole] = useState(initialData?.role || "");
	const [password, setPassword] = useState("");
	const [errors, setErrors] = useState<ValidationErrors>({});

	useEffect(() => {
		if (open) {
			setUsername(initialData?.username || "");
			setEmail(initialData?.email || "");
			setRole(initialData?.role || "");
			setPassword("");
		}
	}, [open, initialData]);

	const validateFields = () => {
		const newErrors: ValidationErrors = {};
		if (!username.trim()) newErrors.username = "Nome de usuário é obrigatório.";
		if (!email.match(/^\S+@\S+\.\S+$/)) newErrors.email = "Email inválido.";
		if (!initialData && !password) newErrors.password = "Senha é obrigatória.";

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSave = () => {
		if (validateFields()) {
			onSave(username, email, role, !initialData ? password : undefined);
			onClose();
		}
	};

	return (
		<Dialog open={open} onClose={onClose}>
			<DialogTitle>
				{initialData ? "Editar Usuário" : "Adicionar Usuário"}
			</DialogTitle>
			<DialogContent>
				<TextField
					autoFocus
					margin="dense"
					label="Nome de Usuário"
					type="text"
					fullWidth
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					error={!!errors.username}
					helperText={errors.username}
				/>
				<TextField
					margin="dense"
					label="Email"
					type="email"
					fullWidth
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					error={!!errors.email}
					helperText={errors.email}
				/>
				<FormControl fullWidth margin="dense">
					<InputLabel>Cargo</InputLabel>
					<Select
						value={role}
						onChange={(e) => setRole(e.target.value)}
						label="Cargo"
					>
						<MenuItem value="tecnico">Técnico</MenuItem>
						<MenuItem value="enfermeiro">Enfermeiro</MenuItem>
						<MenuItem value="administrativo">Administrativo</MenuItem>
					</Select>
				</FormControl>
				{!initialData && (
					<TextField
						margin="dense"
						label="Senha"
						type="password"
						fullWidth
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						error={!!errors.password}
						helperText={errors.password}
					/>
				)}
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose} color="primary">
					Cancelar
				</Button>
				<Button onClick={handleSave} color="primary">
					Salvar
				</Button>
			</DialogActions>
		</Dialog>
	);
}
