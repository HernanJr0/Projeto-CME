import { Process } from "../types";
import api from "../utils/api";

export const getProcesses = async (): Promise<Process[]> => {
	try {
		const response = await api.get(`processes`);
		return response.data;
	} catch (error) {
		console.error("Erro ao buscar processos:", error);
		throw error;
	}
};

export const postProcesses = async (
	serial: string,
	processo: Process
): Promise<Process> => {
	try {
		const response = await api.post(`processes/${serial}`, processo);
		return response.data;
	} catch (error) {
		console.error("Erro ao registrar processo:", error);
		throw error;
	}
};
