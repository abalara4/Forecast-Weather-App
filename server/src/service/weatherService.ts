import dotenv from 'dotenv';
import fetch from 'node-fetch';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// TODO: Define a class for the Weather object
class Weather {
  temperature: number;
  description: string;
  forecast: Array<{ date: string; temperature: number; description: string }>;

  constructor(temperature: number, description: string, forecast: Array<{ date: string; temperature: number; description: string }>) {
    this.temperature = temperature;
    this.description = description;
    this.forecast = forecast;
  }
}
// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private apiKey: string = process.env.OPENWEATHER_API_KEY || '';
  private baseURL: string = 'https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={6bcd461205025c955132b2008c3ae379}';
  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string): Promise<Coordinates> {
    const response = await fetch(`${this.baseURL}/weather?q=${query}&appid=${this.apiKey}`);
    const data = await response.json();
    return this.destructureLocationData(data);
  }
  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: any): Coordinates {
    return {
      lat: locationData.coord.lat,
      lon: locationData.coord.lon,
    };
  }
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}`;
  }
  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData(city: string): Promise<Coordinates> {
    const locationData = await this.fetchLocationData(city);
    return locationData;
  }
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const response = await fetch(this.buildWeatherQuery(coordinates));
    return await response.json();
  }
  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any): Weather {
    const temperature = response.list[0].main.temp;
    const description = response.list[0].weather[0].description;
    const forecast = this.buildForecastArray(response.list);
    return new Weather(temperature, description, forecast);
  }
  // TODO: Complete buildForecastArray method
  private buildForecastArray(weatherData: any[]): Array<{ date: string; temperature: number; description: string }> {
    return weatherData.map(item => ({
      date: item.dt_txt,
      temperature: item.main.temp,
      description: item.weather[0].description,
    }));
  }
  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string): Promise<Weather> {
    const coordinates = await this.fetchAndDestructureLocationData(city);
    const weatherData = await this.fetchWeatherData(coordinates);
    return this.parseCurrentWeather(weatherData);
  }
}

export default new WeatherService();
