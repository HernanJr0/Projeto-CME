import { Falha } from "../types";
import api from "../utils/api";

export const getFailure = async (serial: string): Promise<Falha[]> => {
	try {
		const response = await api.get(`failures/${serial}`);
		return response.data;
	} catch (error) {
		console.error("Erro ao buscar falhas:", error);
		throw error;
	}
};

export const postFailure = async (
	serial: string,
	falha: Falha
): Promise<Falha> => {
	try {
		const response = await api.post(`failures/${serial}`, falha);
		return response.data;
	} catch (error) {
		console.error("Erro ao registrar falha:", error);
		throw error;
	}
};
