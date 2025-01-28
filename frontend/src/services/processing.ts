import { Process } from "../types";
import api from "../utils/api";

export const getProcesses = async (): Promise<Process[]> => {
	try {
		const response = await api.get("/processes/");
		return response.data;
	} catch (error) {
		console.error("Erro ao buscar processos", error);
		throw error;
	}
};

export const getProcess = async (id: number): Promise<Process> => {
	try {
		const response = await api.get(`/processes/${id}`);
		return response.data;
	} catch (error) {
		console.error("Erro ao buscar processo", error);
		throw error;
	}
};

export const createProcess = async (process: Process): Promise<void> => {
	try {
		await api.post("/processes/", process);
	} catch (error) {
		console.error("Erro ao criar processo", error);
		throw error;
	}
};

export const updateProcess = async (process: Process): Promise<void> => {
	try {
		await api.patch(`/processes/${process.id}/`, process);
	} catch (error) {
		console.error("Erro ao atualizar processo", error);
		throw error;
	}
};

export const deleteProcess = async (id: number): Promise<void> => {
	try {
		await api.delete(`/processes/${id}`);
	} catch (error) {
		console.error("Erro ao excluir processo", error);
		throw error;
	}
};
