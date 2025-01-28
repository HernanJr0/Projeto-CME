import { useEffect, useState } from "react";
import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	TextField,
	Button,
	MenuItem,
	InputLabel,
} from "@mui/material";
import { Material } from "../types";

interface MaterialModalProps {
	open: boolean;
	initialData?: Material;
	onSave: (name: string, materialType: string, expirationDate: string) => void;
	onClose: () => void;
}

interface ValidationErrors {
	name?: string;
	materialType?: string;
	expirationDate?: string;
}

export default function MaterialModal({
	open,
	initialData,
	onClose,
	onSave,
}: MaterialModalProps) {
	const [name, setName] = useState(initialData?.name || "");
	const [materialType, setMaterialType] = useState(
		initialData?.material_type || ""
	);
	const [expirationDate, setExpirationDate] = useState(
		initialData?.expiration_date || ""
	);
	const [errors, setErrors] = useState<ValidationErrors>({});

	useEffect(() => {
		if (open) {
			setName(initialData?.name || "");
			setMaterialType(initialData?.material_type || "");
			setExpirationDate(initialData?.expiration_date || "");
		}
	}, [open, initialData]);

	function validateFields() {
		const newErrors: ValidationErrors = {};
		if (!name.trim()) newErrors.name = "Nome é obrigatório.";
		if (!materialType) newErrors.materialType = "Tipo é obrigatório.";
		if (!expirationDate)
			newErrors.expirationDate = "Data de validade é obrigatória.";

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	}

	function handleSave() {
		if (validateFields()) {
			onSave(name, materialType, expirationDate);
			onClose();
		}
	}

	return (
		<Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
			<DialogTitle>
				{initialData ? "Editar Material" : "Novo Material"}
			</DialogTitle>
			<DialogContent>
				<TextField
					autoFocus
					margin="dense"
					id="name"
					label="Nome"
					type="text"
					fullWidth
					value={name}
					onChange={(e) => setName(e.target.value)}
					error={!!errors.name}
					helperText={errors.name}
				/>
				<TextField
					margin="dense"
					id="material-type"
					label="Tipo"
					select
					fullWidth
					value={materialType}
					onChange={(e) => setMaterialType(e.target.value)}
					error={!!errors.materialType}
					helperText={errors.materialType}
				>
					<MenuItem value="">
						<em>Selecione um Tipo</em>
					</MenuItem>
					<MenuItem value="EPI">EPI</MenuItem>
					<MenuItem value="Equipamento Médico">Equipamento Médico</MenuItem>
					<MenuItem value="Material Cirúrgico">Material Cirúrgico</MenuItem>
					<MenuItem value="Material de Diagnóstico">
						Material de Diagnóstico
					</MenuItem>
					<MenuItem value="Instrumento Cirúrgico">
						Instrumento Cirúrgico
					</MenuItem>
					<MenuItem value="Instrumento Odontológico">
						Instrumento Odontológico
					</MenuItem>
					<MenuItem value="Instrumento Oftalmológico">
						Instrumento Oftalmológico
					</MenuItem>
					<MenuItem value="Outro">Outro</MenuItem>
				</TextField>
				<InputLabel id="expiration-date">Data de Validade</InputLabel>
				<TextField
					margin="dense"
					id="expiration-date"
					type="date"
					fullWidth
					value={expirationDate}
					onChange={(e) => setExpirationDate(e.target.value)}
					error={!!errors.expirationDate}
					helperText={errors.expirationDate}
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose} color="primary">
					Cancelar
				</Button>
				<Button color="primary" onClick={handleSave}>
					Cadastrar
				</Button>
			</DialogActions>
		</Dialog>
	);
}
