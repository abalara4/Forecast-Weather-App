import fs from 'fs';
import path from 'node:path';
import { fileURLToPath } from 'url';

// Define a City class with name and id properties
class City {
  constructor(public id: string, public name: string) {}
}

// Complete the HistoryService class
class HistoryService {
  private filePath: string;

  constructor() {
    const __filename = fileURLToPath(import.meta.url); // Get the current file path
    const __dirname = path.dirname(__filename); // Get the directory name
    this.filePath = path.join(__dirname, '../data/searchHistory.json'); // Adjust path as necessary
  }

  // Define a read method that reads from the searchHistory.json file
  private async read(): Promise<City[]> {
    try {
      const data = await fs.promises.readFile(this.filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading search history:', error);
      return [];
    }
  }

  // Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]): Promise<void> {
    try {
      await fs.promises.writeFile(this.filePath, JSON.stringify(cities, null, 2));
    } catch (error: any) {
      console.error('Error writing to search history:', error);
    }
  }

  // Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities(): Promise<City[]> {
    return await this.read();
  }

  // Define an addCity method that adds a city to the searchHistory.json file
  async addCity(cityName: string) {
    const cities = await this.read();
    const newCity = new City(Date.now().toString(), cityName); // Generate a unique ID based on timestamp
    cities.push(newCity);
    await this.write(cities);
  }

  // BONUS: Define a removeCity method that removes a city from the searchHistory.json file
  async removeCity(id: string): Promise<void> {
    const cities: City[] = await this.read();
    const updatedCities: City[] = cities.filter((city: City) => city.id !== id);
    await this.write(updatedCities);
  }
}

export default new HistoryService();
