import fs from "node:fs/promises";
import { v4 as uuidv4 } from "uuid";

// TODO: Define a City class with name and id properties

class City {
  name: string;
  id: string;
  constructor(name: string, id: string) {
    this.name = name;
    this.id = id;
  }
}

// TODO: Complete the HistoryService class
class HistoryService {
  // TODO: Define a read method that reads from the searchHistory.json file
  private async read() {
    return await fs.readFile("searchHistory.json", {
      flag: "a+",
      encoding: "utf-8",
    });
  }
  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]) {
    return await fs.writeFile(
      "searchHistory.json",
      JSON.stringify(cities, null, "\t")
    );
  }
  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities() {
    return await this.read().then((cities) => {
      let parsedCities: City[];

      // If cities isn't an array, or can't be turned into one, send back a new empty array
      try {
        parsedCities = [].concat(JSON.parse(cities));
      } catch (err) {
        parsedCities = [];
      }

      return parsedCities;
    });
  }
  // TODO Define an addCity method that adds a city to the searchHistory.json file
  async addCity(city: string) {
    if (!city) {
      throw new Error("City cannot be left blank");
    }

    // Create a new city object with a unique ID
    const newCity: City = { name: city, id: uuidv4() };

    // Fetch the current list of cities
    const cities = await this.getCities();

    // Check if the city already exists
    if (cities.find((i) => i.name === city)) {
      return cities.find((i) => i.name === city)!; // Return the existing city
    }

    // Add the new city to the list and write to the file
    const updatedCities = [...cities, newCity];
    await this.write(updatedCities);

    // Return the newly added city
    return newCity;
  }
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  // async removeCity(id: string) {}
}

export default new HistoryService();
