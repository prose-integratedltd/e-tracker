import { redirect } from "next/navigation";

const trackAction = async (data: FormData) => {
	"use server";

	const id = data.get("trackingId")?.toString().trim();

	if (!id) return redirect("/?error=Tracking ID is required");

	redirect(`/track/${id}`);
};

export default trackAction;
