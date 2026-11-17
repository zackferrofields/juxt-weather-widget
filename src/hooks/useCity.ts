import { useQuery } from "@tanstack/react-query";
import type { TCity } from "../WeatherWidget";

export function useCities() {
	return useQuery({
		queryKey: ["cities"],
		queryFn: async () => {
			const response = await fetch("/api/cities");
			if (!response.ok) {
				throw new Error(`Request failed with ${response.status}`);
			}
			const data: TCity[] = await response.json();
			return data;
		},
	});
}
