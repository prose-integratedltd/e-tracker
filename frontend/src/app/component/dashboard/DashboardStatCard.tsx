"use client";

import { useRouter } from "next/navigation";
import React from "react";

const DashboardStatCard = ({
	icon,
	background,
	title,
	number,
	color,
	searchKey,
}: {
	icon: React.ElementType;
	background: string;
	title: string;
	number: string | number;
	color: string;
	searchKey?: string;
}) => {
	const router = useRouter();

	return (
		<div
			className="rounded-[16px] bg-white flex-1 md:flex-initial md:min-w-[30%] min-w-[150px]  sm:min-w-initial h-[130px] flex items-center justify-center p-4 gap-3 sm:gap-5 cursor-pointer"
			onClick={() => {
				if (
					(!searchKey || searchKey.trim() === "") &&
					!title.includes("Job")
				) {
					return;
				}

				router.push(`/jobs?status=${searchKey}`);
			}}
		>
			<div
				className={`p-2 sm:p-4 rounded-full flex items-center justify-center`}
				style={{ backgroundColor: background }}
			>
				{React.createElement(icon)}
			</div>

			<div>
				<span className="text-[#58595B] text-[10px] sm:text-[12px]">
					{title}
				</span>
				<h2
					className="text-[26px] sm:text-[42px] font-semibold"
					style={{ color: color }}
				>
					{number}
				</h2>
			</div>
		</div>
	);
};
export default DashboardStatCard;
