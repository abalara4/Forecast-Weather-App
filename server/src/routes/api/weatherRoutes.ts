import { Router } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// POST Request with city name to retrieve weather data
router.post('/', async (req, res) => {
  const { city } = req.body; // Extract city from the request body

  // Check if the city is provided
  if (!city) {
    return res.status(400).json({ message: 'City name is required' }); // Return error if city is not provided
  }

  try {
    console.log(`City requested: ${city}`); // Log the city name
    const weatherData = await WeatherService.getWeatherForCity(city); // Fetch weather data for the city
    await HistoryService.addCity(city); // Add the city to history
    return res.status(200).json(weatherData); // Respond with weather data
  } catch (error) {
    console.error('Error retrieving weather data:', error); // Log the error for debugging
    return res.status(500).json({ message: 'Error retrieving weather data' });
  }
});

// GET search history
router.get('/history', async (req, res) => {
  const limit = req.query.limit; // Access optional query parameter for limiting results
  console.log(`Limit for history retrieval: ${limit}`); // Log the limit if provided

  try {
    const history = await HistoryService.getCities(); // Retrieve search history
    res.status(200).json(history); // Respond with search history
  } catch (error) {
    console.error('Error retrieving search history:', error); // Log the error
    res.status(500).json({ message: 'Error retrieving search history' });
  }
});

// BONUS: DELETE city from search history
router.delete('/history/:id', async (req, res) => {
  const { id } = req.params; // Get the city ID from the route parameters
  console.log(`Deleting city with ID: ${id}`); // Log the ID being deleted

  try {
    await HistoryService.removeCity(id); // Delete the city from history
    res.status(204).send(); // No content
  } catch (error) {
    console.error('Error deleting city from search history:', error); // Log the error
    res.status(500).json({ message: 'Error deleting city from search history' });
  }
});

export default router;
