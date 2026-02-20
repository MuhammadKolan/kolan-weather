'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  MapPin,
  Settings,
  Sun,
  Moon,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudFog,
  Droplets,
  Wind,
  Thermometer,
  Eye,
  Gauge,
  Sunrise,
  Sunset,
  ChevronLeft,
  ChevronRight,
  X,
  Plus,
  Trash2,
  Star,
  Navigation,
  RefreshCw,
  Home,
} from 'lucide-react';
import { languages, translations, getDirection, Language } from '@/lib/i18n';
import { WeatherData, GeoLocation, SavedCity, TemperatureUnit, ThemeMode } from '@/lib/types';

// Weather code to condition mapping
const weatherConditions: Record<number, { en: string; icon: typeof Sun; gradient: string }> = {
  0: { en: 'Clear sky', icon: Sun, gradient: 'day-gradient' },
  1: { en: 'Mainly clear', icon: Sun, gradient: 'day-gradient' },
  2: { en: 'Partly cloudy', icon: Cloud, gradient: 'day-gradient' },
  3: { en: 'Overcast', icon: Cloud, gradient: 'cloudy' },
  45: { en: 'Fog', icon: CloudFog, gradient: 'foggy' },
  48: { en: 'Depositing rime fog', icon: CloudFog, gradient: 'foggy' },
  51: { en: 'Drizzle: Light', icon: CloudRain, gradient: 'rainy' },
  53: { en: 'Drizzle: Moderate', icon: CloudRain, gradient: 'rainy' },
  55: { en: 'Drizzle: Dense', icon: CloudRain, gradient: 'rainy' },
  56: { en: 'Freezing Drizzle: Light', icon: CloudRain, gradient: 'rainy' },
  57: { en: 'Freezing Drizzle: Dense', icon: CloudRain, gradient: 'rainy' },
  61: { en: 'Rain: Slight', icon: CloudRain, gradient: 'rainy' },
  63: { en: 'Rain: Moderate', icon: CloudRain, gradient: 'rainy' },
  65: { en: 'Rain: Heavy', icon: CloudRain, gradient: 'rainy' },
  66: { en: 'Freezing Rain: Light', icon: CloudRain, gradient: 'rainy' },
  67: { en: 'Freezing Rain: Heavy', icon: CloudRain, gradient: 'rainy' },
  71: { en: 'Snow fall: Slight', icon: CloudSnow, gradient: 'snowy' },
  73: { en: 'Snow fall: Moderate', icon: CloudSnow, gradient: 'snowy' },
  75: { en: 'Snow fall: Heavy', icon: CloudSnow, gradient: 'snowy' },
  77: { en: 'Snow grains', icon: CloudSnow, gradient: 'snowy' },
  80: { en: 'Rain showers: Slight', icon: CloudRain, gradient: 'rainy' },
  81: { en: 'Rain showers: Moderate', icon: CloudRain, gradient: 'rainy' },
  82: { en: 'Rain showers: Violent', icon: CloudRain, gradient: 'stormy' },
  85: { en: 'Snow showers: Slight', icon: CloudSnow, gradient: 'snowy' },
  86: { en: 'Snow showers: Heavy', icon: CloudSnow, gradient: 'snowy' },
  95: { en: 'Thunderstorm', icon: CloudLightning, gradient: 'stormy' },
  96: { en: 'Thunderstorm with hail', icon: CloudLightning, gradient: 'stormy' },
  99: { en: 'Thunderstorm with heavy hail', icon: CloudLightning, gradient: 'stormy' },
};

// Wind direction conversion
const getWindDirection = (degrees: number, t: (key: string) => string): string => {
  const directions = [
    t('north') || 'N',
    t('northEast') || 'NE',
    t('east') || 'E',
    t('southEast') || 'SE',
    t('south') || 'S',
    t('southWest') || 'SW',
    t('west') || 'W',
    t('northWest') || 'NW',
  ];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
};

