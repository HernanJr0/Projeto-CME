export interface Material {
	id: number;
	name: string;
	material_type: string;
	expiration_date: string;
	serial: string;
}

export interface Processo {
	id: number;
	material: number;
	step: "Recebimento" | "Lavagem" | "Esterilização" | "Distribuição";
	start_date: string;
	end_date: string | null;
	responsible: string;
}

export interface Falha {
	id: number;
	material: number;
	step: string;
	description: string;
	failure_date: string;
}

export interface Rastreabilidade {
	material: Material;
	processes: Processo[];
	failures: Falha[];
}
