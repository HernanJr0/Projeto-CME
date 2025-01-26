import api from "../utils/api";

export const gerarRelatorioPDF = async (): Promise<void> => {
	try {
		const response = await api.get("relatorios/pdf/", {
			responseType: "blob",
		});
		const file = new Blob([response.data], { type: "application/pdf" });
		const fileURL = URL.createObjectURL(file);
		const link = document.createElement("a");
		link.href = fileURL;
		link.download = "relatorio_materiais.pdf";
		link.click();
	} catch (error) {
		console.error("Erro ao gerar relatório PDF:", error);
	}
};

export const gerarRelatorioXLSX = async (): Promise<void> => {
	try {
		const response = await api.get("relatorios/xlsx/", {
			responseType: "blob",
		});
		const file = new Blob([response.data], {
			type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
		});
		const fileURL = URL.createObjectURL(file);
		const link = document.createElement("a");
		link.href = fileURL;
		link.download = "relatorio_materiais.xlsx";
		link.click();
	} catch (error) {
		console.error("Erro ao gerar relatório XLSX:", error);
	}
};
