interface InputErrorProps {
	className?: string;
	children: React.ReactNode;
}

const InputError: React.FC<InputErrorProps> = ({ className, children }) => {
	return <p className={`text-sm text-red-900 ${className}`}>{children}</p>;
};

export default InputError;
