"use client";

import React, { useEffect } from "react";

interface ToastProps {
	message: string;
	type: string;
	visible: boolean;
	onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, visible, onClose }) => {
	useEffect(() => {
		if (visible) {
			const timer = setTimeout(() => onClose(), 3000);
			return () => clearTimeout(timer);
		}
	}, [visible, onClose]);

	if (!visible) return null;

	return (
		<div
			className={`fixed top-4 right-5 md:right-[10%] p-4 shadow-lg transition-opacity border-l-4 text-[#1D1D1D] text-left flex items-center justify-center z-50 ${
				type === "success"
					? "bg-green-200 border-green-700"
					: "bg-[#FFE9E9] border-[#FF3030]"
			}`}
		>
			<span
				className="text-[#1D1D1D] text-sm"
				dangerouslySetInnerHTML={{ __html: message }}
			></span>
		</div>
	);
};

export default Toast;
