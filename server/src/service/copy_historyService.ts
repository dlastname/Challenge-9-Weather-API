import fs from 'fs/promises';

class City {
  id: string;
  name: string;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
}

class HistoryService {
  private async read(): Promise<City[]> {
    const data = await fs.readFile('searchHistory.json', 'utf-8');
    return JSON.parse(data) as City[];
  }

  private async write(cities: City[]): Promise<void> {
    await fs.writeFile('searchHistory.json', JSON.stringify(cities, null, 2), 'utf-8');
  }

  async getCities(): Promise<City[]> {
    return await this.read();
  }

  async addCity(city: string): Promise<void> {
    const cities = await this.read();
    const newCity = new City(Date.now().toString(), city);
    cities.push(newCity);
    await this.write(cities);
  }

  async removeCity(id: string): Promise<void> {
    const cities = await this.read();
    const updatedCities = cities.filter(city => city.id !== id);
    await this.write(updatedCities);
  }
}

export default new HistoryService();