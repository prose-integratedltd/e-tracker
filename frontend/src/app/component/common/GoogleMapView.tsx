"use client";

import { useToast } from "@/context/ToastContext";
import { Address } from "@/dto/address";
import { instance } from "@/lib/api";

import {
	Marker,
	GoogleMap,
	Libraries,
	useJsApiLoader,
} from "@react-google-maps/api";
import { CSSProperties, memo, useCallback, useEffect, useState } from "react";

type MarkerData = { title?: string; longitude: number; latitude: number };

const libraries = ["places", "drawing", "geometry"];

type Map = google.maps.Map;
type GoogleMapViewProps = Position;
type Position = { lat: number; lng: number };
// type AdvancedMarker = google.maps.marker.AdvancedMarkerElement;
type ValueSetter<T> = (param: T) => void;
const API_KEY =
	process.env.NEXT_GOOGLE_MAP_API_KEY ??
	"AIzaSyDlSZfn1gJqZVX3YNF40CVP9p4XHxgGx2c";

const GoogleMapView = ({
	style,
	coords,
	markers,
	onSelected,
	showPolyline = false,
	canPickLocation = false,
	showActionButton = false,
	showCurrentLocation = false,
}: {
	style?: CSSProperties;
	markers?: MarkerData[];
	showPolyline?: boolean;
	canPickLocation?: boolean;
	showActionButton?: boolean;
	coords: GoogleMapViewProps;
	showCurrentLocation?: boolean;
	onSelected?: ValueSetter<Address>;
}) => {
	const [position, setPosition] = useState<Position>(coords);
	const [isLoading, setIsLoading] = useState(false);
	const [map, setMap] = useState<Map | null>(null);
	const { showToast } = useToast();

	const { isLoaded, loadError } = useJsApiLoader({
		googleMapsApiKey: API_KEY!,
		libraries: libraries as Libraries,
	});

	useEffect(() => {
		if (showPolyline) return;
		setTimeout(() => map?.setZoom(17), 100);
	}, [map, showPolyline]);

	const geocodePosition = useCallback(async () => {
		const { lat: latitude, lng: longitude } = position;

		setIsLoading(true);

		try {
			const details = await instance
				.post<Address>(`/google-places/reverse-geocode`, {
					latitude,
					longitude,
				})
				.then((res) => res?.data);

			setIsLoading(false);

			return details;
		} catch (error) {
			setIsLoading(false);
			showToast(`Unable to decode location ${error}`, "error");
		}
	}, [position, showToast]);

	const onLoad = useCallback(
		(map: Map) => {
			const bounds = new google.maps.LatLngBounds(position);
			map.fitBounds(bounds);
			setMap(map);

			if (showPolyline) {
				const path = (markers ?? [])?.map(({ longitude, latitude }) => {
					return { lat: latitude, lng: longitude };
				});

				drawPolylines(path).setMap(map);
				const bounds = getBoundsFromPolyline(path);
				map.fitBounds(bounds);

				moveCameraLeft({ bounds, map });
			}
		},
		[markers, position, showPolyline]
	);

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const onUnmount = useCallback((_: Map) => setMap(null), []);

	if (loadError) {
		return (
			<div className="flex flex-col justify-center items-center h-[10rem]">
				Unable to load Google Map
			</div>
		);
	}

	if (!isLoaded) {
		return (
			<div className="flex flex-col justify-center items-center h-[10rem]">
				Loading google map
			</div>
		);
	}

	return (
		<div className="w-full h-full">
			<GoogleMap
				options={{
					disableDefaultUI: true,
				}}
				mapContainerStyle={{
					width: "100%",
					height: "90%",
					...style,
				}}
				onUnmount={onUnmount}
				center={position}
				onLoad={onLoad}
				onClick={(e) => {
					if (!canPickLocation) return;
					const p = {
						lat: e.latLng?.lat() ?? position.lat,
						lng: e.latLng?.lng() ?? position.lng,
					};

					setPosition(p);
				}}
			>
				{showCurrentLocation && (
					<Marker
						position={position}
						icon={{
							url: "/map-marker.png",
							scaledSize: new google.maps.Size(20, 31),
						}}
					/>
				)}

				{markers?.map(({ title, longitude, latitude }) => (
					<Marker
						key={title}
						title={title}
						position={{ lat: latitude, lng: longitude }}
						icon={{
							url: "/tracker/path-map-marker.png",
							anchor: new google.maps.Point(30 / 2, 30 / 2),
							scaledSize: new google.maps.Size(30, 30),
						}}
					/>
				))}
			</GoogleMap>

			{showActionButton && (
				<div className="text-right mt-2">
					<button
						disabled={isLoading}
						onClick={async () => {
							const details = await geocodePosition();

							if (details) onSelected?.(details);
						}}
						className="bg-black disabled:bg-[#646464] disabled:text-[#424242bd] px-4 py-2 rounded-xl text-white"
					>
						Okay
					</button>
				</div>
			)}
		</div>
	);
};

export default memo(GoogleMapView);

const drawPolylines = (
	path: { lat: number; lng: number }[]
): google.maps.Polyline => {
	return new google.maps.Polyline({
		path: path,
		geodesic: true,
		strokeColor: "#FF8D24",
		strokeOpacity: 1,
		strokeWeight: 4,
	});
};

const moveCameraLeft = ({
	bounds,
	map,
}: {
	bounds: google.maps.LatLngBounds;
	map: google.maps.Map;
}) => {
	setTimeout(() => {
		const oldCenter = bounds.getCenter();
		const scale = Math.pow(2, map.getZoom() ?? 0); // current zoom level
		const projection = map.getProjection();

		if (!projection) return;

		const worldPoint = projection.fromLatLngToPoint(oldCenter);

		if (!worldPoint) return;

		const pixelOffsetX = -300 / scale;

		const shiftedPoint = new google.maps.Point(
			worldPoint.x - pixelOffsetX,
			worldPoint.y
		);

		const center = projection.fromPointToLatLng(shiftedPoint);
		if (center) map.panTo(center);
	}, 500);
};

const getBoundsFromPolyline = (path: { lat: number; lng: number }[]) => {
	const bounds = new google.maps.LatLngBounds();

	path.forEach((point) => {
		bounds.extend(new google.maps.LatLng(point.lat, point.lng));
	});

	return bounds;
};
