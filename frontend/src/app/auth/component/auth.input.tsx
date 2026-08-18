type Props = {
	prefix?: React.ReactNode;
	suffix?: React.ReactNode;
	placeholder?: string;
	type?: string;
	name?: string;
	required?: boolean;
	className?: string;
	value?: string;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	isError?: boolean;
};

const AuthInput = ({
	prefix,
	suffix,
	placeholder,
	type,
	name,
	required,
	className,
	value,
	onChange,
	isError,
}: Props) => {
	return (
		<div
			className={`border ${
				isError ? "border-[#FF6C6C]" : "border-grey"
			} rounded-[10px] h-[54px] overflow-hidden flex`}
		>
			{prefix && (
				<div className="px-3 flex items-center justify-center bg-[#F0F0F0] border-r border-r-grey">
					{prefix}
				</div>
			)}

			<input
				name={name}
				type={type}
				value={value}
				placeholder={placeholder}
				className={`px-[16px] w-full ${className}`}
				onChange={onChange}
				required={required}
			/>

			{suffix && (
				<div className="flex px-3 justify-center items-center">
					{suffix}
				</div>
			)}
		</div>
	);
};

export default AuthInput;
