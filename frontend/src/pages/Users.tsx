import { useContext, useEffect, useState } from "react";
import { deleteUser, getUsers, getUser, updateUser } from "../services/user";
import { Typography, Box, Button, CircularProgress, Card } from "@mui/material";
import { AuthContext } from "../context/AuthContext";
import UserModal from "../components/UserModal";
import { DataGrid } from "@mui/x-data-grid";
import { AddRounded, ClearRounded, EditRounded } from "@mui/icons-material";
import { User } from "../types";

export default function Users() {
	const [users, setUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState(true);
	const [open, setOpen] = useState(false);
	const [editUser, setEditUser] = useState<User | null>(null);

	const auth = useContext(AuthContext);

	useEffect(() => {
		const fetchUsers = async () => {
			setLoading(true);
			try {
				const users = await getUsers();
				setUsers(users);
			} catch (error) {
				console.error("Erro ao listar usuários", error);
			} finally {
				setLoading(false);
			}
		};
		fetchUsers();
	}, []);

	const handleCreateEdit = async (id: number) => {
		if (id === 0) {
			setEditUser(null);
			setOpen(true);
		} else {
			try {
				const user = await getUser(id);
				setEditUser(user);
				setOpen(true);
			} catch (error) {
				console.error("Erro ao buscar usuário", error);
			}
		}
	};

	const handleSave = async (
		username: string,
		email: string,
		role: string,
		password?: string
	) => {
		if (editUser) {
			await updateUser(editUser.id, username, email, role);
			setUsers(
				users.map((user) =>
					user.id === editUser.id ? { ...user, username, email, role } : user
				)
			);
		} else {
			if (password) {
				await auth?.register({ username, password, email, role });
				try {
					const updatedUsers = await getUsers();
					setUsers(updatedUsers);
				} catch (error) {
					console.error("Erro ao atualizar a lista de usuários", error);
				}
			} else {
				console.error("Password is required for new user");
			}
		}
		setOpen(false);
	};

	async function handleDelete(id: number) {
		try {
			await deleteUser(id);
			alert("Usuário excluído com sucesso");
			setUsers(users.filter((user) => user.id !== id));
		} catch (error) {
			console.error("Erro ao excluir usuário", error);
			alert("Erro ao excluir usuário");
		}
	}

	const columns = [
		{ field: "id", headerName: "ID", width: 100 },
		{ field: "username", headerName: "Nome de Usuário", width: 250 },
		{ field: "email", headerName: "Email", width: 250 },
		{
			field: "role",
			headerName: "Cargo",
			width: 170,
			renderCell: (params: { row: User }) => {
				return (
					params.row.role.charAt(0).toUpperCase() + params.row.role.slice(1)
				);
			},
		},
		{
			field: "is_active",
			headerName: "Ativo",
			width: 100,
			renderCell: (params: { row: User }) =>
				params.row.is_active ? "Sim" : "Não",
		},
		{
			field: "actions",
			headerName: "Ações",
			width: 250,
			renderCell: (params: { row: User }) => (
				<Box>
					<Button
						variant="outlined"
						color="primary"
						onClick={() => handleCreateEdit(params.row.id)}
						sx={{ marginRight: 1 }}
					>
						<EditRounded sx={{ marginRight: 1 }} />
						Editar
					</Button>
					{auth?.user?.id &&
						params.row?.id &&
						auth.user.id !== params.row.id && (
							<Button
								variant="outlined"
								color="error"
								onClick={() => handleDelete(params.row.id)}
							>
								<ClearRounded sx={{ marginRight: 1 }} />
								Excluir
							</Button>
						)}
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
						Gerenciamento de Usuários
					</Typography>
					<Typography variant="subtitle1" gutterBottom>
						Cadastre, edite e exclua usuários
					</Typography>
				</Box>
				<Box>
					<Button
						variant="contained"
						color="primary"
						onClick={() => handleCreateEdit(0)}
					>
						<AddRounded sx={{ marginRight: 1 }} />
						Adicionar Usuário
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
						rows={users}
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

			<UserModal
				open={open}
				onClose={() => setOpen(false)}
				onSave={handleSave}
				initialData={
					editUser
						? {
								username: editUser.username,
								email: editUser.email,
								role: editUser.role,
						  }
						: undefined
				}
			/>
		</div>
	);
}
