import { Failure } from "../types";
import api from "../utils/api";

export const getFailure = async (serial: string): Promise<Failure[]> => {
	try {
		const response = await api.get(`failures/${serial}`);
		return response.data;
	} catch (error) {
		console.error("Erro ao buscar falhas:", error);
		throw error;
	}
};

export const postFailure = async (falha: Failure): Promise<Failure> => {
	try {
		const response = await api.post(`failures/`, falha);
		return response.data;
	} catch (error) {
		console.error("Erro ao registrar falha:", error);
		throw error;
	}
};
