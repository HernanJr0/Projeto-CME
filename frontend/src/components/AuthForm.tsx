import React, { useState, ChangeEvent, FormEvent } from "react";

interface AuthFormProps {
	onSubmit: (formData: { username: string; email?: string; password: string }) => void;
	buttonText: string;
	includeEmail?: boolean;
}

const AuthForm: React.FC<AuthFormProps> = ({ onSubmit, buttonText, includeEmail = false }) => {
	const [formData, setFormData] = useState({ username: "", email: "", password: "" });

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
			<input
				type="text"
				name="username"
				placeholder="Username"
				value={formData.username}
				onChange={handleChange}
				required
			/>
			{includeEmail && (
				<input
					type="email"
					name="email"
					placeholder="Email"
					value={formData.email}
					onChange={handleChange}
					required
				/>
			)}
			<input
				type="password"
				name="password"
				placeholder="Password"
				value={formData.password}
				onChange={handleChange}
				required
			/>
			<button type="submit">{buttonText}</button>
		</form>
	);
};

export default AuthForm;
