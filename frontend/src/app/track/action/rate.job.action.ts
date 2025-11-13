"use server";

import ReviewJobDTO, { ReviewJobError } from "../dto/ReviewJobDTO";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export interface RateJobFormState {
	errors?: ReviewJobError;
	review?: JobReview;
}

export interface JobReview {
	id: string;
	jobId: string;
	rating: number;
	comment: string;
}

const rateJobAction = async (
	state: RateJobFormState,
	formData: FormData
): Promise<RateJobFormState> => {
	try {
		const review = new ReviewJobDTO(Object.fromEntries(formData.entries()));

		const response = await fetch(`${baseURL}/job-reviews`, {
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(review),
			method: "POST",
		});

		const data = await response.json();

		return { review: data };
	} catch (errors) {
		return { errors: errors as ReviewJobError };
	}
};

export default rateJobAction;
