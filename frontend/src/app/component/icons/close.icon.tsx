const CloseIcon = ({
	color = "black",
	size = 24,
}: {
	color?: string;
	size?: string | number;
}) => {
	return (
		<svg
			width={size}
			height={size}
			fill="none"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M18 6L6 18M6 6L18 18"
				stroke={color}
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
};

export default CloseIcon;
