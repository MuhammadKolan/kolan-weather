// Multi-language support: Persian, English, Kurdish (Sorani)
export type Language = 'fa' | 'en' | 'ku';

export const languages: { code: Language; name: string; nativeName: string; dir: 'rtl' | 'ltr' }[] = [
  { code: 'fa', name: 'Persian', nativeName: 'فارسی', dir: 'rtl' },
  { code: 'en', name: 'English', nativeName: 'English', dir: 'ltr' },
  { code: 'ku', name: 'Kurdish (Sorani)', nativeName: 'کوردی سورانی', dir: 'rtl' },
];

export const translations: Record<Language, Record<string, string>> = {
  fa: {
    // App
    appName: 'کۆڵان',
    appSlogan: 'پیش‌بینی دقیق آب و هوا',
    home: 'صفحه اصلی',
    
    // Search
    searchCity: 'جستجوی شهر...',
    search: 'جستجو',
    searching: 'در حال جستجو...',
    noResults: 'نتیجه‌ای یافت نشد',
    
    // Weather
    currentWeather: 'آب و هوای فعلی',
    today: 'امروز',
    hourly: 'ساعتی',
    daily: 'هفتگی',
    
    // Weather Conditions
    clearSky: 'آسمان صاف',
    mainlyClear: 'عمدتاً صاف',
    partlyCloudy: 'نیمه ابری',
    overcast: 'ابری',
    fog: 'مه',
    drizzle: 'باران ملایم',
    freezingDrizzle: 'باران یخ‌زده',
    rain: 'باران',
    freezingRain: 'باران یخ‌زده',
    snow: 'برف',
    snowGrains: 'دانه برف',
    rainShowers: 'رگبار',
    snowShowers: 'بارش برف',
    thunderstorm: 'رعد و برق',
    
    // Weather Details
    feelsLike: 'احساس دما',
    humidity: 'رطوبت',
    wind: 'باد',
    windSpeed: 'سرعت باد',
    windDirection: 'جهت باد',
    pressure: 'فشار هوا',
    uvIndex: 'شاخص UV',
    visibility: 'دید',
    sunrise: 'طلوع',
    sunset: 'غروب',
    
    // Units
    celsius: 'سانتی‌گراد',
    fahrenheit: 'فارنهایت',
    kmh: 'کیلومتر/ساعت',
    mph: 'مایل/ساعت',
    
    // Time
    days: ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه', 'شنبه'],
    months: ['ژانویه', 'فوریه', 'مارس', 'آوریل', 'مه', 'ژوئن', 'ژوئیه', 'اوت', 'سپتامبر', 'اکتبر', 'نوامبر', 'دسامبر'],
    
    // Location
    currentLocation: 'موقعیت فعلی',
    useMyLocation: 'استفاده از موقعیت من',
    locationPermission: 'اجازه دسترسی به موقعیت',
    locationDenied: 'دسترسی به موقعیت رد شد',
    
    // Settings
    settings: 'تنظیمات',
    language: 'زبان',
    temperatureUnit: 'واحد دما',
    theme: 'تم',
    darkMode: 'حالت تاریک',
    lightMode: 'حالت روشن',
    autoMode: 'خودکار',
    
    // Saved Cities
    savedCities: 'شهرهای ذخیره شده',
    addCity: 'افزودن شهر',
    removeCity: 'حذف شهر',
    
    // Errors
    error: 'خطا',
    networkError: 'خطای شبکه',
    tryAgain: 'تلاش مجدد',
    
    // Loading
    loading: 'در حال بارگذاری...',
    
    // Last Updated
    lastUpdated: 'آخرین به‌روزرسانی',
  },
  
  en: {
    // App
    appName: 'Kolan',
    appSlogan: 'Accurate Weather Forecast',
    home: 'Home',
    
    // Search
    searchCity: 'Search city...',
    search: 'Search',
    searching: 'Searching...',
    noResults: 'No results found',
    
    // Weather
    currentWeather: 'Current Weather',
    today: 'Today',
    hourly: 'Hourly',
    daily: '7 Days',
    
    // Weather Conditions
    clearSky: 'Clear sky',
    mainlyClear: 'Mainly clear',
    partlyCloudy: 'Partly cloudy',
    overcast: 'Overcast',
    fog: 'Fog',
    drizzle: 'Drizzle',
    freezingDrizzle: 'Freezing drizzle',
    rain: 'Rain',
    freezingRain: 'Freezing rain',
    snow: 'Snow',
    snowGrains: 'Snow grains',
    rainShowers: 'Rain showers',
    snowShowers: 'Snow showers',
    thunderstorm: 'Thunderstorm',
    
    // Weather Details
    feelsLike: 'Feels like',
    humidity: 'Humidity',
    wind: 'Wind',
    windSpeed: 'Wind Speed',
    windDirection: 'Wind Direction',
    pressure: 'Pressure',
    uvIndex: 'UV Index',
    visibility: 'Visibility',
    sunrise: 'Sunrise',
    sunset: 'Sunset',
    
    // Units
    celsius: 'Celsius',
    fahrenheit: 'Fahrenheit',
    kmh: 'km/h',
    mph: 'mph',
    
    // Time
    days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    
    // Location
    currentLocation: 'Current Location',
    useMyLocation: 'Use my location',
    locationPermission: 'Location permission',
    locationDenied: 'Location access denied',
    
    // Settings
    settings: 'Settings',
    language: 'Language',
    temperatureUnit: 'Temperature Unit',
    theme: 'Theme',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    autoMode: 'Auto',
    
    // Saved Cities
    savedCities: 'Saved Cities',
    addCity: 'Add City',
    removeCity: 'Remove City',
    
    // Errors
    error: 'Error',
    networkError: 'Network Error',
    tryAgain: 'Try Again',
    
    // Loading
    loading: 'Loading...',
    
    // Last Updated
    lastUpdated: 'Last Updated',
  },
  
  ku: {
    // App
    appName: 'کۆڵان',
    appSlogan: 'پێشبینی کەش و هەوا',
    home: 'سەرەکی',
    
    // Search
    searchCity: 'گەڕانی شار...',
    search: 'گەڕان',
    searching: 'لە گەڕاندایە...',
    noResults: 'هیچ ئەنجامێک نەدۆزرایەوە',
    
    // Weather
    currentWeather: 'کەش و هەوای ئێستا',
    today: 'ئەمڕۆ',
    hourly: 'کاتژمێری',
    daily: 'حەفتەیی',
    
    // Weather Conditions
    clearSky: 'ئاسمان صاف',
    mainlyClear: 'بەشێوەیەکی سەرەکی صاف',
    partlyCloudy: 'تەنها هەور',
    overcast: 'هەوراوی',
    fog: 'تەم',
    drizzle: 'بارانی بچووک',
    freezingDrizzle: 'بارانی بچووکی بەستوو',
    rain: 'باران',
    freezingRain: 'بارانی بەستوو',
    snow: 'بەفر',
    snowGrains: 'دانی بەفر',
    rainShowers: 'بارانی توند',
    snowShowers: 'بەفری توند',
    thunderstorm: 'ترومبێل',
    
    // Weather Details
    feelsLike: 'وەک دەر دەکەوێت',
    humidity: 'شیاوێتی',
    wind: 'با',
    windSpeed: 'خێرایی با',
    windDirection: 'ئاڕاستەی با',
    pressure: 'پەستانی هەوا',
    uvIndex: 'پێوانەی UV',
    visibility: 'بینین',
    sunrise: 'تاڵان',
    sunset: 'ئاوابوون',
    
    // Units
    celsius: 'سەلسیۆس',
    fahrenheit: 'فارنهایت',
    kmh: 'کیلۆمەتر/کاتژمێر',
    mph: 'مایل/کاتژمێر',
    
    // Time
    days: ['یەکشەممە', 'دوشەممە', 'سێشەممە', 'چوارشەممە', 'پێنجشەممە', 'هەینی', 'شەممە'],
    months: ['کانوونی دووەم', 'شوبات', 'ئازار', 'نیسان', 'ئایار', 'حوزەیران', 'تەممووز', 'ئاب', 'ئەیلوول', 'تشرینی یەکەم', 'تشرینی دووەم', 'کانوونی یەکەم'],
    
    // Location
    currentLocation: 'شوێنی ئێستا',
    useMyLocation: 'شوێنی من بەکاربێنە',
    locationPermission: 'مۆڵەتی شوێن',
    locationDenied: 'دەستڕاگەیشتن بە شوێن ڕەتکرایەوە',
    
    // Settings
    settings: 'ڕێکخستنەکان',
    language: 'زمان',
    temperatureUnit: 'یەکەی پلەی گەرما',
    theme: 'ڕووکار',
    darkMode: 'دۆخی تاریک',
    lightMode: 'دۆخی ڕووناک',
    autoMode: 'خۆکار',
    
    // Saved Cities
    savedCities: 'شارە پاشەکەوتکراوەکان',
    addCity: 'زیادکردنی شار',
    removeCity: 'سڕینەوەی شار',
    
    // Errors
    error: 'هەڵە',
    networkError: 'هەڵەی تۆڕ',
    tryAgain: 'هەوڵبدەرەوە',
    
    // Loading
    loading: 'بارکردن...',
    
    // Last Updated
    lastUpdated: 'دوایین نوێکردنەوە',
  },
};

export function getTranslation(lang: Language, key: string): string {
  return translations[lang][key] || translations['en'][key] || key;
}

export function getDirection(lang: Language): 'rtl' | 'ltr' {
  const langObj = languages.find(l => l.code === lang);
  return langObj?.dir || 'ltr';
}
