"use client";

import { JobStatusUpdate } from "@/hooks/queries/useFetchJobStatusUpdates";
import JobStatuses from "@/app/track/components/JobStatuses";
import GoogleMapView from "./GoogleMapView";

type TrackWithMapProps = { trackingId: string; statuses: JobStatusUpdate[] };

const TrackWithMap = ({ trackingId, statuses }: TrackWithMapProps) => {
	const locations = statuses
		?.filter((status) => status.location && status.completed)
		.map((status) => status.location!);

	const markers = locations?.map((location) => {
		return {
			title: location.address ?? "",
			longitude: location.longitude,
			latitude: location.latitude,
		};
	});

	const position = markers?.at(0);

	return (
		<div className="w-[100vw] h-[100vh] absolute top-0 left-0 bottom-0 right-0">
			<GoogleMapView
				showPolyline={true}
				markers={markers}
				coords={{
					lat: position?.latitude ?? 0,
					lng: position?.longitude ?? 0,
				}}
				style={{ height: "100%" }}
			/>

			<div className="absolute left-5 top-5 bottom-0 right-5 min-w-[300px] sm:left-[initial] sm:right-8 sm:top-8">
				<JobStatuses
					isShowingMap={true}
					trackingId={trackingId}
					headerClassName="text-white"
					contentClassName="flex flex-col bg-black p-8 rounded-lg min-w-[250px] space-y-8 text-white max-h-[80vh] overflow-y-hidden"
				/>
			</div>
		</div>
	);
};

export default TrackWithMap;
