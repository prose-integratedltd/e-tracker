"use client";

import BackIconButton from "@/app/component/icons/back.icon";
import { useClearNotifications } from "@/hooks/mutations/useClearNotifications";
import { useFetchNotifications } from "@/hooks/queries/useFetchNotifications";
import { NotificationType } from "@/lib/queries/getNotifications";
import Link from "next/link";
import React from "react";

const Notifications = () => {
	const { data, isLoading } = useFetchNotifications();
	const { mutate, isPending } = useClearNotifications();

	const clearAll = async () => {
		mutate();
	};

	return (
		<div className="px-5 w-full h-screen overflow-y-auto">
			<div className="flex items-center justify-between w-full mt-10">
				<div className="flex items-center gap-2">
					<BackIconButton />
					<span className="text-[#1D1D1D] font-semibold text-2xl">
						Notifications
					</span>
				</div>

				{data?.data?.length !== 0 && (
					<button
						onClick={!isPending ? clearAll : () => {}}
						className="px-[25px] py-[5px] rounded-[10px] border border-[#CCCCCC] text-[#3D3D3D]"
					>
						{isPending ? "Clearing..." : "Clear all"}
					</button>
				)}
			</div>

			<div className="mt-7 flex flex-col gap-4 w-full pb-10">
				{isLoading ? (
					<div className="flex items-center justify-center w-full h-full pb-10 text-xl">
						Loading...
					</div>
				) : Array.isArray(data?.data) ? (
					data.data.map((item) => {
						const messageParts = item?.message?.split("{id-link}");

						function getLink(): string | import("url").UrlObject {
							switch (item.type) {
								case NotificationType.Job:
									return `/jobs/${item?.data?.id}`;

								case NotificationType.User:
									return `/users/${item?.data?.id}`;

								case NotificationType.EmailTemplate:
									return `/email-templates/${item?.data?.id}`;

								default:
									return item?.data?.id;
							}
						}

						return (
							<div
								key={item?.id}
								className="w-full p-4 bg-[#FBF9F9] rounded-[10px] border-l-4 border-[#09B0B5]"
							>
								<h3 className="text-[#1D1D1D] font-poppins font-semibold">
									{item?.title}
								</h3>
								<p className="text-[#1D1D1D] font-poppins">
									{messageParts?.[0]}
									<Link
										href={getLink()}
										className="text-[#02A4FF] cursor-pointer"
									>
										{item?.data?.jId || item?.data?.id}
									</Link>
									{messageParts?.[1]}
								</p>
							</div>
						);
					})
				) : (
					<div className="flex flex-col items-center justify-center w-full h-full py-10">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-16 w-16 text-gray-400"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								fillRule="evenodd"
								d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.293-9.707a1 1 0 00-1.414 0L10 10.172 8.121 8.293a1 1 0 10-1.414 1.414l2.5 2.5a1 1 0 001.414 0l4-4a1 1 0 000-1.414z"
								clipRule="evenodd"
							/>
						</svg>
						<p className="text-gray-500 mt-4 text-center">
							No notifications available at the moment.
						</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default Notifications;
