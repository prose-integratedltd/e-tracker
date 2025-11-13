import LogoutIcon from "../../icons/logout.icon";

type LogoutModalProps = {
	onConfirmed: () => void;
	onClosed: () => void;
};

const LogoutModal: React.FC<LogoutModalProps> = ({ onClosed, onConfirmed }) => {
	return (
		<div
			className="w-full h-full bg-black bg-opacity-70 fixed z-50 top-0 left-0 p-7"
			onClick={onClosed}
		>
			<div
				className="absolute w-full md:w-[481px] bg-white border border-gray-300 shadow-lg rounded-[10px] z-10 top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] flex flex-col items-center p-5 gap-[29px]"
				onClick={(e) => e.stopPropagation()}
			>
				<div className="w-[80px] h-[80px] bg-[#FFF2E5] font-2xl rounded-full flex items-center justify-center">
					<LogoutIcon />
				</div>

				<div className="p-4 overflow-y-auto scrollbar-hide font-[500] text-center text-[24px] font-poppins">
					Are you sure you want to Logout?
				</div>

				<div className="flex justify-between gap-[17px]">
					<div
						className="px-10 py-4 bg-[#F4F4F4] text-[#1D1D1D] rounded-lg hover:cursor-pointer"
						onClick={onClosed}
					>
						Cancel
					</div>
					<div
						className="px-10 py-4 bg-[#1D1D1D] text-white rounded-lg hover:cursor-pointer"
						onClick={onConfirmed}
					>
						Yes, Sure
					</div>
				</div>
			</div>
		</div>
	);
};

export default LogoutModal;