// Temperature conversion
const convertTemp = (temp: number, unit: TemperatureUnit): number => {
  if (unit === 'fahrenheit') {
    return Math.round((temp * 9) / 5 + 32);
  }
  return Math.round(temp);
};

// Weather Icon Component
const WeatherIcon = ({ code, size = 24, isNight = false }: { code: number; size?: number; isNight?: boolean }) => {
  const condition = weatherConditions[code] || weatherConditions[0];
  const IconComponent = condition.icon;
  
  if (isNight && (code === 0 || code === 1)) {
    return <Moon size={size} className="text-yellow-200" />;
  }
  
  return (
    <IconComponent 
      size={size} 
      className={`
        ${code === 0 || code === 1 ? 'text-yellow-400 sun-icon' : ''}
        ${code >= 2 && code <= 3 ? 'text-gray-300 cloud-icon' : ''}
        ${code >= 45 && code <= 48 ? 'text-gray-400' : ''}
        ${code >= 51 && code <= 67 ? 'text-blue-300' : ''}
        ${code >= 71 && code <= 86 ? 'text-white' : ''}
        ${code >= 95 ? 'text-yellow-400 lightning-icon' : ''}
      `}
    />
  );
};

// Get weather description
const getWeatherDescription = (code: number, t: (key: string) => string): string => {
  const descriptions: Record<number, string> = {
    0: t('clearSky'),
    1: t('mainlyClear'),
    2: t('partlyCloudy'),
    3: t('overcast'),
    45: t('fog'),
    48: t('fog'),
    51: t('drizzle'),
    53: t('drizzle'),
    55: t('drizzle'),
    56: t('freezingDrizzle'),
    57: t('freezingDrizzle'),
    61: t('rain'),
    63: t('rain'),
    65: t('rain'),
    66: t('freezingRain'),
    67: t('freezingRain'),
    71: t('snow'),
    73: t('snow'),
    75: t('snow'),
    77: t('snowGrains'),
    80: t('rainShowers'),
    81: t('rainShowers'),
    82: t('rainShowers'),
    85: t('snowShowers'),
    86: t('snowShowers'),
    95: t('thunderstorm'),
    96: t('thunderstorm'),
    99: t('thunderstorm'),
  };
  return descriptions[code] || t('clearSky');
};

