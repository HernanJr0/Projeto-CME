import { useContext, useEffect, useState } from "react";
import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	TextField,
	Button,
	MenuItem,
	Box,
} from "@mui/material";
import { Material, Process } from "../types";
import { getMaterials } from "../services/materials";
import { AuthContext } from "../context/AuthContext";
import { ErrorOutline, Send } from "@mui/icons-material";

interface ProcessingModalProps {
	open: boolean;
	initialData?: Process;
	onSave: (
		material: number | null,
		step: string,
		responsible: number | null,
		quantity: number | null
	) => void;
	onClose: () => void;
}

interface ValidationErrors {
	material?: string;
	step?: string;
	responsible?: string;
	quantity?: string;
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
	const [quantity, setQuantity] = useState(initialData?.quantity || 1);

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
			setStep(initialData?.step || "recebimento");
			setResponsible(initialData?.responsible || auth?.user?.id || 0);
			setQuantity(initialData?.quantity || 1);
		}
	}, [open, initialData]);

	function validateFields() {
		const newErrors: ValidationErrors = {};
		if (!material) newErrors.material = "Material é obrigatório.";
		if (!step) newErrors.step = "Etapa é obrigatória.";
		if (!quantity) newErrors.quantity = "Quantidade é obrigatória.";

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	}

	function handleSave() {
		if (validateFields()) {
			onSave(material, step, responsible, quantity);
			onClose();
		}
	}

	return (
		<Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
			<DialogTitle>
				{initialData ? "Editar Processo" : "Solicitar Recebimento"}
			</DialogTitle>
			<DialogContent>
				{initialData && (
					<Box mb={2} display="flex" gap={1}>
						<Button variant="outlined" color="error">
							<ErrorOutline
								sx={{
									mr: 1,
								}}
							/>
							Declarar Falha
						</Button>
						<Button variant="contained" color="primary">
							<Send
								sx={{
									mr: 1,
								}}
							/>
							Encaminhar para a próxima etapa
						</Button>
					</Box>
				)}
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
				{initialData && (
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
				)}
				<TextField
					margin="dense"
					id="quantity"
					label="Quantidade"
					type="number"
					slotProps={{
						htmlInput: {
							min: 1,
						},
					}}
					fullWidth
					value={quantity}
					onChange={(e) => setQuantity(Number(e.target.value))}
					error={!!errors.quantity}
					helperText={errors.quantity}
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose} color="primary" variant="outlined">
					Cancelar
				</Button>
				<Button color="primary" onClick={handleSave} variant="contained">
					{initialData ? "Salvar alterações" : "Solicitar Recebimento"}
				</Button>
			</DialogActions>
		</Dialog>
	);
}
