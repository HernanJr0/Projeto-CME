import { Box, Button, TextField, Typography } from "@mui/material";
import React, { useState, ChangeEvent, FormEvent } from "react";

interface AuthFormProps {
	onSubmit: (formData: {
		username: string;
		email?: string;
		password: string;
	}) => void;
	buttonText: string;
	includeEmail?: boolean;
}

const AuthForm: React.FC<AuthFormProps> = ({
	onSubmit,
	buttonText,
	includeEmail = false,
}) => {
	/* const navigate = useNavigate(); */

	const [formData, setFormData] = useState({
		username: "",
		email: "",
		password: "",
	});

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		const dataToSubmit = includeEmail
			? formData
			: { username: formData.username, password: formData.password };
		onSubmit(dataToSubmit);
	};

	return (
		<form onSubmit={handleSubmit}>
			<Typography variant="subtitle2" fontWeight={600}>
				Nome de Usuário
			</Typography>
			<TextField
				fullWidth
				type="text"
				name="username"
				value={formData.username}
				onChange={handleChange}
				required
				sx={{ marginBottom: 2 }}
			/>
			{includeEmail && (
				<>
					<Typography variant="subtitle2" fontWeight={600}>
						Email
					</Typography>
					<TextField
						fullWidth
						type="email"
						name="email"
						value={formData.email}
						onChange={handleChange}
						required
						sx={{ marginBottom: 2 }}
					/>
				</>
			)}
			<Typography variant="subtitle2" fontWeight={600}>
				Senha
			</Typography>
			<TextField
				fullWidth
				type="password"
				name="password"
				value={formData.password}
				onChange={handleChange}
				required
			/>
			<Button
				type="submit"
				variant="contained"
				sx={{
					marginTop: 2,
					marginBottom: 2,
					width: "100%",
					padding: "0.5rem 2rem",
				}}
			>
				{buttonText}
			</Button>
			<Box
				sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
			></Box>
		</form>
	);
};

export default AuthForm;