export default function WeatherApp() {
  // State
  const [language, setLanguage] = useState<Language>('ku');
  const [temperatureUnit, setTemperatureUnit] = useState<TemperatureUnit>('celsius');
  const [theme, setTheme] = useState<ThemeMode>('auto');
  const [isDark, setIsDark] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GeoLocation[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  
  const [selectedCity, setSelectedCity] = useState<GeoLocation | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [savedCities, setSavedCities] = useState<SavedCity[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [activeTab, setActiveTab] = useState<'hourly' | 'daily'>('hourly');

  // Translation helper
  const t = useCallback((key: string): string => {
    return translations[language][key] || translations['en'][key] || key;
  }, [language]);

  // Direction
  const dir = getDirection(language);

  // Load saved cities from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('weather-saved-cities');
    if (saved) {
      setSavedCities(JSON.parse(saved));
    }
    
    const savedSettings = localStorage.getItem('weather-settings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setLanguage(settings.language || 'ku');
      setTemperatureUnit(settings.temperatureUnit || 'celsius');
      setTheme(settings.theme || 'auto');
    }
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('weather-settings', JSON.stringify({
      language,
      temperatureUnit,
      theme,
    }));
  }, [language, temperatureUnit, theme]);

  // Save cities to localStorage
  useEffect(() => {
    localStorage.setItem('weather-saved-cities', JSON.stringify(savedCities));
  }, [savedCities]);

  // Theme effect
  useEffect(() => {
    const checkDark = () => {
      if (theme === 'dark') {
        setIsDark(true);
      } else if (theme === 'light') {
        setIsDark(false);
      } else {
        const hour = new Date().getHours();
        setIsDark(hour < 6 || hour >= 18);
      }
    };
    
    checkDark();
    const interval = setInterval(checkDark, 60000);
    return () => clearInterval(interval);
  }, [theme]);

  // Search cities
  const searchCities = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    try {
      // Search in the current language if it's Persian or English
      const searchLang = language === 'fa' ? 'fa' : 'en';
      const response = await fetch(`/api/weather?action=search&q=${encodeURIComponent(query)}&lang=${searchLang}`);
      const data = await response.json();
      setSearchResults(data.results || []);
    } catch (err) {
      console.error('Search error:', err);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [language]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        searchCities(searchQuery);
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchQuery, searchCities]);

  // Fetch weather data
  const fetchWeather = useCallback(async (lat: number, lon: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/weather?action=weather&lat=${lat}&lon=${lon}`);
      if (!response.ok) throw new Error('Failed to fetch weather');
      const data = await response.json();
      setWeatherData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('networkError'));
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  // Select city
  const selectCity = useCallback((city: GeoLocation) => {
    setSelectedCity(city);
    setShowSearch(false);
    setSearchQuery('');
    setSearchResults([]);
    fetchWeather(city.latitude, city.longitude);
  }, [fetchWeather]);

  // Go back to home
  const goHome = useCallback(() => {
    setSelectedCity(null);
    setWeatherData(null);
    setError(null);
  }, []);

  // Get current location
  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError(t('locationDenied'));
      return;
    }
    
    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setSelectedCity({
          id: 0,
          name: t('currentLocation'),
          latitude,
          longitude,
          country: '',
          elevation: 0,
          feature_code: '',
          country_code: '',
          timezone: '',
        });
        fetchWeather(latitude, longitude);
      },
      () => {
        setError(t('locationDenied'));
        setIsLoading(false);
      }
    );
  }, [fetchWeather, t]);

  // Save city with multi-language names
  const saveCity = useCallback(async (city: GeoLocation) => {
    // Fetch city names in all languages
    let cityNames = {
      en: city.name,
      fa: city.name,
      ku: city.name,
    };

    try {
      // Search for the city in all languages
      const langPromises = ['en', 'fa'].map(async (lang) => {
        const response = await fetch(
          `/api/weather?action=search&q=${encodeURIComponent(city.name)}&lang=${lang}`
        );
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          const match = data.results.find((r: GeoLocation) => 
            Math.abs(r.latitude - city.latitude) < 0.1 && 
            Math.abs(r.longitude - city.longitude) < 0.1
          );
          return { lang, name: match?.name || city.name };
        }
        return { lang, name: city.name };
      });

      const results = await Promise.all(langPromises);
      results.forEach((result) => {
        cityNames[result.lang as 'en' | 'fa'] = result.name;
      });

      // For Kurdish, try to get from Persian or use English
      cityNames.ku = cityNames.fa || cityNames.en;
    } catch (err) {
      console.error('Error fetching city names:', err);
    }

    const newCity: SavedCity = {
      id: `${city.id}-${Date.now()}`,
      name: city.name,
      names: cityNames,
      country: city.country,
      admin1: city.admin1,
      latitude: city.latitude,
      longitude: city.longitude,
      timezone: city.timezone,
    };
    setSavedCities(prev => [...prev, newCity]);
  }, []);

  // Remove saved city
  const removeCity = useCallback((id: string) => {
    setSavedCities(prev => prev.filter(c => c.id !== id));
  }, []);

  // Check if city is saved
  const isCitySaved = useMemo(() => {
    if (!selectedCity) return false;
    return savedCities.some(c => 
      c.latitude === selectedCity.latitude && c.longitude === selectedCity.longitude
    );
  }, [selectedCity, savedCities]);

  // Get city name in current language
  const getCityName = useCallback((city: SavedCity | GeoLocation): string => {
    // If city has names property, use it
    if ('names' in city && city.names) {
      return city.names[language] || city.name;
    }
    // Otherwise, check if this city is in saved cities
    const savedCity = savedCities.find(c => 
      Math.abs(c.latitude - city.latitude) < 0.01 && 
      Math.abs(c.longitude - city.longitude) < 0.01
    );
    if (savedCity?.names) {
      return savedCity.names[language] || savedCity.name;
    }
    return city.name;
  }, [language, savedCities]);

  // Get hourly data for next 24 hours
  const hourlyData = useMemo(() => {
    if (!weatherData) return [];
    const currentHour = new Date().getHours();
    const startIndex = weatherData.hourly.time.findIndex(t => 
      new Date(t).getHours() === currentHour
    );
    return weatherData.hourly.time.slice(startIndex, startIndex + 24).map((_, i) => ({
      time: weatherData.hourly.time[startIndex + i],
      temp: weatherData.hourly.temperature_2m[startIndex + i],
      weatherCode: weatherData.hourly.weather_code[startIndex + i],
      isDay: weatherData.hourly.is_day[startIndex + i],
      precipitation: weatherData.hourly.precipitation_probability[startIndex + i],
    }));
  }, [weatherData]);

  // Get gradient based on weather
  const bgGradient = useMemo(() => {
    if (!weatherData) return isDark ? 'night-gradient' : 'day-gradient';
    const code = weatherData.current.weather_code;
    const condition = weatherConditions[code];
    const isNight = weatherData.current.is_day === 0;
    
    if (isNight && (code === 0 || code === 1 || code === 2)) {
      return 'night-gradient';
    }
    
    return condition?.gradient || (isDark ? 'night-gradient' : 'day-gradient');
  }, [weatherData, isDark]);

  // Format time
  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString(language === 'fa' ? 'fa-IR' : language === 'ku' ? 'ku-IQ' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const dayName = translations[language].days[date.getDay()];
    const day = date.getDate();
    return { dayName, day };
  };

  return (
    <div dir={dir} className={`min-h-screen relative overflow-hidden ${isDark ? 'text-white' : 'text-gray-900'}`}>
      {/* Animated Background */}
      <div className={`animated-bg ${bgGradient}`} />
      
      {/* Main Content */}
      <div className="relative z-10 min-h-screen p-4 md:p-8 max-w-4xl mx-auto">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              <Sun className="w-8 h-8 text-yellow-400" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold">{t('appName')}</h1>
              <p className="text-sm opacity-80">{t('appSlogan')}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {selectedCity && (
              <button
                onClick={goHome}
                className="p-3 rounded-full glass hover:scale-105 transition-transform"
                title={t('home') || 'Home'}
              >
                <Home className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={getCurrentLocation}
              className="p-3 rounded-full glass hover:scale-105 transition-transform"
              title={t('useMyLocation')}
            >
              <Navigation className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowSearch(true)}
              className="p-3 rounded-full glass hover:scale-105 transition-transform"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowSettings(true)}
              className="p-3 rounded-full glass hover:scale-105 transition-transform"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </motion.header>

        {/* Search Modal */}
        <AnimatePresence>
          {showSearch && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/50"
              onClick={() => setShowSearch(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="w-full max-w-md glass rounded-2xl overflow-hidden"
                onClick={e => e.stopPropagation()}
              >
                <div className="p-4">
                  <div className="relative">
                    <Search className={`absolute ${dir === 'rtl' ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-5 h-5 opacity-50`} />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder={t('searchCity')}
                      className={`w-full ${dir === 'rtl' ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 bg-white/20 rounded-xl border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 placeholder-white/60`}
                      autoFocus
                    />
                    {searchQuery && (
                      <button
                        onClick={() => { setSearchQuery(''); setSearchResults([]); }}
                        className={`absolute ${dir === 'rtl' ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2`}
                      >
                        <X className="w-5 h-5 opacity-50 hover:opacity-100" />
                      </button>
                    )}
                  </div>
                  
                  {/* Search Results */}
                  <div className="mt-4 max-h-96 overflow-auto">
                    {isSearching ? (
                      <div className="text-center py-8 opacity-60">
                        <RefreshCw className="w-6 h-6 mx-auto animate-spin" />
                        <p className="mt-2">{t('searching')}</p>
                      </div>
                    ) : searchResults.length > 0 ? (
                      <div className="space-y-2">
                        {searchResults.map((city) => (
                          <motion.button
                            key={city.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => selectCity(city)}
                            className="w-full p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-left"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">{city.name}</p>
                                <p className="text-sm opacity-70">
                                  {city.admin1 ? `${city.admin1}, ` : ''}{city.country}
                                </p>
                              </div>
                              <Plus className="w-5 h-5 opacity-50" />
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    ) : searchQuery.length >= 2 ? (
                      <div className="text-center py-8 opacity-60">
                        <p>{t('noResults')}</p>
                      </div>
                    ) : (
                      <div className="text-center py-8 opacity-60">
                        <MapPin className="w-8 h-8 mx-auto mb-2" />
                        <p>{t('searchCity')}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Saved Cities */}
                {savedCities.length > 0 && (
                  <div className="border-t border-white/20 p-4">
                    <p className="text-sm font-medium mb-2 opacity-70">{t('savedCities')}</p>
                    <div className="space-y-2">
                      {savedCities.map((city) => (
                        <div
                          key={city.id}
                          className="flex items-center justify-between p-2 rounded-lg bg-white/10"
                        >
                          <button
                            onClick={() => {
                              selectCity({
                                ...city,
                                id: parseInt(city.id) || 0,
                                elevation: 0,
                                feature_code: '',
                                country_code: '',
                              });
                              setShowSearch(false);
                            }}
                            className="flex-1 text-left"
                          >
                            <p className="font-medium">{getCityName(city)}</p>
                            <p className="text-xs opacity-70">{city.country}</p>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeCity(city.id);
                            }}
                            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4 opacity-50" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Settings Modal */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
              onClick={() => setShowSettings(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="w-full max-w-md bg-gray-900/95 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/10"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">{t('settings')}</h2>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                {/* Language */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2 opacity-70">{t('language')}</label>
                  <div className="grid grid-cols-3 gap-2">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => setLanguage(lang.code)}
                        className={`p-3 rounded-xl transition-all ${
                          language === lang.code
                            ? 'bg-white/30 ring-2 ring-white'
                            : 'bg-white/10 hover:bg-white/20'
                        }`}
                      >
                        <p className="font-medium">{lang.nativeName}</p>
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Temperature Unit */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2 opacity-70">{t('temperatureUnit')}</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setTemperatureUnit('celsius')}
                      className={`p-3 rounded-xl transition-all ${
                        temperatureUnit === 'celsius'
                          ? 'bg-white/30 ring-2 ring-white'
                          : 'bg-white/10 hover:bg-white/20'
                      }`}
                    >
                      <p className="font-medium">°C ({t('celsius')})</p>
                    </button>
                    <button
                      onClick={() => setTemperatureUnit('fahrenheit')}
                      className={`p-3 rounded-xl transition-all ${
                        temperatureUnit === 'fahrenheit'
                          ? 'bg-white/30 ring-2 ring-white'
                          : 'bg-white/10 hover:bg-white/20'
                      }`}
                    >
                      <p className="font-medium">°F ({t('fahrenheit')})</p>
                    </button>
                  </div>
                </div>
                
                {/* Theme */}
                <div>
                  <label className="block text-sm font-medium mb-2 opacity-70">{t('theme')}</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setTheme('light')}
                      className={`p-3 rounded-xl transition-all flex flex-col items-center gap-1 ${
                        theme === 'light'
                          ? 'bg-white/30 ring-2 ring-white'
                          : 'bg-white/10 hover:bg-white/20'
                      }`}
                    >
                      <Sun className="w-5 h-5" />
                      <p className="text-sm">{t('lightMode')}</p>
                    </button>
                    <button
                      onClick={() => setTheme('dark')}
                      className={`p-3 rounded-xl transition-all flex flex-col items-center gap-1 ${
                        theme === 'dark'
                          ? 'bg-white/30 ring-2 ring-white'
                          : 'bg-white/10 hover:bg-white/20'
                      }`}
                    >
                      <Moon className="w-5 h-5" />
                      <p className="text-sm">{t('darkMode')}</p>
                    </button>
                    <button
                      onClick={() => setTheme('auto')}
                      className={`p-3 rounded-xl transition-all flex flex-col items-center gap-1 ${
                        theme === 'auto'
                          ? 'bg-white/30 ring-2 ring-white'
                          : 'bg-white/10 hover:bg-white/20'
                      }`}
                    >
                      <RefreshCw className="w-5 h-5" />
                      <p className="text-sm">{t('autoMode')}</p>
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading State */}
        {isLoading && !weatherData && (
          <div className="flex items-center justify-center min-h-[60vh]">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <RefreshCw className="w-12 h-12" />
            </motion.div>
          </div>
        )}

        {/* Error State */}
        {error && !weatherData && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center min-h-[60vh] text-center"
          >
            <Cloud className="w-16 h-16 mb-4 opacity-50" />
            <p className="text-xl font-medium mb-2">{t('error')}</p>
            <p className="opacity-70 mb-4">{error}</p>
            <button
              onClick={() => selectedCity && fetchWeather(selectedCity.latitude, selectedCity.longitude)}
              className="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl transition-colors"
            >
              {t('tryAgain')}
            </button>
          </motion.div>
        )}

        {/* Weather Content */}
        {weatherData && selectedCity && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Current Weather Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass rounded-3xl p-6 weather-card"
            >
              {/* City Name & Save Button */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold">{getCityName(selectedCity)}</h2>
                  <p className="opacity-70">
                    {selectedCity.admin1 ? `${selectedCity.admin1}, ` : ''}{selectedCity.country}
                  </p>
                </div>
                <button
                  onClick={() => isCitySaved ? removeCity(savedCities.find(c => 
                    c.latitude === selectedCity.latitude && c.longitude === selectedCity.longitude
                  )?.id || '') : saveCity(selectedCity)}
                  className="p-3 rounded-full hover:bg-white/20 transition-colors"
                  title={isCitySaved ? t('removeCity') : t('addCity')}
                >
                  <Star className={`w-6 h-6 ${isCitySaved ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                </button>
              </div>
              
              {/* Main Weather Display */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-start">
                    <span className="text-7xl md:text-8xl font-light weather-temp">
                      {convertTemp(weatherData.current.temperature_2m, temperatureUnit)}
                    </span>
                    <span className="text-2xl mt-2">°{temperatureUnit === 'celsius' ? 'C' : 'F'}</span>
                  </div>
                  <p className="text-xl opacity-80 mt-2">
                    {getWeatherDescription(weatherData.current.weather_code, t)}
                  </p>
                  <p className="opacity-60">
                    {t('feelsLike')}: {convertTemp(weatherData.current.apparent_temperature, temperatureUnit)}°
                  </p>
                </div>
                
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="floating"
                >
                  <WeatherIcon 
                    code={weatherData.current.weather_code} 
                    size={100} 
                    isNight={weatherData.current.is_day === 0}
                  />
                </motion.div>
              </div>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="bg-white/10 rounded-xl p-3 text-center">
                  <Droplets className="w-5 h-5 mx-auto mb-1 opacity-70" />
                  <p className="text-sm opacity-70">{t('humidity')}</p>
                  <p className="font-bold">{weatherData.current.relative_humidity_2m}%</p>
                </div>
                <div className="bg-white/10 rounded-xl p-3 text-center">
                  <Wind className="w-5 h-5 mx-auto mb-1 opacity-70" />
                  <p className="text-sm opacity-70">{t('wind')}</p>
                  <p className="font-bold">{weatherData.current.wind_speed_10m} km/h</p>
                </div>
                <div className="bg-white/10 rounded-xl p-3 text-center">
                  <Gauge className="w-5 h-5 mx-auto mb-1 opacity-70" />
                  <p className="text-sm opacity-70">{t('pressure')}</p>
                  <p className="font-bold">{Math.round(weatherData.current.pressure_msl)} hPa</p>
                </div>
              </div>
            </motion.div>

            {/* Hourly/Daily Tabs */}
            <div className="glass rounded-2xl p-4">
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setActiveTab('hourly')}
                  className={`flex-1 py-2 px-4 rounded-xl transition-all ${
                    activeTab === 'hourly' ? 'bg-white/30 font-medium' : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  {t('hourly')}
                </button>
                <button
                  onClick={() => setActiveTab('daily')}
                  className={`flex-1 py-2 px-4 rounded-xl transition-all ${
                    activeTab === 'daily' ? 'bg-white/30 font-medium' : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  {t('daily')}
                </button>
              </div>
              
              {/* Hourly Forecast */}
              {activeTab === 'hourly' && (
                <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
                  {hourlyData.map((hour, i) => (
                    <motion.div
                      key={hour.time}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex-shrink-0 bg-white/10 rounded-xl p-3 text-center min-w-[80px]"
                    >
                      <p className="text-sm opacity-70">
                        {i === 0 ? t('today') : formatTime(hour.time)}
                      </p>
                      <WeatherIcon code={hour.weatherCode} size={32} isNight={hour.isDay === 0} />
                      <p className="font-bold">{convertTemp(hour.temp, temperatureUnit)}°</p>
                      {hour.precipitation > 0 && (
                        <p className="text-xs text-blue-300">{hour.precipitation}%</p>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
              
              {/* Daily Forecast */}
              {activeTab === 'daily' && (
                <div className="space-y-2">
                  {weatherData.daily.time.map((date, i) => (
                    <motion.div
                      key={date}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center justify-between bg-white/10 rounded-xl p-3"
                    >
                      <div className="flex items-center gap-3">
                        <WeatherIcon 
                          code={weatherData.daily.weather_code[i]} 
                          size={32}
                          isNight={false}
                        />
                        <div>
                          <p className="font-medium">
                            {i === 0 ? t('today') : formatDate(date).dayName}
                          </p>
                          <p className="text-xs opacity-70">{formatDate(date).day}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        {weatherData.daily.precipitation_probability_max[i] > 0 && (
                          <span className="text-blue-300 text-sm">
                            {weatherData.daily.precipitation_probability_max[i]}%
                          </span>
                        )}
                        <div className="flex items-center gap-2">
                          <span className="font-bold">
                            {convertTemp(weatherData.daily.temperature_2m_max[i], temperatureUnit)}°
                          </span>
                          <span className="opacity-50">
                            {convertTemp(weatherData.daily.temperature_2m_min[i], temperatureUnit)}°
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Weather Details */}
            <div className="grid grid-cols-2 gap-4">
              {/* Sunrise/Sunset */}
              <div className="glass rounded-2xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Sunrise className="w-5 h-5 text-orange-400" />
                  <div>
                    <p className="text-sm opacity-70">{t('sunrise')}</p>
                    <p className="font-bold">{formatTime(weatherData.daily.sunrise[0])}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Sunset className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="text-sm opacity-70">{t('sunset')}</p>
                    <p className="font-bold">{formatTime(weatherData.daily.sunset[0])}</p>
                  </div>
                </div>
              </div>
              
              {/* UV Index */}
              <div className="glass rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sun className="w-5 h-5 text-yellow-400" />
                  <p className="text-sm opacity-70">{t('uvIndex')}</p>
                </div>
                <p className="text-3xl font-bold mb-2">
                  {weatherData.daily.uv_index_max[0].toFixed(1)}
                </p>
                <div className="h-2 rounded-full bg-white/20 overflow-hidden">
                  <div 
                    className="h-full uv-bar rounded-full transition-all"
                    style={{ width: `${Math.min(weatherData.daily.uv_index_max[0] * 10, 100)}%` }}
                  />
                </div>
              </div>
              
              {/* Wind Details */}
              <div className="glass rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Wind className="w-5 h-5" />
                  <p className="text-sm opacity-70">{t('wind')}</p>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">{weatherData.current.wind_speed_10m} km/h</p>
                    <p className="text-sm opacity-70">{t('windGusts')}: {weatherData.current.wind_gusts_10m} km/h</p>
                  </div>
                  <motion.div
                    style={{ transform: `rotate(${weatherData.current.wind_direction_10m}deg)` }}
                    className="p-3 bg-white/20 rounded-full"
                  >
                    <Navigation className="w-6 h-6" />
                  </motion.div>
                </div>
              </div>
              
              {/* Visibility & Cloud Cover */}
              <div className="glass rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="w-5 h-5" />
                  <p className="text-sm opacity-70">{t('visibility')}</p>
                </div>
                <p className="text-2xl font-bold mb-1">
                  {weatherData.hourly.visibility[0] / 1000} km
                </p>
                <div className="flex items-center gap-2">
                  <Cloud className="w-4 h-4 opacity-70" />
                  <p className="text-sm opacity-70">
                    {t('cloudCover') || 'Cloud'}: {weatherData.current.cloud_cover}%
                  </p>
                </div>
              </div>
            </div>

            {/* Last Updated */}
            <p className="text-center opacity-50 text-sm">
              {t('lastUpdated')}: {formatTime(weatherData.current.time)}
            </p>
          </motion.div>
        )}

        {/* Initial State */}
        {!selectedCity && !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center min-h-[60vh] text-center"
          >
            <motion.div
              animate={{ 
                y: [0, -20, 0],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <Cloud className="w-24 h-24 mb-6 opacity-80" />
            </motion.div>
            <h2 className="text-2xl font-bold mb-2">{t('appName')}</h2>
            <p className="opacity-70 mb-8 max-w-md">
              {t('searchCity')}
            </p>
            
            {/* Saved Cities List (Max 3) */}
            {savedCities.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md mb-6"
              >
                <p className="text-sm font-medium mb-3 opacity-70">{t('savedCities')}</p>
                <div className="grid gap-3">
                  {savedCities.slice(0, 3).map((city) => (
                    <motion.button
                      key={city.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        selectCity({
                          ...city,
                          id: parseInt(city.id) || 0,
                          elevation: 0,
                          feature_code: '',
                          country_code: '',
                        });
                      }}
                      className="glass rounded-xl p-4 flex items-center justify-between hover:bg-white/20 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 opacity-70" />
                        <div className="text-left">
                          <p className="font-medium">{getCityName(city)}</p>
                          <p className="text-sm opacity-70">
                            {city.admin1 ? `${city.admin1}, ` : ''}{city.country}
                          </p>
                        </div>
                      </div>
                      <ChevronLeft className={`w-5 h-5 opacity-50 ${dir === 'rtl' ? '' : 'rotate-180'}`} />
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
            
            <div className="flex gap-4">
              <button
                onClick={getCurrentLocation}
                className="flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl transition-colors"
              >
                <Navigation className="w-5 h-5" />
                {t('useMyLocation')}
              </button>
              <button
                onClick={() => setShowSearch(true)}
                className="flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl transition-colors"
              >
                <Search className="w-5 h-5" />
                {t('search')}
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
