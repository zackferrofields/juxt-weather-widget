import { type ReactNode, useId, useState } from "react";
import { useCities } from "./hooks/useCity";
import { useWeather } from "./hooks/useWeather";
import "./WeatherWidget.css";

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

const conditionIcons: Record<string, string> = {
	sunny: "☀️",
	cloudy: "☁️",
	rainy: "🌧️",
	snowy: "❄️",
};

interface WeatherProps {
	city: TCity;
}

function Weather({ city }: WeatherProps) {
	const queryWeather = useWeather({ lat: city.lat, lng: city.lng });

	if (queryWeather.isPending) {
		return (
			<section className="weather-card weather-card--loading" aria-busy="true">
				<p>Loading weather for {city.name}...</p>
			</section>
		);
	}

	if (queryWeather.isError) {
		return (
			<section className="weather-card weather-card--error" role="alert">
				<h2 className="weather-city">Couldn't load weather for {city.name}</h2>
				<p>{queryWeather.error.message}</p>
			</section>
		);
	}

	const weather = queryWeather.data;
	const condition = weather.condition.toLowerCase();

	return (
		<section
			className="weather-card weather-card--data"
			data-condition={condition}
		>
			<header className="weather-header">
				<h2 className="weather-city">{city.name}</h2>
				<span className="weather-icon" aria-hidden="true">
					{conditionIcons[condition]}
				</span>
			</header>
			<dl className="weather-stats">
				<div className="weather-stat weather-stat--hero">
					<dt>Temperature</dt>
					<dd>{weather.temperature}°C</dd>
				</div>
				<div className="weather-stat">
					<dt>Condition</dt>
					<dd>{weather.condition}</dd>
				</div>
				<div className="weather-stat">
					<dt>Humidity</dt>
					<dd>{weather.humidity}%</dd>
				</div>
			</dl>
		</section>
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
	const selectId = useId();
	const queryCities = useCities();

	let control: ReactNode;
	if (queryCities.isPending) {
		control = <p className="weather-hint">Loading cities...</p>;
	} else if (queryCities.isError) {
		control = (
			<p className="weather-hint" role="alert">
				{`Couldn't load cities: ${queryCities.error.message}`}
			</p>
		);
	} else {
		const cities = queryCities.data;
		control = (
			<select
				id={selectId}
				className="weather-select"
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

	return (
		<div className="weather-field">
			<label className="weather-label" htmlFor={selectId}>
				City
			</label>
			{control}
		</div>
	);
}

export function WeatherWidget() {
	const [city, setCity] = useState<TCity | null>(null);
	return (
		<div className="weather-widget">
			<SelectCity value={city} onSelect={setCity} />
			{city ? (
				<Weather city={city} />
			) : (
				<p className="weather-hint">Pick a city to see its current weather.</p>
			)}
		</div>
	);
}
