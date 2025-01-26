import { useEffect, useState } from "react";
import { Typography, Box, Button, CircularProgress, Card } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { AddOutlined, ClearOutlined, EditOutlined } from "@mui/icons-material";
import { getMaterials } from "../services/materials";
import { Material } from "../types";

export default function Materials() {
	const [materials, setMaterials] = useState<Material[]>([]);
	const [loading, setLoading] = useState(true);

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

	/* async function handleDelete(id: number) {
		try {
			await deleteUser(id);
			alert("Usuário excluído com sucesso");
			setUsers(users.filter((user) => user.id !== id));
		} catch (error) {
			console.error("Erro ao excluir usuário", error);
			alert("Erro ao excluir usuário");
		}
	} */

	const columns = [
		{ field: "id", headerName: "ID", width: 70 },
		{ field: "name", headerName: "Nome", width: 400 },
		{ field: "material_type", headerName: "Tipo", width: 250 },
		{ field: "expiration_date", headerName: "Data de Validade", width: 200 },
		{
			field: "actions",
			headerName: "Ações",
			width: 250,
			renderCell: () => (
				<Box>
					<Button variant="outlined" color="primary" sx={{ marginRight: 1 }}>
						<EditOutlined sx={{ marginRight: 1 }} />
						Editar
					</Button>
					<Button variant="outlined" color="error">
						<ClearOutlined sx={{ marginRight: 1 }} />
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
					<Button variant="contained" color="primary">
						<AddOutlined sx={{ marginRight: 1 }} />
						Cadastrar Material
					</Button>
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
									pageSize: 5,
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
		</div>
	);
}
