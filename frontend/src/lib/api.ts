import axios, { HttpStatusCode } from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const instance = axios.create({
	baseURL,
	timeout: 30000,
});

const logout = async () => {
	await Promise.all([
		localStorage.removeItem("token"),
		localStorage.removeItem("isLoggedIn"),
		localStorage.removeItem("expirationDate"),
	]);
	return false;
};

instance.interceptors.request.use((config) => {
	const token = localStorage.getItem("token");
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

instance.interceptors.response.use(
	(response) => response,
	(error) => {
		const isLoginRoute = window.location.href.includes("/login");

		console.log({ "Error status code": error.response?.status });

		if (
			!isLoginRoute &&
			error.response?.status === HttpStatusCode.Unauthorized
		) {
			return logout().then(() => {
				window.location.href = `/login?redirect=${window.location.href}`;
			});
		}

		throw error;
	}
);
