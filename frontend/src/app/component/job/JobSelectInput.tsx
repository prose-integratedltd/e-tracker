import {
	useRef,
	useState,
	ChangeEvent,
	ChangeEventHandler,
	HTMLInputTypeAttribute,
} from "react";
import CloseIcon from "../icons/close.icon";

interface Option {
	value?: string | number | readonly string[];
	option: string;
}

interface JobSelectInputProps {
	id?: string;
	name?: string;
	label: string;
	option: Option[];
	multiple?: boolean;
	type?: HTMLInputTypeAttribute;
	onMultipleSelected?: (value: string[]) => void;
	onChange?: ChangeEventHandler<HTMLSelectElement>;
	defaultValue?: string | number | readonly string[];
}

const JobSelectInput: React.FC<JobSelectInputProps> = ({
	id,
	name,
	label,
	option,
	onChange,
	defaultValue,
	multiple = false,
	onMultipleSelected,
}) => {
	const [selection, setSelection] = useState<string[]>(
		defaultValue?.toString().split(", ") ?? []
	);
	const inputRef = useRef<HTMLInputElement>(null);
	const ref = useRef<HTMLSelectElement>(null);

	const _onChange = (event: ChangeEvent<HTMLSelectElement>) => {
		if (!ref.current) return;
		const input = event.target.value.trim();

		if (!input || selection.includes(input)) {
			return (ref.current.value = "");
		}

		const update = [...selection, input];
		if (inputRef.current) inputRef.current.value = update.join(", ");
		onMultipleSelected?.(update);
		setSelection(update);
		ref.current.value = "";
	};

	return (
		<div className="flex flex-col min-w-full md:min-w-[464px] gap-1 after:contents-[\25BC]">
			<label htmlFor={id} className="text-[#6C757D] font-medium text-sm">
				{label}
			</label>

			<div className="relative flex gap-2 border border-[#CCCCCC] text-[#1D1D1D] px-3 py-2 rounded-md h-[54px]">
				{multiple &&
					selection.map((value, i) => (
						<span
							key={i}
							className="bg-[#F2F2F2] gap-1 py-1 px-2 rounded-md flex items-center justify-center text-[10px] sm:text-sm"
						>
							{value}{" "}
							<button
								onClick={(event) => {
									event.preventDefault();

									setSelection(
										selection.filter((s) => s !== value)
									);
								}}
							>
								<CloseIcon size={16} />
							</button>
						</span>
					))}

				{multiple && (
					<input
						name={name}
						type="text"
						ref={inputRef}
						className="hidden"
						defaultValue={defaultValue}
					/>
				)}

				{multiple ? (
					<select
						ref={ref}
						id={id}
						className="focus:outline-none flex-1"
						onChange={_onChange}
					>
						<option></option>
						{option.map((option) => (
							<option key={option.option} value={option.value}>
								{option.option}
							</option>
						))}
					</select>
				) : (
					<select
						id={id}
						name={name}
						onChange={onChange}
						defaultValue={defaultValue}
						className="flex-1 focus:outline-none"
					>
						{option.map((option) => (
							<option key={option.option} value={option.value}>
								{option.option}
							</option>
						))}
					</select>
				)}
			</div>
		</div>
	);
};

export default JobSelectInput;
