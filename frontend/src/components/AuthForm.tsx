import React, { useState, ChangeEvent, FormEvent } from "react";

interface AuthFormProps {
	onSubmit: (formData: { username: string; password: string }) => void;
	buttonText: string;
}

const AuthForm: React.FC<AuthFormProps> = ({ onSubmit, buttonText }) => {
	const [formData, setFormData] = useState({ username: "", password: "" });

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		onSubmit(formData);
	};

	return (
		<form onSubmit={handleSubmit}>
			<input
				type="text"
				name="username"
				placeholder="Username"
				value={formData.username}
				onChange={handleChange}
			/>
			<input
				type="password"
				name="password"
				placeholder="Password"
				value={formData.password}
				onChange={handleChange}
			/>
			<button type="submit">{buttonText}</button>
		</form>
	);
};

export default AuthForm;
