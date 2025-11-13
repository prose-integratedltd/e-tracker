import { JobType } from "@/hooks/queries/useFetchJobTypes";
import { MdChevronRight } from "react-icons/md";
import FileIcon from "../icons/file.icon";
import Link from "next/link";

type JobTypeCardProps = {
	type: JobType;
};

const JobTypeCard: React.FC<JobTypeCardProps> = ({
	type: { id, name, description },
}) => {
	return (
		<Link
			href={`/jobs/add/${id}`}
			className="flex items-center justify-between font-poppins border border-[#CCCCCC] p-4 rounded-lg w-[284px] cursor-pointer"
		>
			<div className="mr-10 flex-1">
				<div className="pb-2">
					<FileIcon />
				</div>
				<h3 className="font-semibold text-md">{name}</h3>
				<p className="text-sm text-[#6C757D]">{description}</p>
			</div>

			<MdChevronRight className="w-6 h-6" />
		</Link>
	);
};

export default JobTypeCard;
