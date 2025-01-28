export interface User {
	id: number;
	username: string;
	email: string;
	role: string;
	is_active: boolean;
}

export interface Material {
	id?: number;
	name: string;
	material_type: string;
	expiration_date: string;
	serial?: string;
	created_at?: string;
	actions?: JSX.Element;
}

export interface Process {
	id?: number;
	material?: number | null;
	step: string;
	start_date?: string;
	end_date?: string | null;
	responsible?: number | null;
	quantity?: number;
}

export interface Failure {
	id?: number;
	material: number;
	step: string;
	description: string;
	failure_date?: string;
	responsible?: number | null;
}

export interface Tracking {
	material: Material;
	processes: Process;
	failures: Failure[];
}

export interface History {
	id: number;
	material_serial: string;
	passage_count: number;
	step: string;
	action: string;
	date: string;
	user_details: {
		id: number;
		username: string;
	};
}
