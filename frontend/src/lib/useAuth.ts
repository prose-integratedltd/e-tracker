import { useFetchAuthUser } from "@/hooks/queries/useFetchAuthUser";

import { useEffect, useState } from "react";

const logout = async () => {
	localStorage.clear();
	return false;
};

const getIsLoggedIn = (): boolean => {
	if (typeof window !== "undefined") {
		const token = getToken();
		return token != null;
	}
	return false;
};

const getToken = () => {
	if (typeof window !== "undefined") {
		const token = localStorage.getItem("token");
		return token ? token : null;
	}
	return null;
};

const useAuth = () => {
	const [isLoggedIn, setIsLoggedIn] = useState(getIsLoggedIn());
	const [token, setToken] = useState(getToken());
	const [mounted, setMounted] = useState(false);
	const [isAdmin, setIsAdmin] = useState(false);
	const { data: user } = useFetchAuthUser();

	useEffect(() => {
		setIsAdmin(user?.roles.includes("admin") ?? false);
	}, [user]);

	useEffect(() => {
		setMounted(true);

		const handleStorageChange = () => {
			setIsLoggedIn(getIsLoggedIn());
			setToken(getToken());
		};

		window.addEventListener("storage", handleStorageChange);

		return () => {
			window.removeEventListener("storage", handleStorageChange);
		};
	}, []);

	return { isLoggedIn, token, mounted, logout, isAdmin };
};

export default useAuth;
