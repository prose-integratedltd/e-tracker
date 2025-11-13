"use client";

import React, { useRef } from "react";
import { Bar } from "react-chartjs-2";
import {
	Chart as ChartJS,
	BarElement,
	CategoryScale,
	LinearScale,
	Tooltip,
	Legend,
} from "chart.js";
import { useFetchStats } from "@/hooks/queries/useFetchStats";
import { useRouter } from "next/navigation";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const StatsChart = () => {
	const { data: stats, isLoading } = useFetchStats();
	const chartRef = useRef<ChartJS<"bar">>(null);
	const router = useRouter();

	const chartData = stats?.chart
		? Object.entries(stats.chart).flatMap(([year, months]) =>
				Object.entries(months).map(([month, value]) => ({
					year,
					month,
					...value,
				}))
		  )
		: [];

	const labels = chartData.map((item) => item.month);
	const dataValues = chartData.map((item) => item.count);

	const data = {
		labels: labels.length ? labels : ["Jan", "Feb", "Mar", "Apr", "May"],
		datasets: [
			{
				label: "Monthly Jobs",
				data: dataValues.length ? dataValues : [0, 0, 0, 0, 0],
				backgroundColor: "#00a5a5",
			},
		],
	};

	const options = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				display: false,
			},
		},
		scales: {
			y: {
				beginAtZero: true,
				ticks: {
					stepSize: 5,
				},
			},
		},
	};

	const handleClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
		const chart = chartRef.current;
		if (!chart) return;

		const elements = chart.getElementsAtEventForMode(
			event.nativeEvent,
			"nearest",
			{ intersect: true },
			true
		);

		if (elements.length > 0) {
			const index = elements[0].index;
			const data = chartData[index];

			router.push(
				`/jobs?startDate=${data.startDate}&endDate=${data.endDate}`
			);
		}
	};

	return (
		<div className="p-4 rounded-2xl shadow-md bg-white w-full h-[330px]">
			{isLoading ? (
				<p>Loading...</p>
			) : (
				<Bar
					ref={chartRef}
					data={data}
					options={options}
					onClick={handleClick}
				/>
			)}
		</div>
	);
};

export default StatsChart;
