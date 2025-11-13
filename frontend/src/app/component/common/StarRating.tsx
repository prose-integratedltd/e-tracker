import StarIcon from "../icons/star.icon";
import { useRef, useState } from "react";

interface StarRatingProps {
	value?: number;
	max?: number;
}

const StarRating: React.FC<StarRatingProps> = ({ value = 0, max = 5 }) => {
	const ref = useRef<HTMLInputElement>(null);
	const [rating, setRating] = useState(value);

	const onChanged = (value: number) => {
		if (!ref.current) return;
		ref.current.value = value.toString();
		setRating(value);
	};

	return (
		<div className="flex gap-1">
			<input
				ref={ref}
				type="text"
				name="rating"
				className="hidden"
				defaultValue={rating}
			/>

			{Array.from({ length: max }).map((_, i) => {
				return (
					<span
						key={i}
						className="hover:cursor-pointer"
						onClick={() => onChanged(i + 1)}
					>
						<StarIcon fill={i < rating ? "#19469d" : undefined} />
					</span>
				);
			})}
		</div>
	);
};

export default StarRating;
