import { ChangeEventHandler, HTMLInputTypeAttribute, useRef } from "react";
import AutocompleteGooglePlace from "../common/AutocompleteGooglePlace";
import { Address } from "@/dto/address";

interface JobInputProps {
	id?: string;
	name?: string;
	label: string;
	errorText?: string;
	readOnly?: boolean;
	multiline?: boolean;
	placeholder?: string;
	defaultValue?: string;
	defaultLongitudeValue?: string | number;
	defaultLatitudeValue?: string | number;
	autoCompleteLocation?: boolean;
	autoCapitalize?:
		| "off"
		| "none"
		| "on"
		| "sentences"
		| "words"
		| "characters"
		| undefined;
	type?: HTMLInputTypeAttribute;
	onChange?: ChangeEventHandler<HTMLInputElement>;
}

const JobInput: React.FC<JobInputProps> = ({
	id,
	name,
	label,
	onChange,
	readOnly,
	multiline,
	errorText,
	placeholder,
	defaultValue,
	type = "text",
	autoCapitalize,
	autoCompleteLocation,
	defaultLatitudeValue,
	defaultLongitudeValue,
}) => {
	const ref = useRef<HTMLInputElement>(null);
	const refLng = useRef<HTMLInputElement>(null);
	const refLat = useRef<HTMLInputElement>(null);
	const refAutocomplete = useRef<HTMLInputElement>(null);

	function onSelectLocation(value: Address): void {
		if (
			!(ref.current && refLng.current && refLat.current && value.address)
		) {
			return;
		}
		ref.current.value = refAutocomplete.current?.value ?? value.address;
		if (value.longitude) refLng.current.value = value.longitude.toString();
		if (value.latitude) refLat.current.value = value.latitude.toString();
	}

	return (
		<div className="flex flex-col min-w-full md:min-w-[464px] gap-1">
			<label htmlFor={id} className="text-[#6C757D] font-medium text-sm">
				{label}
			</label>
			<div
				className={`relative flex gap-2 border border-[#CCCCCC] text-[#1D1D1D] px-3 py-2 rounded-md ${
					!multiline ? "h-[54px]" : ""
				}`}
			>
				{autoCompleteLocation && (
					<>
						<input
							ref={ref}
							type="text"
							className="hidden"
							name={`${name}.address`}
							defaultValue={defaultValue}
						/>
						<input
							ref={refLng}
							type="text"
							className="hidden"
							name={`${name}.longitude`}
							defaultValue={defaultLongitudeValue}
						/>
						<input
							ref={refLat}
							type="text"
							className="hidden"
							name={`${name}.latitude`}
							defaultValue={defaultLatitudeValue}
						/>
					</>
				)}
				{autoCompleteLocation ? (
					<AutocompleteGooglePlace
						id={id}
						value={defaultValue}
						ref={refAutocomplete}
						onSelected={onSelectLocation}
						className="flex-1 focus:outline-none"
					/>
				) : multiline ? (
					<textarea
						id={id}
						name={name}
						readOnly={readOnly}
						placeholder={placeholder}
						defaultValue={defaultValue}
						autoCapitalize={autoCapitalize}
						className="flex-1 focus:outline-none"
					/>
				) : (
					<input
						id={id}
						name={name}
						type={type}
						readOnly={readOnly}
						onChange={onChange}
						placeholder={placeholder}
						defaultValue={defaultValue}
						autoCapitalize={autoCapitalize}
						className="flex-1 focus:outline-none"
					/>
				)}
			</div>

			{errorText && (
				<p className="text-[11px] text-red-600">{errorText}</p>
			)}
		</div>
	);
};

export default JobInput;
