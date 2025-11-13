"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

interface AppState {
	showMenu: boolean;
	setShowMenu: (value: boolean) => void;
	showNotification: boolean;
	setShowNotification: (value: boolean) => void;
	jobType: string;
	setJobType: (value: string) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
	const [showMenu, setShowMenu] = useState<boolean>(false);
	const [jobType, setJobType] = useState<string>("");

	const [showNotification, setShowNotification] = useState<boolean>(false);

	const queryClient = new QueryClient();

	return (
		<QueryClientProvider client={queryClient}>
			<AppContext.Provider
				value={{
					showMenu,
					setShowMenu,
					showNotification,
					setShowNotification,
					jobType,
					setJobType,
				}}
			>
				{children}
			</AppContext.Provider>
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	);
};

export const useAppContext = () => {
	const context = useContext(AppContext);
	if (!context) {
		throw new Error("useAppContext must be used within an AppProvider");
	}
	return context;
};
