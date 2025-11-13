"use client";

import React from "react";
import Sidebar from "./Sidebar";
import { usePathname } from "next/navigation";

type MainProps = {
	children: React.ReactNode;
};

const Main: React.FC<MainProps> = ({ children }) => {
	const pathname = usePathname();

	return (
		<div
			className={`min-h-screen w-full flex ${
				pathname === "/notifications" ? "bg-white" : "bg-[#F0F0F0]"
			}`}
		>
			<div className="hidden sm:block fixed left-0 top-0 h-screen w-1/5 bg-white z-10">
				<Sidebar />
			</div>

			<div
				className={`w-full sm:ml-[20%] sm:w-4/5 min-h-screen relative`}
			>
				{children}
			</div>
		</div>
	);
};

export default Main;
