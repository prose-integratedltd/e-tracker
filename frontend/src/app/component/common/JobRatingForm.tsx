"use client";

import { JobModel } from "@/hooks/queries/useFetchJobDetails";

import rateJobAction from "@/app/track/action/rate.job.action";
import { useActionState } from "react";
import StarRating from "./StarRating";
import InputError from "./InputError";
import Image from "next/image";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

interface JobRatingFormProps {
	job: JobModel;
}

const JobRatingForm: React.FC<JobRatingFormProps> = ({ job }) => {
	const [state, formAction, pending] = useActionState(rateJobAction, {});

	if (state.review)
		return (
			<div className="px-10 py-5 lg:w-[65%] w-[95%] flex flex-col gap-5 items-center justify-center">
				<Image
					src="/tracker/positive-vote.png"
					alt="positive vote"
					height={89}
					width={89}
				/>

				<h2 className="font-semibold text-center text-lg">
					Your feedback has been received!
				</h2>

				<p className="font-medium text-[#6C757D] text-center text-sm">
					We Sincerely appreciate you taking out time to share your
					thoughts with us, your input helps us improve and continue
					to provide the best experiences for our Customers
				</p>

				<Link
					href={"/"}
					className="bg-[#09B0B5] px-4 py-3 rounded-lg text-white text-sm flex items-center gap-2"
				>
					Explore other Services <FaArrowRight />
				</Link>
			</div>
		);

	return (
		<form
			action={formAction}
			className="border border-[#19469D] px-10 py-5 lg:w-[65%] w-[95%]"
		>
			<input
				type="text"
				name="jobId"
				className="hidden"
				defaultValue={job.id}
			/>

			<h2 className="text-lg border-b-2 pb-2">
				Please leave a Feedback for Us
			</h2>

			<p className="mt-3 mb-2">How would you rate our services</p>

			<StarRating />

			{state.errors?.rating && (
				<InputError className="mt-2">{state.errors.rating}</InputError>
			)}

			<p className="mt-8 mb-3 text-sm font-[400]">Leave a comment</p>

			<textarea
				rows={5}
				name="comment"
				placeholder="Enter comment here..."
				className="w-full px-4 py-2 font-light text-sm placeholder-[#6C757D] placeholder:italic border border-[#CCCCCC] rounded-lg"
			/>

			{state.errors?.comment && (
				<InputError>{state.errors.comment}</InputError>
			)}
			{state.errors?.jobId && (
				<InputError>{state.errors.jobId}</InputError>
			)}

			<div className="text-right mt-3">
				<button
					type="submit"
					disabled={pending}
					className="bg-[#09B0B5] text-white p-[13px] w-[169px] rounded-lg disabled:cursor-wait disabled:bg-gray-100 disabled:text-gray-300"
				>
					Submit
				</button>
			</div>
		</form>
	);
};

export default JobRatingForm;
