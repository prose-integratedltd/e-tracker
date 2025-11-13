import TrackingInput from "../components/TrackingInput";
import Navbar from "@/app/component/Navbar";
import trackAction from "../action/tacking";
import JobStatuses from "../components/JobStatuses";
import TrackWithMap from "@/app/component/common/TrackWithMap";
import JobRatingForm from "@/app/component/common/JobRatingForm";
import { getJobByTrackingId } from "../action/get.job.by.tracking.id";
import JobStatus from "@/app/data/job.status";

type TrackingPageProp = {
	params: { trackingId: string };
	searchParams: { map: boolean };
};

const Track = async ({ params, searchParams }: TrackingPageProp) => {
	const [{ trackingId }, { map }] = await Promise.all([params, searchParams]);
	const job = await getJobByTrackingId(trackingId);

	const isCompleted =
		job.status === JobStatus.Completed || job.progress === 100;

	if (map) {
		return (
			<TrackWithMap
				statuses={job.statusUpdates}
				trackingId={trackingId}
			/>
		);
	}

	return (
		<>
			<Navbar showShadow={true} backgroundColor="bg-white" />

			<section className="flex flex-col mt-44 items-center justify-center gap-10">
				<h1 className="text-[#19469D] font-[600] text-xl md:text-2xl">
					Tracking Package
				</h1>

				<form
					className="flex items-center text-lg pl-4 pr-2 py-2 border border-[#19469D] md:min-w-[607px]"
					action={trackAction}
				>
					<TrackingInput initialValue={trackingId} />
				</form>
			</section>

			<section className="flex flex-col gap-10 mb-4 items-center justify-center mt-10">
				<div className="border border-[#19469D] px-10 py-5 lg:w-[65%] w-[95%]">
					<h2 className="text-lg border-b-2 pb-2">
						Tracking Number -{" "}
						<span className="text-[#19469D]">{trackingId}</span>
					</h2>

					<JobStatuses
						trackingId={trackingId}
						headerClassName="text-[#19469D]"
					/>
				</div>

				{isCompleted && <JobRatingForm job={job} />}
			</section>
		</>
	);
};

export default Track;
