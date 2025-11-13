import {
	ReactElement,
	RefObject,
	useCallback,
	useEffect,
	useState,
} from "react";
import { useToast } from "@/context/ToastContext";
import debounce from "@/hooks/useDebounce";
import { instance } from "@/lib/api";
import { Address } from "@/dto/address";

type AutocompleteGooglePlaceProps = {
	id?: string;
	ref?: RefObject<HTMLInputElement>;
	label?: ReactElement<HTMLLabelElement>;
	className?: string;
	required?: boolean;
	value?: string;
	name?: string;
	onSelected?: (location: Address) => void;
};

export type Place = { address: string; placeId: string };

const AutocompleteGooglePlace = ({
	id,
	ref,
	name,
	label,
	value,
	className,
	onSelected,
	required = false,
}: AutocompleteGooglePlaceProps) => {
	const { showToast } = useToast();
	const [place, setPlace] = useState(value ?? "");
	const [places, setPlaces] = useState<Place[]>([]);

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const debouncedSearch = useCallback(
		debounce(async (query: string) => {
			const url = `/google-places/search/${query}`;

			if (places.map((place) => place.address).includes(query)) return;

			try {
				const response = await instance
					.get<Place[]>(url)
					.then((res) => res?.data);

				setPlaces(response);
			} catch (error) {
				showToast(`${error}`, "error");
			}
		}),
		[]
	);

	const onChanged = () => {
		const value = ref?.current?.value;
		setPlace(value ?? "");
		if (!value) return setPlaces([]);

		debouncedSearch(value);
	};

	const getPlaceDetails = async (place: Place) => {
		try {
			const response = await instance
				.get(`/google-places/details/${place?.placeId}`)
				.then((res) => res?.data);

			onSelected?.(response);
		} catch (error) {
			showToast(`Unable to get Google Place Details ${error}`, "error");
		}
	};

	const selectPlace = (place: Place) => {
		setPlaces([]);
		getPlaceDetails(place);
		setPlace(place.address);
	};

	useEffect(() => {
		if (value) return setPlace(value);
	}, [value]);

	return (
		<div className="flex flex-col justify-center w-full relative">
			{label}
			<div className="flex items-center justify-center">
				<input
					id={id}
					ref={ref}
					type="text"
					name={name}
					value={place}
					autoComplete="off"
					required={required}
					onChange={onChanged}
					className={className}
				/>

				<svg
					width="20"
					height="20"
					viewBox="0 0 20 20"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M17.5 17.5L14.5834 14.5833M16.6667 9.58333C16.6667 13.4954 13.4954 16.6667 9.58333 16.6667C5.67132 16.6667 2.5 13.4954 2.5 9.58333C2.5 5.67132 5.67132 2.5 9.58333 2.5C13.4954 2.5 16.6667 5.67132 16.6667 9.58333Z"
						stroke="#1D1D1D"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			</div>

			{places.length > 0 && (
				<div className="absolute pb-0 p-2 rounded top-full bg-black text-white text-sm cursor-pointer max-h-[300px] overflow-auto z-40">
					{places.map((place) => (
						<div
							key={place.placeId}
							onClick={() => selectPlace(place)}
							className="p-2 mb-2 rounded hover:bg-[#ffffff2e]"
						>
							{place.address}
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default AutocompleteGooglePlace;
