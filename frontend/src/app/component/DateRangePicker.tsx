"use client";

import React, { useEffect, useState } from "react";
import { DateRange, RangeKeyDict, Range } from "react-date-range";
import { addDays, format } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

export interface DateRangePickerProps {
	startDate?: Date | null;
	endDate?: Date | null;
	onChange?: (value: Range[]) => void;
}

export default function DateRangePicker({
	onChange,
	startDate = new Date(),
	endDate = addDays(new Date(), 7),
}: DateRangePickerProps) {
	const [showPicker, setShowPicker] = useState(false);
	const [applied, setApplied] = useState<Range[]>([
		{
			key: "selection",
			startDate: startDate ?? new Date(),
			endDate: endDate ?? addDays(new Date(), 7),
		},
	]);
	const [range, setRange] = useState<Range[]>(applied);

	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth < 768); // change breakpoint if needed
		};

		handleResize(); // run once on mount
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	function handleChange(rangesByKey: RangeKeyDict): void {
		setRange([rangesByKey.selection]);
	}

	return (
		<div style={{ position: "relative" }}>
			<button
				onClick={() => setShowPicker(!showPicker)}
				style={{
					padding: "8px 12px",
					border: "1px solid #ccc",
					borderRadius: "10px",
					cursor: "pointer",
				}}
			>
				{applied[0].startDate && applied[0].endDate
					? `${format(
							applied[0].startDate,
							"MMM d, yyyy"
					  )} - ${format(applied[0].endDate, "MMM d, yyyy")}`
					: "Select Date Range"}
			</button>

			{showPicker && (
				<div
					style={{
						position: "absolute",
						zIndex: 10,
						top: "100%",
						marginTop: "8px",
						backgroundColor: "#fff",
						boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
						borderRadius: "8px",
						padding: "16px",
					}}
				>
					<DateRange
						ranges={range}
						onChange={handleChange}
						months={2}
						direction={isMobile ? "vertical" : "horizontal"}
						rangeColors={["#000"]}
						showMonthAndYearPickers={true}
					/>

					<div className="flex justify-between mt-6">
						<button
							onClick={() => setShowPicker(false)}
							style={{
								padding: "6px 12px",
								border: "1px solid #ccc",
								background: "#fff",
								borderRadius: "4px",
								cursor: "pointer",
							}}
						>
							Cancel
						</button>
						<button
							onClick={() => {
								onChange?.(range);
								setApplied(range);
								setShowPicker(false);
							}}
							style={{
								padding: "6px 12px",
								backgroundColor: "#000",
								color: "#fff",
								border: "none",
								borderRadius: "4px",
								cursor: "pointer",
							}}
						>
							Apply
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
