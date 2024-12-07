import fs from 'fs';
import path from 'node:path';
import { fileURLToPath } from 'url';
// Define a City class with name and id properties
class City {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
}
// Complete the HistoryService class
class HistoryService {
    constructor() {
        const __filename = fileURLToPath(import.meta.url); // Get the current file path
        const __dirname = path.dirname(__filename); // Get the directory name
        this.filePath = path.join(__dirname, '../data/searchHistory.json'); // Adjust path as necessary
    }
    // Define a read method that reads from the searchHistory.json file
    async read() {
        try {
            const data = await fs.promises.readFile(this.filePath, 'utf-8');
            return JSON.parse(data);
        }
        catch (error) {
            console.error('Error reading search history:', error);
            return [];
        }
    }
    // Define a write method that writes the updated cities array to the searchHistory.json file
    async write(cities) {
        try {
            await fs.promises.writeFile(this.filePath, JSON.stringify(cities, null, 2));
        }
        catch (error) {
            console.error('Error writing to search history:', error);
        }
    }
    // Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
    async getCities() {
        return await this.read();
    }
    // Define an addCity method that adds a city to the searchHistory.json file
    async addCity(cityName) {
        const cities = await this.read();
        const newCity = new City(Date.now().toString(), cityName); // Generate a unique ID based on timestamp
        cities.push(newCity);
        await this.write(cities);
    }
    // BONUS: Define a removeCity method that removes a city from the searchHistory.json file
    async removeCity(id) {
        const cities = await this.read();
        const updatedCities = cities.filter((city) => city.id !== id);
        await this.write(updatedCities);
    }
}
export default new HistoryService();
