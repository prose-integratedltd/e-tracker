"use client";

import React from "react";

interface SuspendUserModalProps {
	onClosed: () => void;
	onSuspended: () => void;
	isPending: boolean;
	suspended?: boolean;
}

const SuspendUserModal: React.FC<SuspendUserModalProps> = ({
	onClosed,
	onSuspended: onDeleted,
	isPending,
	suspended = false,
}) => {
	return (
		<div
			onClick={onClosed}
			className="w-full h-screen fixed top-0 left-0 z-40 bg-black bg-opacity-80 flex items-center justify-center"
		>
			<div
				className="bg-white rounded-lg shadow-lg w-96 p-6 text-center"
				onClick={(e) => e.stopPropagation()}
			>
				<div className="flex justify-center mb-4">
					<div className="w-[86px] h-[86px] bg-[#FFF7E3] rounded-full flex items-center justify-center">
						<svg
							width="45"
							height="45"
							viewBox="0 0 45 45"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M30.9375 31.875H40.3125L30.9375 41.25H40.3125M41.1574 24.375C41.2187 23.7583 41.25 23.1328 41.25 22.5C41.25 12.1447 32.8553 3.75 22.5 3.75C12.1447 3.75 3.75 12.1447 3.75 22.5C3.75 32.8553 12.1447 41.25 22.5 41.25C22.8144 41.25 23.1269 41.2423 23.4375 41.227C23.7521 41.2115 24.0647 41.1882 24.375 41.1574M22.5 11.25V22.5L29.5094 26.0047"
								stroke="#FF8D24"
								stroke-width="3"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					</div>
				</div>
				<h2 className="text-lg font-semibold mb-6">
					Are you sure you want to <br />{" "}
					{suspended ? "unsuspend" : "suspend"} this User?
				</h2>
				<div className="flex justify-between space-x-4">
					<button
						onClick={onClosed}
						className="w-full bg-[#F4F4F4]  text-[#3D3D3D] font-semibold py-2 rounded"
					>
						Cancel
					</button>
					<button
						onClick={onDeleted}
						className="w-full bg-[#FFF7E3] text-[#FF8D24] font-semibold py-2 rounded"
						disabled={isPending}
					>
						{isPending ? "Loading..." : "Yes, Sure"}
					</button>
				</div>
			</div>
		</div>
	);
};

export default SuspendUserModal;
