import { Router, type Request, type Response } from "express";
const router = Router();

import HistoryService from "../../service/historyService.js";
import WeatherService from "../../service/weatherService.js";
// import { error } from "console";

// TODO: POST Request with city name to retrieve weather data
router.post("/", async (req: Request, res: Response) => {
  // try {
  //   // TODO: GET weather data from city name
  //   const cityName = req.body.cityName;

  //   if (!cityName) {
  //     return res.status(400).json({ error: "City name is required" });
  //   }

  //   WeatherService.getWeatherForCity(cityName).then((data) => {
  //     // TODO: save city to search history
  //     HistoryService.addCity(cityName);

  //     res.json(data);
  //   });
  // } catch (error) {
  //   console.error("Error getting weather data:", error);

  //   res.status(500).json(error);
  // }

  try {
    const cityName = req.body.cityName;

    if (!cityName) {
      return res.status(400).json({ error: "City name is required" });
    }

    const data = await WeatherService.getWeatherForCity(cityName);

    await HistoryService.addCity(cityName);

    return res.json(data);
  } catch (error) {
    console.error("Error getting weather data:", error);
    return res.status(500).json({ error: "Failed to fetch weather data" });
  }
});

// TODO: GET search history
router.get("/history", async (_req: Request, res: Response) => {
  // HistoryService.getCities()
  //   .then((data) => {
  //     return res.json(data);
  //   })
  //   .catch((err) => {
  //     console.error("Error getting search history");

  //     res.status(500).json(err);
  //   });
  try {
    const data = await HistoryService.getCities();
    return res.json(data);
  } catch (error) {
    console.error("Error getting search history:", error);
    return res.status(500).json({ error: "Failed to fetch search history" });
  }
});

// * BONUS TODO: DELETE city from search history
router.delete("/history/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({ error: "City ID is required" });
    }

    await HistoryService.removeCity(id);
    return res.json({ message: "City deleted successfully" });
  } catch (error) {
    console.error("Error deleting city from history:", error);
    return res.status(500).json({ error: "Failed to delete city" });
  }
});

export default router;
