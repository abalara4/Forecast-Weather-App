import dotenv from 'dotenv';
import fetch from 'node-fetch';
dotenv.config();
// TODO: Define a class for the Weather object
class Weather {
    constructor(temperature, description, forecast) {
        this.temperature = temperature;
        this.description = description;
        this.forecast = forecast;
    }
}
// TODO: Complete the WeatherService class
class WeatherService {
    constructor() {
        // TODO: Define the baseURL, API key, and city name properties
        this.apiKey = process.env.OPENWEATHER_API_KEY || '';
        this.baseURL = 'https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={6bcd461205025c955132b2008c3ae379}';
    }
    // TODO: Create fetchLocationData method
    async fetchLocationData(query) {
        const response = await fetch(`${this.baseURL}/weather?q=${query}&appid=${this.apiKey}`);
        const data = await response.json();
        return this.destructureLocationData(data);
    }
    // TODO: Create destructureLocationData method
    destructureLocationData(locationData) {
        return {
            lat: locationData.coord.lat,
            lon: locationData.coord.lon,
        };
    }
    // TODO: Create buildWeatherQuery method
    buildWeatherQuery(coordinates) {
        return `${this.baseURL}/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}`;
    }
    // TODO: Create fetchAndDestructureLocationData method
    async fetchAndDestructureLocationData(city) {
        const locationData = await this.fetchLocationData(city);
        return locationData;
    }
    // TODO: Create fetchWeatherData method
    async fetchWeatherData(coordinates) {
        const response = await fetch(this.buildWeatherQuery(coordinates));
        return await response.json();
    }
    // TODO: Build parseCurrentWeather method
    parseCurrentWeather(response) {
        const temperature = response.list[0].main.temp;
        const description = response.list[0].weather[0].description;
        const forecast = this.buildForecastArray(response.list);
        return new Weather(temperature, description, forecast);
    }
    // TODO: Complete buildForecastArray method
    buildForecastArray(weatherData) {
        return weatherData.map(item => ({
            date: item.dt_txt,
            temperature: item.main.temp,
            description: item.weather[0].description,
        }));
    }
    // TODO: Complete getWeatherForCity method
    async getWeatherForCity(city) {
        const coordinates = await this.fetchAndDestructureLocationData(city);
        const weatherData = await this.fetchWeatherData(coordinates);
        return this.parseCurrentWeather(weatherData);
    }
}
export default new WeatherService();
