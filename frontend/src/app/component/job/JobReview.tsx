import { useFetchJobReview } from "@/hooks/queries/useFetchJobReview";

const JobReview = ({ jobId }: { jobId: string }) => {
	const { data } = useFetchJobReview(jobId);

	if (!data) return <div className="mt-10">No review yet</div>;

	return (
		<div className="mb-10">
			<div className="mt-[40px] mb-[25px] p-4 font-semibold bg-[#F2F2F2]">
				Rating & Feedback
			</div>

			<div className="mb-[20px]">
				<div className="text-[#6C757D] text-[14px] font-medium mb-[6px]">
					Rating Count
				</div>

				<div className="max-w-[464px] bg-[#F2F2F2] p-[15px] border border-[#CCCCCC] rounded-lg">
					{data.rating}
				</div>
			</div>

			<div>
				<div className="text-[#6C757D] text-[14px] font-medium mb-[6px]">
					User Feedback
				</div>

				<div className="max-w-[1128px] bg-[#F2F2F2] p-[15px] border border-[#CCCCCC] rounded-lg">
					{data.comment}
				</div>
			</div>
		</div>
	);
};

export default JobReview;
