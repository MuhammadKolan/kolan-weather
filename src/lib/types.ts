// Weather Types

export interface GeoLocation {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation: number;
  feature_code: string;
  country_code: string;
  country: string;
  admin1?: string;
  admin2?: string;
  admin3?: string;
  timezone: string;
  population?: number;
}

export interface WeatherData {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current: CurrentWeather;
  hourly: HourlyWeather;
  daily: DailyWeather;
}

export interface CurrentWeather {
  time: string;
  interval: number;
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  is_day: number;
  precipitation: number;
  rain: number;
  showers: number;
  snowfall: number;
  weather_code: number;
  cloud_cover: number;
  pressure_msl: number;
  surface_pressure: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
  wind_gusts_10m: number;
}

export interface HourlyWeather {
  time: string[];
  temperature_2m: number[];
  relative_humidity_2m: number[];
  apparent_temperature: number[];
  precipitation_probability: number[];
  precipitation: number[];
  rain: number[];
  showers: number[];
  snowfall: number[];
  weather_code: number[];
  cloud_cover: number[];
  visibility: number[];
  wind_speed_10m: number[];
  wind_direction_10m: number[];
  wind_gusts_10m: number[];
  uv_index: number[];
  is_day: number[];
}

export interface DailyWeather {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  apparent_temperature_max: number[];
  apparent_temperature_min: number[];
  sunrise: string[];
  sunset: string[];
  uv_index_max: number[];
  precipitation_sum: number[];
  rain_sum: number[];
  showers_sum: number[];
  snowfall_sum: number[];
  precipitation_probability_max: number[];
  wind_speed_10m_max: number[];
  wind_gusts_10m_max: number[];
  wind_direction_10m_dominant: number[];
}

// City names in multiple languages
export interface CityNames {
  en: string;  // English name
  fa: string;  // Persian/Farsi name
  ku: string;  // Kurdish name
}

export interface SavedCity {
  id: string;
  name: string;  // Default name (English)
  names: CityNames;  // Names in all languages
  country: string;
  admin1?: string;
  latitude: number;
  longitude: number;
  timezone?: string;
}

export type TemperatureUnit = 'celsius' | 'fahrenheit';

export type ThemeMode = 'light' | 'dark' | 'auto';

export interface Settings {
  language: 'fa' | 'en' | 'ku';
  temperatureUnit: TemperatureUnit;
  theme: ThemeMode;
}
