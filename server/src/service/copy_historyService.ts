import fs from 'node:fs/promises';
import { v4 as uuidv4 } from 'uuid';

class City {
  name: string;
  id: string;

  constructor(name: string, id: string) {
    this.name = name;
    this.id = id;
  }
}

class HistoryService {
  private async read() {
    return await fs.readFile('searchHistory.json', {
      flag: 'a+', // Create the file if it doesn't exist
      encoding: 'utf8',
    });
  }

  private async write(cities: City[]) {
    return await fs.writeFile('searchHistory.json', JSON.stringify(cities, null, '\t'));
  }

  async getCities() {
    return await this.read().then((cities) => {
      let parsedCities: City[];

      // If cities isn't an array or can't be turned into one, return an empty array
      try {
        parsedCities = [].concat(JSON.parse(cities));
      } catch (err) {
        parsedCities = [];
      }

      return parsedCities;
    });
  }

  async addCity(city: string) {
    if (!city) {
      throw new Error('City cannot be blank');
    }

    // Add a unique id to the city using the uuid package
    const newCity: City = { name: city, id: uuidv4() };

    // Get all cities, add the new city, write all the updated cities, return the new city
    return await this.getCities()
      .then((cities) => {
        // Check if the city already exists
        if (cities.find((index) => index.name === city)) {
          return cities;
        }
        return [...cities, newCity];
      })
      .then((updatedCities) => this.write(updatedCities))
      .then(() => newCity);
  }

  async removeCity(id: string) {
    return await this.getCities()
      .then((cities) => cities.filter((city) => city.id !== id)) // Filter out the city with the matching id
      .then((filteredCities) => this.write(filteredCities)); // Write the updated list back to the file
  }
}

export default new HistoryService();