import { NextRequest, NextResponse } from 'next/server';

// Open-Meteo Geocoding API (free, no API key needed)
const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';

// Open-Meteo Weather API (free, no API key needed)
const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const action = searchParams.get('action');

  try {
    if (action === 'search') {
      // City search
      const query = searchParams.get('q');
      const lang = searchParams.get('lang') || 'en';
      
      if (!query || query.length < 2) {
        return NextResponse.json({ results: [] });
      }

      const response = await fetch(
        `${GEOCODING_URL}?name=${encodeURIComponent(query)}&count=10&language=${lang}&format=json`
      );
      
      if (!response.ok) {
        throw new Error('Failed to search cities');
      }

      const data = await response.json();
      return NextResponse.json(data);
    } 
    
    else if (action === 'city-names') {
      // Get city name in multiple languages
      const lat = searchParams.get('lat');
      const lon = searchParams.get('lon');
      const name = searchParams.get('name');
      
      if (!lat || !lon) {
        return NextResponse.json({ error: 'Missing coordinates' }, { status: 400 });
      }

      // Fetch names in all 3 languages
      const languages = ['en', 'fa', 'ku'];
      const names: Record<string, string> = { en: name || '', fa: name || '', ku: name || '' };
      
      // Try to get localized names from reverse geocoding
      // Open-Meteo doesn't have a reverse geocoding API, so we'll search nearby
      const searchPromises = languages.map(async (lang) => {
        try {
          // Search for cities near these coordinates
          const response = await fetch(
            `${GEOCODING_URL}?name=${encodeURIComponent(name || '')}&count=5&language=${lang}&format=json`
          );
          const data = await response.json();
          
          if (data.results && data.results.length > 0) {
            // Find the closest match
            const closest = data.results.find((r: { latitude: number; longitude: number }) => 
              Math.abs(r.latitude - parseFloat(lat)) < 0.1 && 
              Math.abs(r.longitude - parseFloat(lon)) < 0.1
            );
            if (closest) {
              return { lang, name: closest.name };
            }
          }
          return { lang, name: name || '' };
        } catch {
          return { lang, name: name || '' };
        }
      });

      const results = await Promise.all(searchPromises);
      results.forEach((result) => {
        if (result.name) {
          names[result.lang] = result.name;
        }
      });

      return NextResponse.json({ names });
    }

    else if (action === 'weather') {
      // Get weather data
      const lat = searchParams.get('lat');
      const lon = searchParams.get('lon');
      
      if (!lat || !lon) {
        return NextResponse.json({ error: 'Missing coordinates' }, { status: 400 });
      }

      const params = new URLSearchParams({
        latitude: lat,
        longitude: lon,
        current: 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m',
        hourly: 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,precipitation,rain,showers,snowfall,weather_code,cloud_cover,visibility,wind_speed_10m,wind_direction_10m,wind_gusts_10m,uv_index,is_day',
        daily: 'weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant',
        timezone: 'auto',
        forecast_days: '7',
        forecast_hours: '48'
      });

      const response = await fetch(`${WEATHER_URL}?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }

      const data = await response.json();
      return NextResponse.json(data);
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
