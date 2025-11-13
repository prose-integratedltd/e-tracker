"use client";

import { useFetchJobStatusUpdatesByTrackingId } from "@/hooks/queries/useFetchJobStatusUpdatesByTrackingId";
import StatusUpdateTile from "@/app/component/job/StatusUpdateTile";
import CloseIcon from "@/app/component/icons/close.icon";
import { redirect, RedirectType } from "next/navigation";
import Link from "next/link";

const JobStatuses = ({
	trackingId,
	headerClassName,
	isShowingMap = false,
	contentClassName,
}: {
	trackingId: string;
	isShowingMap?: boolean;
	headerClassName?: string;
	contentClassName?: string;
}) => {
	const { data: statuses, isPending } =
		useFetchJobStatusUpdatesByTrackingId(trackingId);

	const hasLocation = (statuses ?? []).some(
		(status) => status?.location != null
	);

	if (isPending && !isShowingMap) return <div>Loading...</div>;

	return (
		<div>
			{!isShowingMap && hasLocation && (
				<div className="text-right">
					<button
						onClick={() =>
							redirect(
								`/track/${trackingId}?map=true`,
								RedirectType.replace
							)
						}
						className="text-[#19469D] text-sm mb-10 hover:underline"
					>
						Open Map
					</button>
				</div>
			)}
			{isShowingMap && (
				<div className="flex flex-col items-end mb-5">
					<Link
						replace
						href={`/track/${trackingId}`}
						className="bg-black cursor-pointer hover:bg-[#000000c2] rounded-full p-2 transition-all duration-300 ease-in-out"
					>
						<CloseIcon color="white" />
					</Link>
				</div>
			)}
			{Array.isArray(statuses) && (
				<div className={`space-y-5 ${contentClassName}`}>
					{isShowingMap && (
						<div className="border-b border-b-white space-y-1">
							<h1 className="text-sm">Tracking Number</h1>
							<p className="text-lg">{trackingId}</p>
						</div>
					)}

					<div className="space-y-6 -vertical-line z-20 relative overflow-auto flex-1">
						{statuses.map((status) => (
							<StatusUpdateTile
								key={status.id}
								status={status}
								headerClassName={headerClassName}
							/>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

export default JobStatuses;
