import { useContext, useEffect, useState } from "react";
import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	TextField,
	Button,
	MenuItem,
} from "@mui/material";
import { Material, Process } from "../types";
import { getMaterials } from "../services/materials";
import { AuthContext } from "../context/AuthContext";

interface ProcessingModalProps {
	open: boolean;
	initialData?: Process;
	onSave: (
		material: number | null,
		step: string,
		responsible: number | null
	) => void;
	onClose: () => void;
}

interface ValidationErrors {
	material?: string;
	step?: string;
	responsible?: string;
}

export default function ProcessingModal({
	open,
	initialData,
	onClose,
	onSave,
}: ProcessingModalProps) {
	const [material, setMaterial] = useState(initialData?.material || 0);
	const [step, setStep] = useState(initialData?.step || "");
	const [errors, setErrors] = useState<ValidationErrors>({});
	const [responsible, setResponsible] = useState(initialData?.responsible || 0);

	const auth = useContext(AuthContext);

	const [materials, setMaterials] = useState<Material[]>([]);

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
			setMaterial(initialData?.material || 0);
			setStep(initialData?.step || "");
			setResponsible(initialData?.responsible || auth?.user?.id || 0);
		}
	}, [open, initialData]);

	function validateFields() {
		const newErrors: ValidationErrors = {};
		if (!material) newErrors.material = "Material é obrigatório.";
		if (!step) newErrors.step = "Etapa é obrigatória.";

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	}

	function handleSave() {
		if (validateFields()) {
			onSave(material, step, responsible);
			onClose();
		}
	}

	return (
		<Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
			<DialogTitle>
				{initialData ? "Editar Processo" : "Novo Processo"}
			</DialogTitle>
			<DialogContent>
				<TextField
					margin="dense"
					id="material"
					label="Material"
					select
					fullWidth
					value={material}
					disabled={!!initialData}
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
