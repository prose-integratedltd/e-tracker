const BackIconButton = ({ onClick }: { onClick?: () => void }) => {
	return (
		<span
			onClick={() => onClick?.() ?? window.history.back()}
			className="cursor-pointer hover:bg-gray-200 rounded-full p-2 transition-all duration-300 ease-in-out"
		>
			<svg
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M19 12L5 12M5 12L12 19M5 12L12 5"
					stroke="#1D1D1D"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
		</span>
	);
};

export default BackIconButton;
