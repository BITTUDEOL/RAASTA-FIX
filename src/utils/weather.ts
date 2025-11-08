export interface WeatherData {
  isRaining: boolean;
  temperature: number;
  description: string;
  humidity: number;
}

export const checkWeather = async (lat: number, lng: number): Promise<WeatherData> => {
  try {
    const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

    if (!apiKey) {
      return simulateWeather();
    }

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey}&units=metric`
    );

    if (!response.ok) {
      return simulateWeather();
    }

    const data = await response.json();

    return {
      isRaining: data.weather[0].main.toLowerCase().includes('rain'),
      temperature: Math.round(data.main.temp),
      description: data.weather[0].description,
      humidity: data.main.humidity
    };
  } catch (error) {
    return simulateWeather();
  }
};

function simulateWeather(): WeatherData {
  const isRaining = Math.random() > 0.7;
  return {
    isRaining,
    temperature: Math.floor(Math.random() * 15) + 20,
    description: isRaining ? 'light rain' : 'partly cloudy',
    humidity: Math.floor(Math.random() * 30) + 60
  };
}

export const isRainyHazard = (reportType: string, weather: WeatherData): boolean => {
  if (!weather.isRaining) return false;

  const hazardousTypes = ['pothole', 'manhole', 'water-leak'];
  return hazardousTypes.includes(reportType);
};
