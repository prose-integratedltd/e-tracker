import { truncateText } from "@/lib/functions/truncateText";
import { Data } from "@/lib/queries/getJobs";
import { useRouter } from "next/navigation";
import React from "react";

type SearchResultsModalProps = {
	results?: Data;
	setIsOpen: (isOpen: boolean) => void;
	setSearch?: React.Dispatch<React.SetStateAction<string | undefined>>;
	search?: string;
};

const SearchResultsModal: React.FC<SearchResultsModalProps> = ({
	results,
	setIsOpen,
	setSearch,
	search,
}) => {
	const router = useRouter();

	return (
		<div
			className="w-full h-full bg-black bg-opacity-70 fixed z-50 top-0 left-0"
			onClick={() => {
				setSearch?.("");
				setIsOpen(false);
			}}
		>
			<div
				className="absolute right-0 md:right-[13%] top-0 w-full md:w-[650px] mt-2 bg-white border border-gray-300 shadow-lg rounded-[10px] z-10"
				onClick={(e) => e.stopPropagation()}
			>
				<div className="w-full h-11 border-b border-[#CCCCCC] p-3 flex items-center gap-3">
					<svg
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M21 21L17.5001 17.5M20 11.5C20 16.1944 16.1944 20 11.5 20C6.80558 20 3 16.1944 3 11.5C3 6.80558 6.80558 3 11.5 3C16.1944 3 20 6.80558 20 11.5Z"
							stroke="#3D3D3D"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>

					<input
						type="text"
						className="w-full h-full bg-transparent outline-none font-poppins text-[#979797] placeholder:text-[#979797]"
						placeholder="Search"
						value={search}
						onChange={(e) => setSearch?.(e.target.value)}
						aria-label="Search"
					/>
				</div>
				<div className="h-[230px] overflow-y-auto scrollbar-hide">
					{results?.data?.map((result, index) => (
						<div
							key={index}
							className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700 capitalize"
							onClick={() =>
								router.push(`/jobs/edit/${result?.id}`)
							}
						>
							{truncateText(result?.description, 4) ||
								result?.type?.name}
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default SearchResultsModal;
