interface StarIcon {
	fill?: string;
}

const StarIcon: React.FC<StarIcon> = ({ fill = "#EFEFEF" }) => {
	return (
		<svg
			width="31"
			height="29"
			viewBox="0 0 31 29"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M15.5 0L20.7842 8.22694L30.2414 10.7102L24.05 18.2781L24.6107 28.0398L15.5 24.49L6.38933 28.0398L6.95 18.2781L0.758624 10.7102L10.2158 8.22694L15.5 0Z"
				fill={fill}
			/>
		</svg>
	);
};

export default StarIcon;
