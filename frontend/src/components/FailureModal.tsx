import { useContext, useEffect, useState } from "react";
import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	TextField,
	Button,
	MenuItem,
	Switch,
	FormControlLabel,
} from "@mui/material";
import { Material } from "../types";
import { getMaterials } from "../services/materials";
import { AuthContext } from "../context/AuthContext";

interface FailureModalProps {
	open: boolean;
	onSave: (
		material: number,
		step: string,
		description: string,
		responsible: number,
		restartProcess: boolean
	) => void;
	onClose: () => void;
}

interface ValidationErrors {
	material?: string;
	step?: string;
	description?: string;
}

export default function FailureModal({
	open,
	onClose,
	onSave,
}: FailureModalProps) {
	const [errors, setErrors] = useState<ValidationErrors>({});
	const [material, setMaterial] = useState(0);
	const [step, setStep] = useState("");
	const [description, setDescription] = useState("");
	const [responsible, setResponsible] = useState(0);
	const [restartProcess, setRestartProcess] = useState(false);

	const [materials, setMaterials] = useState<Material[]>([]);

	const auth = useContext(AuthContext);

	useEffect(() => {
		const loadMaterials = async () => {
			try {
				const data = await getMaterials();
				setMaterials(data);
			} catch (error) {
				console.error("Erro ao buscar materiais", error);
			}
		};
		loadMaterials();
	}, []);

	useEffect(() => {
		if (open) {
			setMaterial(0);
			setStep("");
			setDescription("");
			setResponsible(auth?.user?.id || 0);
		}
	}, [open]);

	function validateFields() {
		const newErrors: ValidationErrors = {};
		if (!material) newErrors.material = "Material é obrigatório.";
		if (!step) newErrors.step = "Etapa é obrigatória.";
		if (!description) newErrors.description = "Descrição é obrigatória.";

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	}

	function handleSave() {
		if (validateFields()) {
			onSave(material, step, description, responsible, restartProcess);
			onClose();
		}
	}

	return (
		<Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
			<DialogTitle>Declarar Falha</DialogTitle>
			<DialogContent>
				<TextField
					margin="dense"
					id="material"
					label="Material"
					select
					fullWidth
					value={material}
					onChange={(e) => setMaterial(Number(e.target.value))}
					error={!!errors.material}
					helperText={errors.material}
				>
					<MenuItem value={0}>
						<em>Selecione um Material</em>
					</MenuItem>
					{materials.map((material) => (
						<MenuItem key={material.id} value={material.id}>
							{material.serial} - {material.name}
						</MenuItem>
					))}
				</TextField>
				<TextField
					margin="dense"
					id="step"
					label="Etapa"
					select
					fullWidth
					value={step}
					onChange={(e) => setStep(e.target.value)}
					error={!!errors.step}
					helperText={errors.step}
				>
					<MenuItem value="recebimento">Recebimento</MenuItem>
					<MenuItem value="lavagem">Lavagem</MenuItem>
					<MenuItem value="esterilizacao">Esterilização</MenuItem>
					<MenuItem value="distribuicao">Distribuição</MenuItem>
				</TextField>
				<TextField
					margin="dense"
					id="description"
					label="Descrição"
					multiline
					rows={4}
					fullWidth
					value={description}
					onChange={(e) => setDescription(e.target.value)}
				/>
				<FormControlLabel
					control={
						<Switch
							checked={restartProcess}
							onChange={(e) => setRestartProcess(e.target.checked)}
						/>
					}
					label="Reiniciar processo"
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose} color="primary" variant="outlined">
					Cancelar
				</Button>
				<Button color="primary" onClick={handleSave} variant="contained">
					Cadastrar
				</Button>
			</DialogActions>
		</Dialog>
	);
}
