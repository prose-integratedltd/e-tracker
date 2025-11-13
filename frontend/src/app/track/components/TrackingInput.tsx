"use client";
import CloseIcon from "@/app/component/icons/close.icon";
import { useRef, useState } from "react";

const TrackingInput = ({ initialValue }: { initialValue: string }) => {
	const ref = useRef<HTMLInputElement>(null);
	const [value, setValue] = useState(initialValue);

	return (
		<>
			<input
				ref={ref}
				type="text"
				defaultValue={value}
				name="trackingId"
				className="w-full"
				onChange={(e) => setValue(e.target.value)}
			/>

			{value && (
				<button
					type="button"
					onClick={() => {
						ref.current!.value = "";
						ref.current?.focus();
						setValue("");
					}}
				>
					<CloseIcon />
				</button>
			)}
		</>
	);
};

export default TrackingInput;
