import { useState } from "react";
import { useCities } from "./hooks/useCity";
import { useWeather } from "./hooks/useWeather";

export type TCity = {
	lat: string;
	lng: string;
	name: string;
};

export type TCityWeather = {
	temperature: string;
	humidity: string;
	condition: string;
};

interface WeatherProps {
	city: TCity;
}

function Weather({ city }: WeatherProps) {
	const queryWeather = useWeather({ lat: city.lat, lng: city.lng });
	if (queryWeather.isPending) return <p>Loading weather...</p>;
	if (queryWeather.isError)
		return <p role="alert">{`Error: ${queryWeather.error.message}`}</p>;
	const weather = queryWeather.data;
	return (
		<dl style={{ display: "flex" }}>
			<dt>temperature</dt>
			<dd>{weather.temperature}</dd>
			<dt>humidity</dt>
			<dd>{weather.humidity}</dd>
			<dt>condition</dt>
			<dd>{weather.condition}</dd>
		</dl>
	);
}

// Names aren't unique (e.g. two Barcelonas); coordinates are.
function cityId(city: TCity) {
	return `${city.lat},${city.lng}`;
}

interface SelectCityProps {
	value: TCity | null;
	onSelect: (city: TCity | null) => void;
}
function SelectCity({ value, onSelect }: SelectCityProps) {
	const queryCities = useCities();
	if (queryCities.isPending) return <p>Loading cities...</p>;
	if (queryCities.isError)
		return <p role="alert">{`Error: ${queryCities.error.message}`}</p>;
	const cities = queryCities.data;

	return (
		<select
			value={value ? cityId(value) : ""}
			onChange={(e) => {
				const city = cities.find((city) => cityId(city) === e.target.value);
				onSelect(city === undefined ? null : city);
			}}
		>
			<option value="">Select a city</option>
			{cities.map((city) => (
				<option key={cityId(city)} value={cityId(city)}>
					{city.name}
				</option>
			))}
		</select>
	);
}

export function WeatherWidget() {
	const [city, setCity] = useState<TCity | null>(null);
	return (
		<div>
			<SelectCity value={city} onSelect={setCity} />
			<div>{city && <Weather city={city} />}</div>
		</div>
	);
}
