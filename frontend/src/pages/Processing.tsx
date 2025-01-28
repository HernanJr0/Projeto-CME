import { useContext, useEffect, useState } from "react";
import { Typography, Box, Button, CircularProgress, Card } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { AddOutlined, ClearRounded, EditRounded } from "@mui/icons-material";
import { Process } from "../types";
import { AuthContext } from "../context/AuthContext";
import {
	createProcess,
	deleteProcess,
	getProcess,
	getProcesses,
	updateProcess,
} from "../services/processing";
import ProcessingModal from "../components/ProcessingModal";

export default function Processing() {
	const [open, setOpen] = useState(false);
	const [processes, setProcesses] = useState<Process[]>([]);
	const [loading, setLoading] = useState(true);
	const [editProcess, setEditProcess] = useState<Process | null>(null);

	const auth = useContext(AuthContext);

	useEffect(() => {
		const loadProcesses = async () => {
			setLoading(true);
			try {
				const data = await getProcesses();

				const sortedData = data.sort((a: Process, b: Process) => {
					return (
						new Date(b.start_date || "").getTime() -
						new Date(a.start_date || "").getTime()
					);
				});

				setProcesses(sortedData);
			} catch (error) {
				console.error("Erro ao buscar materiais", error);
			} finally {
				setLoading(false);
			}
		};
		loadProcesses();
	}, []);

	async function handleCreateEdit(id: number) {
		if (id === 0) {
			setEditProcess(null);
			setOpen(true);
		} else {
			try {
				const process = await getProcess(id);
				setEditProcess(process);
				setOpen(true);
			} catch (error) {
				console.error("Erro ao buscar processo", error);
			}
		}
	}

	async function handleDelete(id: number) {
		try {
			await deleteProcess(id);
			alert("Processo excluído com sucesso!");
			const updatedProcesses = await getProcesses();
			setProcesses(updatedProcesses);
		} catch (error) {
			console.error("Erro ao excluir processo", error);
			alert("Erro ao excluir processo!");
		}
	}

	const handleSave = async (
		material: number | null,
		step: string,
		responsible: number | null,
		quantity: number | null
	) => {
		if (editProcess) {
			try {
				const updatedProcess: Process = {
					...editProcess,
					material: material,
					step: step,
					quantity: quantity || 1,
				};
				await updateProcess(updatedProcess);
				setOpen(false);
				const updatedProcesses = await getProcesses();
				setProcesses(updatedProcesses);
			} catch (error) {
				console.error("Erro ao atualizar processo", error);
				alert("Erro ao atualizar processo!");
			}
		} else {
			try {
				const newProcess: Process = {
					material: material,
					step: step,
					responsible: responsible,
					quantity: quantity || 1,
				};

				await createProcess(newProcess);
				setOpen(false);
				const updatedProcesses = await getProcesses();
				setProcesses(updatedProcesses);
				alert("Processo criado com sucesso!");
			} catch (error) {
				console.error("Erro ao criar processo", error);
				alert("Erro ao criar processo!");
			}
		}
	};

	const columns: GridColDef[] = [
		{
			field: "quantity",
			headerName: "Quantidade",
			width: 100,
			renderCell: (params: GridRenderCellParams) => (
				<>{params.row.quantity}</>
			),
		},
		{
			field: "serial",
			headerName: "Serial",
			width: 220,
			renderCell: (params: GridRenderCellParams) => (
				<>{params.row.material_details.serial}</>
			),
		},
		{
			field: "material",
			headerName: "Material",
			width: 160,
			renderCell: (params: GridRenderCellParams) => (
				<>{params.row.material_details.name}</>
			),
		},
		{
			field: "step",
			headerName: "Etapa",
			width: 120,
			renderCell: (params: GridRenderCellParams) => (
				<>
					{params.row.step.charAt(0).toUpperCase() + params.row.step.slice(1)}
				</>
			),
		},
		{
			field: "start_date",
			headerName: "Data de Início",
			width: 150,
			renderCell: (params: GridRenderCellParams) =>
				new Date(params.value).toLocaleDateString(),
		},
		{
			field: "end_date",
			headerName: "Data de Fim",
			width: 150,
			renderCell: (params: GridRenderCellParams) => {
				return (
					<>
						{params.row.end_date === null
							? "-"
							: new Date(params.row.end_date).toLocaleDateString()}
					</>
				);
			},
		},
		{
			field: "responsible",
			headerName: "Responsável",
			width: 150,
			renderCell: (params: GridRenderCellParams) => (
				<>{params.row.responsible_details.username}</>
			),
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
					>
						<EditRounded sx={{ marginRight: 1 }} />
						Editar
					</Button>
					<Button
						variant="outlined"
						color="error"
						onClick={() => handleDelete(params.row.id)}
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
						Processos
					</Typography>
					<Typography variant="subtitle1" gutterBottom>
						Lista de processos cadastrados
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
							Iniciar Processo
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
						rows={processes}
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

			<ProcessingModal
				open={open}
				onClose={() => {
					setOpen(false);
					setEditProcess(null);
				}}
				onSave={handleSave}
				initialData={
					editProcess
						? {
								id: editProcess.id,
								material: editProcess.material,
								step: editProcess.step,
								start_date: editProcess.start_date,
								end_date: editProcess.end_date,
								responsible: editProcess.responsible,
								quantity: editProcess.quantity,
						  }
						: undefined
				}
			/>
		</div>
	);
}
