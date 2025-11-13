"use client";

import React, { useState } from "react";
import { MdMenu } from "react-icons/md";
import { useAppContext } from "@/context/AppContext";
import Link from "next/link";
import SearchResultsModal from "../common/modals/SearchResultsModal";
import { Data } from "@/lib/queries/getJobs";
import NotificationsModal from "../common/modals/NotificationsModal";
import NotificationIconButton from "../icons/notification.icon.button";

interface DashboardHeadProps {
	name: string;
	search?: string;
	setSearch?: React.Dispatch<React.SetStateAction<string | undefined>>;
	results?: Data;
}

const DashboardHead: React.FC<DashboardHeadProps> = ({
	name,
	search,
	results,
	setSearch,
}) => {
	const { showMenu, setShowMenu } = useAppContext();
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [showNotifications, setShowNotifications] = useState(false);

	return (
		<>
			<div className="z-50 left-0 right-0 top-0 sticky h-[80px] sm:h-[100px] bg-white border-b border-[#CCCCCC] flex items-center justify-between px-4 sm:px-8">
				<h3 className="text-[#1D1D1D] text-xl font-semibold">{name}</h3>
				<div className="flex items-center gap-2 md:gap-4">
					{name === "Dashboard" && !isOpen && (
						<button
							className="hidden sm:flex items-center w-[370px] h-[54px] rounded-[10px] bg-[#EFEFEF] gap-3 px-3"
							onClick={() => setIsOpen(true)}
						>
							<div>
								<svg
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M21 21L17.5001 17.5M20 11.5C20 16.1944 16.1944 20 11.5 20C6.80558 20 3 16.1944 3 11.5C3 6.80558 6.80558 3 11.5 3C16.1944 3 20 6.80558 20 11.5Z"
										stroke="#3D3D3D"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
							</div>

							<span className="text-[#979797]">Search</span>
							{/* <input
                type="text"
                className="w-full h-full bg-transparent outline-none text-lg text-[#979797] placeholder:text-[#979797]"
                placeholder="Search"
                value={search}
                onChange={(e) => {
                  setSearch?.(e.target.value);
                  setIsOpen(e.target.value.length > 0);
                }}
                aria-label="Search"
              /> */}
						</button>
					)}

					<NotificationIconButton
						onShowDropdown={() => {
							setShowNotifications(true);
						}}
					/>

					<Link
						href="/notifications"
						className="w-[44px] h-[44px] rounded-[10px] bg-[#EFEFEF] flex sm:hidden items-center justify-center cursor-pointer"
					>
						<svg
							width="20"
							height="20"
							viewBox="0 0 28 28"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M10.9134 24.5C11.7361 25.2261 12.8167 25.6667 14.0002 25.6667C15.1837 25.6667 16.2644 25.2261 17.087 24.5M21.0002 9.33334C21.0002 7.47683 20.2627 5.69635 18.95 4.3836C17.6372 3.07084 15.8567 2.33334 14.0002 2.33334C12.1437 2.33334 10.3632 3.07084 9.05048 4.3836C7.73772 5.69635 7.00023 7.47683 7.00023 9.33334C7.00023 12.9386 6.09077 15.407 5.07483 17.0397C4.21787 18.4169 3.78939 19.1055 3.8051 19.2976C3.8225 19.5103 3.86756 19.5914 4.03896 19.7185C4.19376 19.8333 4.89158 19.8333 6.28722 19.8333H21.7132C23.1089 19.8333 23.8067 19.8333 23.9615 19.7185C24.1329 19.5914 24.178 19.5103 24.1953 19.2976C24.2111 19.1055 23.7826 18.4169 22.9256 17.0397C21.9097 15.407 21.0002 12.9386 21.0002 9.33334Z"
								stroke="#3D3D3D"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					</Link>

					<Link
						href="/settings"
						className="w-[54px] h-[54px] rounded-[10px] bg-[#EFEFEF] hidden sm:flex items-center justify-center cursor-pointer"
					>
						<svg
							width="28"
							height="28"
							viewBox="0 0 28 28"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M23.3337 24.5C23.3337 22.8718 23.3337 22.0578 23.1327 21.3953C22.6803 19.9039 21.5131 18.7367 20.0217 18.2843C19.3592 18.0833 18.5451 18.0833 16.917 18.0833H11.0837C9.4555 18.0833 8.64142 18.0833 7.97899 18.2843C6.48752 18.7367 5.32037 19.9039 4.86794 21.3953C4.66699 22.0578 4.66699 22.8718 4.66699 24.5M19.2503 8.75C19.2503 11.6495 16.8998 14 14.0003 14C11.1008 14 8.75033 11.6495 8.75033 8.75C8.75033 5.8505 11.1008 3.5 14.0003 3.5C16.8998 3.5 19.2503 5.8505 19.2503 8.75Z"
								stroke="#3D3D3D"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					</Link>

					<div className="w-[44px] h-[44px] rounded-[10px] bg-[#EFEFEF] sm:hidden flex items-center justify-center cursor-pointer">
						<svg
							width="20"
							height="20"
							viewBox="0 0 28 28"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M23.3337 24.5C23.3337 22.8718 23.3337 22.0578 23.1327 21.3953C22.6803 19.9039 21.5131 18.7367 20.0217 18.2843C19.3592 18.0833 18.5451 18.0833 16.917 18.0833H11.0837C9.4555 18.0833 8.64142 18.0833 7.97899 18.2843C6.48752 18.7367 5.32037 19.9039 4.86794 21.3953C4.66699 22.0578 4.66699 22.8718 4.66699 24.5M19.2503 8.75C19.2503 11.6495 16.8998 14 14.0003 14C11.1008 14 8.75033 11.6495 8.75033 8.75C8.75033 5.8505 11.1008 3.5 14.0003 3.5C16.8998 3.5 19.2503 5.8505 19.2503 8.75Z"
								stroke="#3D3D3D"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					</div>

					<div
						className="w-[44px] h-[44px] rounded-[10px] bg-[#EFEFEF] sm:hidden flex items-center justify-center cursor-pointer"
						onClick={() => setShowMenu(!showMenu)}
					>
						<MdMenu className="text-xl" />
					</div>
				</div>
			</div>

			{isOpen && (
				<SearchResultsModal
					results={results}
					setIsOpen={setIsOpen}
					setSearch={setSearch}
					search={search}
				/>
			)}

			{showNotifications && (
				<NotificationsModal
					onClosed={() => setShowNotifications(false)}
				/>
			)}
		</>
	);
};

export default DashboardHead;
