import { useContext, useEffect, useState } from "react";
import { Typography, Box, Button, CircularProgress, Card } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { AddOutlined, ClearRounded, EditRounded } from "@mui/icons-material";
import {
	createMaterial,
	deleteMaterial,
	getMaterial,
	getMaterials,
	updateMaterial,
} from "../services/materials";
import { Material } from "../types";
import MaterialModal from "../components/MaterialModal";
import { AuthContext } from "../context/AuthContext";

export default function Materials() {
	const [open, setOpen] = useState(false);
	const [materials, setMaterials] = useState<Material[]>([]);
	const [loading, setLoading] = useState(true);
	const [editMaterial, setEditMaterial] = useState<Material | null>(null);

	const auth = useContext(AuthContext);

	useEffect(() => {
		const loadMateriais = async () => {
			setLoading(true);
			try {
				const data = await getMaterials();
				setMaterials(data);
			} catch (error) {
				console.error("Erro ao buscar materiais", error);
			} finally {
				setLoading(false);
			}
		};
		loadMateriais();
	}, []);

	async function handleCreateEdit(id: number) {
		if (id === 0) {
			setEditMaterial(null);
			setOpen(true);
		} else {
			try {
				const material = await getMaterial(id);
				setEditMaterial(material);
				setOpen(true);
			} catch (error) {
				console.error("Erro ao buscar material", error);
			}
		}
	}

	async function handleDelete(id: number) {
		try {
			await deleteMaterial(id);
			alert("Material excluído com sucesso!");
			const updatedMaterials = await getMaterials();
			setMaterials(updatedMaterials);
		} catch (error) {
			console.error("Erro ao excluir material", error);
			alert("Erro ao excluir material!");
		}
	}

	const handleSave = async (
		name: string,
		materialType: string,
		expirationDate: string
	) => {
		if (editMaterial) {
			try {
				const updatedMaterial: Material = {
					...editMaterial,
					name: name,
					material_type: materialType,
					expiration_date: expirationDate,
				};
				await updateMaterial(updatedMaterial);
				setOpen(false);
				const updatedMaterials = await getMaterials();
				setMaterials(updatedMaterials);
			} catch (error) {
				console.error("Erro ao atualizar material", error);
				alert("Erro ao atualizar material!");
			}
		} else {
			try {
				const newMaterial: Material = {
					name: name,
					material_type: materialType,
					expiration_date: expirationDate,
				};

				await createMaterial(newMaterial);
				setOpen(false);
				const updatedMaterials = await getMaterials();
				setMaterials(updatedMaterials);
				alert("Material cadastrado com sucesso!");
			} catch (error) {
				console.error("Erro ao cadastrar material", error);
				alert("Erro ao cadastrar material!");
			}
		}
	};

	const columns: GridColDef[] = [
		{ field: "id", headerName: "ID", width: 70 },
		{ field: "serial", headerName: "Serial", width: 230 },
		{ field: "name", headerName: "Nome", width: 200 },
		{ field: "material_type", headerName: "Tipo", width: 200 },
		{
			field: "created_at",
			headerName: "Data do Cadastro",
			width: 200,
			renderCell: (params: GridRenderCellParams) =>
				new Date(params.value).toLocaleString(),
		},
		{
			field: "expiration_date",
			headerName: "Data de Validade",
			width: 150,
			renderCell: (params: GridRenderCellParams) =>
				new Date(params.value).toLocaleDateString(),
		},
		{
			field: "actions",
			headerName: "Ações",
			width: 250,
			renderCell: (params: GridRenderCellParams) => (
				<Box
					sx={{
						height: "100%",
						display: "flex",
						alignItems: "center",
					}}
				>
					<Button
						variant="outlined"
						color="primary"
						sx={{ marginRight: 1 }}
						onClick={() => handleCreateEdit(params.row.id)}
						disabled={auth?.user?.role !== "administrativo"}
					>
						<EditRounded sx={{ marginRight: 1 }} />
						Editar
					</Button>
					<Button
						variant="outlined"
						color="error"
						onClick={() => handleDelete(params.row.id)}
						disabled={auth?.user?.role !== "administrativo"}
					>
						<ClearRounded sx={{ marginRight: 1 }} />
						Excluir
					</Button>
				</Box>
			),
		},
	];

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				height: "100%",
				width: "100%",
			}}
		>
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					marginBottom: 2,
				}}
			>
				<Box>
					<Typography variant="h4" gutterBottom>
						Materiais
					</Typography>
					<Typography variant="subtitle1" gutterBottom>
						Lista de materiais cadastrados
					</Typography>
				</Box>
				<Box>
					{auth?.user?.role === "administrativo" && (
						<Button
							variant="contained"
							color="primary"
							onClick={() => setOpen(true)}
						>
							<AddOutlined sx={{ marginRight: 1 }} />
							Cadastrar Material
						</Button>
					)}
				</Box>
			</Box>

			{!loading ? (
				<Card
					sx={{
						height: "calc(100vh - 20rem)",
						width: "calc(100vw - 35rem)",
						display: "flex",
					}}
				>
					<DataGrid
						rows={materials}
						columns={columns}
						initialState={{
							pagination: {
								paginationModel: {
									pageSize: 10,
									page: 0,
								},
							},
						}}
						pageSizeOptions={[5, 10, 20]}
						rowSelection={false}
						disableRowSelectionOnClick
						sx={{
							borderRadius: "7px",
							"& .MuiDataGrid-cell:focus": {
								outline: "none",
							},
						}}
					/>
				</Card>
			) : (
				<CircularProgress sx={{ alignSelf: "center" }} />
			)}

			<MaterialModal
				open={open}
				onClose={() => {
					setOpen(false);
					setEditMaterial(null);
				}}
				onSave={handleSave}
				initialData={
					editMaterial
						? {
								id: editMaterial.id,
								name: editMaterial.name,
								material_type: editMaterial.material_type,
								expiration_date: editMaterial.expiration_date,
								created_at: editMaterial.created_at,
								serial: editMaterial.serial,
						  }
						: undefined
				}
			/>
		</div>
	);
}
