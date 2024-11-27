import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

// Predefined cities
const cities = ["Ho Chi Minh", "Singapore", "Kuala Lumpur", "Tokyo", "Athens"];
const apiKey = "d190151bf56efcc3716f0843085b8ca7"; 

function App() {
  const [selectedCity, setSelectedCity] = useState(
    localStorage.getItem("selectedCity") || "Ho Chi Minh"
  );
  const [forecastDays, setForecastDays] = useState(3);
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);

  // Save the selected city in localStorage
  useEffect(() => {
    localStorage.setItem("selectedCity", selectedCity);
  }, [selectedCity]);

  // Fetch weather and forecast data
  useEffect(() => {
    const fetchWeatherData = async () => {
      //const apiKey = process.env.apiKey;
      try {
        const weatherResponse = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${selectedCity}&appid=${apiKey}&units=metric`
        );
        setWeatherData(weatherResponse.data);

        const forecastResponse = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?q=${selectedCity}&appid=${apiKey}&units=metric`
        );
        setForecastData(forecastResponse.data.list.slice(0, forecastDays * 8)); 
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    fetchWeatherData();
  }, [selectedCity, forecastDays]);

  // Handle city change
  const handleCityChange = (event) => {
    setSelectedCity(event.target.value);
  };

  // Handle forecast 
  const handleDaysChange = (event) => {
    setForecastDays(Number(event.target.value));
  };

  return (
    <div className="app">
      <h1>Weather Forecast</h1>

      <div className="controls">
        <label>
          Location:
          <select value={selectedCity} onChange={handleCityChange}>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </label>
        <label>
          Forecast Days:
          <input
            type="number"
            min="1"
            max="5"
            value={forecastDays}
            onChange={handleDaysChange}
          />
        </label>
      </div>

      {/* Current Weather Card */}
      {weatherData && (
        <div className="current-weather">
          <h2>Current Weather in {selectedCity}</h2>
          <div className="card">
            <div className="card-header">
              <img
                src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                alt={weatherData.weather[0].description}
              />
              <h3>{weatherData.weather[0].main}</h3>
            </div>
            <div className="card-details">
              <p>🌡️ Temperature: {weatherData.main.temp}°C</p>
              <p>💧 Humidity: {weatherData.main.humidity}%</p>
              <p>💨 Wind Speed: {weatherData.wind.speed} m/s</p>
              <p>🌬️ Air Pressure: {weatherData.main.pressure} hPa</p>
              <p>
                🌡️ Feels Like: {weatherData.main.feels_like}°C (Min:{" "}
                {weatherData.main.temp_min}°C, Max: {weatherData.main.temp_max}
                °C)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Forecast Cards */}
      {forecastData.length > 0 && (
        <div className="forecast">
          <h2>Forecast for the Next {forecastDays} Day(s)</h2>
          <div className="forecast-grid">
            {forecastData.map((forecast, index) => (
              <div key={index} className="forecast-card">
                <p>{new Date(forecast.dt_txt).toLocaleString()}</p>
                <img
                  src={`https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`}
                  alt={forecast.weather[0].description}
                />
                <p>🌡️ Temp: {forecast.main.temp}°C</p>
                <p>💧 Humidity: {forecast.main.humidity}%</p>
                <p>💨 Wind: {forecast.wind.speed} m/s</p>
                <p>🌬️ Pressure: {forecast.main.pressure} hPa</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;


