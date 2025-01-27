import { Material } from "../types";
import api from "../utils/api";

export const getMaterials = async (): Promise<Material[]> => {
	try {
		const response = await api.get("/materials/");
		return response.data;
	} catch (error) {
		console.error("Erro ao buscar materiais", error);
		throw error;
	}
};

export const getMaterial = async (id: number): Promise<Material> => {
	try {
		const response = await api.get(`/materials/${id}/`);
		return response.data;
	} catch (error) {
		console.error("Erro ao buscar material", error);
		throw error;
	}
};

export const createMaterial = async (material: any) => {
	try {
		const response = await api.post("/materials/", material);
		return response.data;
	} catch (error) {
		console.error("Erro ao criar material", error);
		throw error;
	}
};

export const updateMaterial = async (material: Material) => {
	try {
		const response = await api.patch(`/materials/${material.id}/`, material);
		return response.data;
	} catch (error) {
		console.error("Erro ao atualizar material", error);
		throw error;
	}
};

export const deleteMaterial = async (id: number) => {
	try {
		const response = await api.delete(`/materials/${id}/`);
		return response.data;
	} catch (error) {
		console.error("Erro ao excluir material", error);
		throw error;
	}
};
