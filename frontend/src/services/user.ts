import api from "../utils/api";

export const getUsers = async () => {
    try {
        const response = await api.get("/users");
        return response.data;
    } catch (error) {
        return error;
    }
}

export const getUser = async (id: number) => {
	try {
		const response = await api.get(`/users/${id}/`);
		return response.data;
	} catch (error) {
		return error;
	}
};

export const updateUser = async (
	id: number,
	username: string,
	email: string,
	role: string
) => {
	try {
		const response = await api.patch(`/users/${id}/`, {
			username,
			email,
			role,
		});
		return response.data;
	} catch (error) {
		return error;
	}
};

export const deleteUser = async (id: number) => {
    try {
        const response = await api.delete(`/users/${id}/`);
        return response.data;
    } catch (error) {
        return error;
    }
}
