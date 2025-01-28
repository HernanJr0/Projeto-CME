import { Typography, Box, Button, Card, CircularProgress } from "@mui/material";
import { gerarRelatorioPDF, gerarRelatorioXLSX } from "../services/reports";
import { useEffect, useState } from "react";
import { PictureAsPdf, TableChartRounded } from "@mui/icons-material";
import { getHistory } from "../services/history";
import { History } from "../types";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";

export default function Reports() {
	const [history, setHistory] = useState<History[]>([]);
	const [loading, setLoading] = useState(true);

	async function getMateriais() {
		setLoading(true);
		try {
			const response = await getHistory();
			const data = response;

			const sortedData = data.sort((a: History, b: History) => {
				return new Date(b.date).getTime() - new Date(a.date).getTime();
			});

			setHistory(sortedData);
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		getMateriais();
	}, []);

	const columns: GridColDef[] = [
		{
			field: "id",
			headerName: "ID",
			width: 70,
			renderCell: (params: GridRenderCellParams) => <>{params.row.id}</>,
		},
		{
			field: "material_serial",
			headerName: "Serial do Material",
			width: 250,
			renderCell: (params: GridRenderCellParams) => {
				console.log(params.row);
				return <>{params.row.material_serial}</>;
			},
		},
		{
			field: "action",
			headerName: "Ação",
			width: 300,
			renderCell: (params: GridRenderCellParams) => <>{params.row.action}</>,
		},
		{
			field: "date",
			headerName: "Data e Hora",
			width: 200,
			renderCell: (params: GridRenderCellParams) => (
				<>{new Date(params.row.date).toLocaleString()}</>
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
						Relatórios e Histórico
					</Typography>
					<Typography variant="subtitle1" gutterBottom>
						Visualize e gere relatórios de histórico de materiais
					</Typography>
				</Box>

				<Box>
					<Button
						variant="contained"
						color="primary"
						onClick={gerarRelatorioPDF}
						sx={{
							marginRight: 2,
						}}
					>
						<PictureAsPdf sx={{ marginRight: 1 }} />
						Gerar Relatório PDF
					</Button>
					<Button
						variant="contained"
						color="primary"
						onClick={gerarRelatorioXLSX}
					>
						<TableChartRounded sx={{ marginRight: 1 }} />
						Gerar Relatório XLSX
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
						rows={history}
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
