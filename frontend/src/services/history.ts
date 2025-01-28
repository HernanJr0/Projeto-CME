import api from "../utils/api";

export const getHistory = async () => {
	try {
		const response = await api.get("/history/");
		return response.data;
	} catch (error) {
		console.error("Erro ao buscar materiais", error);
		throw error;
	}
};
