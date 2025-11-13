import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_KEY =
	process.env.NEXT_GOOGLE_MAP_API_KEY ??
	"AIzaSyA2dFJZYU8_1M5ps89Vxt7Yyq8oq4-ZtJ0";

const searchGooglePlace = ({ input }: { input: string }) => {
	return axios.get(
		`https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${input}&inputtype=textquery&key=${API_KEY}`
	);
};

export const useSearchGooglePlace = (input: string) => {
	return useQuery({
		queryKey: ["search-place"],
		queryFn: () => searchGooglePlace({ input }),
		retry: 2,
	});
};
