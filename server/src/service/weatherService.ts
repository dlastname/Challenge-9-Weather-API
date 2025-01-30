import dayjs, { type Dayjs } from "dayjs";
// import fs from "node:fs/promises";
import dotenv from "dotenv";
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state: string;
}

// TODO: Define a class for the Weather object

class Weather {
  city: string;
  date: Dayjs | string;
  tempF: number;
  windSpeed: number;
  humidity: number;
  icon: string;
  iconDescription: string;
  constructor(
    city: string,
    date: Dayjs | string,
    tempF: number,
    windSpeed: number,
    humidity: number,
    icon: string,
    iconDescription: string
  ) {
    this.city = city;
    this.date = date;
    this.tempF = tempF;
    this.windSpeed = windSpeed;
    this.humidity = humidity;
    this.icon = icon;
    this.iconDescription = iconDescription;
  }
}

// TODO: Complete the WeatherService class
class WeatherService {
  private baseURL?: string;

  private apiKey?: string;

  // private city = "";

  constructor() {
    this.baseURL = process.env.API_BASE_URL || "";

    this.apiKey = process.env.API_KEY || "";
  }
  // * Note: The following methods are here as a guide, but you are welcome to provide your own solution.
  // * Just keep in mind the getWeatherForCity method is being called in your
  // * 09-Servers-and-APIs/02-Challenge/Develop/server/src/routes/api/weatherRoutes.ts file

  // * the array of Weather objects you are returning ultimately goes to
  // * 09-Servers-and-APIs/02-Challenge/Develop/client/src/main.ts

  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string) {
    const url = `${this.baseURL}/geo/1.0/direct?q=${query}&limit=1&appid=${this.apiKey}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch location data: ${response.statusText}`);
    }
    return await response.json();
  }
  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates[]): Coordinates {
    if (!locationData || locationData.length === 0) {
      throw new Error("No location data found");
    }
    const { name, lat, lon, country, state } = locationData[0];
    return { name, lat, lon, country, state };
  }
  // // TODO: Create buildGeocodeQuery method
  // private buildGeocodeQuery(city:string): string {
  //   return `${this.baseURL}/geo/1.0/direct?q=${city}&limit=1&appid=${this.apiKey}`;
  // }
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    const { lat, lon } = coordinates;
    return `${this.baseURL}/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=imperial`;
  }
  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData(city: string) {
    const locationData = await this.fetchLocationData(city);
    return this.destructureLocationData(locationData);
  }
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    const url = this.buildWeatherQuery(coordinates);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch weather data: ${response.statusText}`);
    }
    return await response.json();
  }
  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any) {
    const { city, list } = response;
    const current = list[0]; // Get the first forecast entry (current weather)

    return new Weather(
      city.name,
      
      dayjs.unix(current.dt).format('M/D/YYYY'), // Convert timestamp to Dayjs object
      current.main.temp,
      current.wind.speed, 
      current.main.humidity, 
      current.weather[0].icon,
      current.weather[0].description 
    );
  }
  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
    // Use a map to store only one entry per day
    const dailyForecast = new Map();
  
    weatherData.forEach((data) => {
      const date = dayjs.unix(data.dt).format("YYYY-MM-DD");
  
      if (!dailyForecast.has(date)) {
        // Store only the first entry per day
        dailyForecast.set(
          date,
          new Weather(
            currentWeather.city,
            dayjs.unix(data.dt).format('M/D/YYYY'), 
            data.main.temp, 
            data.wind.speed, 
            data.main.humidity,
            data.weather[0].icon,
            data.weather[0].description
          )
        );
      }
    });
  
    return [currentWeather, ...Array.from(dailyForecast.values()).slice(0, 5)];
  }

  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    try {
      // Fetch and destructure location data
      const coordinates = await this.fetchAndDestructureLocationData(city);

      // Fetch weather data using coordinates
      const weatherData = await this.fetchWeatherData(coordinates);

      // Parse the current weather
      const currentWeather = this.parseCurrentWeather(weatherData);

      // Build the forecast array
      const forecastArray = this.buildForecastArray(
        currentWeather,
        weatherData.list
      );

      return forecastArray;
    } catch (error) {
      console.error("Error fetching weather data:", error);
      throw new Error("Failed to fetch weather data");
    }
  }
}

export default new WeatherService();
