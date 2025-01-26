import { Processo } from "../types";
import api from "../utils/api";

export const getProcesses = async (serial: string): Promise<Processo[]> => {
	try {
		const response = await api.get(`processes/${serial}`);
		return response.data;
	} catch (error) {
		console.error("Erro ao buscar processos:", error);
		throw error;
	}
};

export const postProcesses = async (
	serial: string,
	processo: Processo
): Promise<Processo> => {
	try {
		const response = await api.post(`processes/${serial}`, processo);
		return response.data;
	} catch (error) {
		console.error("Erro ao registrar processo:", error);
		throw error;
	}
};
