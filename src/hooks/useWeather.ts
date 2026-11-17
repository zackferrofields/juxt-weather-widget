import { useQuery } from "@tanstack/react-query";
import type { TCityWeather } from "../WeatherWidget";

interface UseWeatherProps {
	lat: string;
	lng: string;
}

export function useWeather({ lat, lng }: UseWeatherProps) {
	return useQuery({
		queryKey: ["weather", lat, lng],
		queryFn: async () => {
			const response = await fetch(`/api/weather/${lat}/${lng}`);
			if (!response.ok) {
				throw new Error(`Request failed with ${response.status}`);
			}
			const data: TCityWeather = await response.json();
			return data;
		},
	});
}
