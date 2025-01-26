import { Material } from "../types";
import api from "../utils/api";

export const getMaterials = async (): Promise<Material[]> => {
	try {
		const response = await api.get("materials/");
		return response.data;
	} catch (error) {
		console.error("Erro ao buscar materiais:", error);
		throw error;
	}
};

export const postMaterials = async (
	material: Material
): Promise<Material> => {
	try {
		const response = await api.post("materials/", material);
		return response.data;
	} catch (error) {
		console.error("Erro ao cadastrar material:", error);
		throw error;
	}
};
