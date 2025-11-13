export const getStatusClass = (status: string) => {
	switch (status) {
		case "Pending":
			return "bg-orange-100 text-orange-600";
		case "InProgress":
			return "bg-blue-100 text-blue-600";
		case "Completed":
			return "bg-green-100 text-green-600";
		case "Open":
			return "bg-yellow-100 text-yellow-600";
		default:
			return "";
	}
};

export const statusTitle = (status: string) => {
	switch (status) {
		case "InProgress":
			return "In Progress";

		default:
			return status;
	}
};
