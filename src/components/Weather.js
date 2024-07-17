import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import './Weather.css';
import search_icon from '../Assets/search.png';
import clear_icon from '../Assets/clear.png';
import cloud_icon from '../Assets/cloud.png';
import drizzle_icon from '../Assets/drizzle.png';
import humidity_icon from '../Assets/humidity.png';
import rain_icon from '../Assets/rain.png';
import snow_icon from '../Assets/snow.png';
import wind_icon from '../Assets/wind.png';

const Weather = () => {
  const inputRef = useRef();
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [backgroundUrl, setBackgroundUrl] = useState('');
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const allIcons = {
    "01d": clear_icon,
    "01n": clear_icon,
    "02d": cloud_icon,
    "02n": cloud_icon,
    "03d": cloud_icon,
    "03n": cloud_icon,
    "04d": drizzle_icon,
    "04n": drizzle_icon,
    "09d": rain_icon,
    "09n": rain_icon,
    "10d": rain_icon,
    "10n": rain_icon,
    "13d": snow_icon,
    "13n": snow_icon,
  };

  const backgroundImages = {
    "01d": "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExMjR2MzFxaG10enA3bXNsZGg1Nm83ZHpsdXVzeDZmdmVpazdob3FiZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/VHf2YBdIm7GsyRzwVZ/giphy.webp", //clear
    "01n": "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExMjR2MzFxaG10enA3bXNsZGg1Nm83ZHpsdXVzeDZmdmVpazdob3FiZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/VHf2YBdIm7GsyRzwVZ/giphy.webp",//clear
    "02d": "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExa2c3ZGx5Ymo2NXd1aDR3aHdvY3VycjBtaTJleHFvMnJpaWcya2Z5NiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/WmSrrahVLWcec8YcfI/giphy.webp", //cloudy
    "02n": "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExa2c3ZGx5Ymo2NXd1aDR3aHdvY3VycjBtaTJleHFvMnJpaWcya2Z5NiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/WmSrrahVLWcec8YcfI/giphy.webp", //cloudy
    "03d": "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExa2c3ZGx5Ymo2NXd1aDR3aHdvY3VycjBtaTJleHFvMnJpaWcya2Z5NiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/WmSrrahVLWcec8YcfI/giphy.webp", //cloudy
    "03n": "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExa2c3ZGx5Ymo2NXd1aDR3aHdvY3VycjBtaTJleHFvMnJpaWcya2Z5NiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/WmSrrahVLWcec8YcfI/giphy.webp", //cloudy
    "04d": "https://i.gifer.com/7scx.gif", //drizzle
    "04n": "https://i.gifer.com/7scx.gif", //drizzle
    "09d": "https://cdn.pixabay.com/animation/2024/04/03/23/48/23-48-16-122_512.gif", //rainy
    "09n": "https://cdn.pixabay.com/animation/2024/04/03/23/48/23-48-16-122_512.gif", //rainy
    "10d": "https://cdn.pixabay.com/animation/2024/04/03/23/48/23-48-16-122_512.gif", //rainy
    "10n": "https://cdn.pixabay.com/animation/2024/04/03/23/48/23-48-16-122_512.gif", //rainy
    "13d": "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExZG83cTV4b3pmZnV2MnhucmF5Z2EzdHVpNno0eHU3c3E4M3k3NmxyNSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/BDucPOizdZ5AI/giphy.webp", //snowy
    "13n": "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExZG83cTV4b3pmZnV2MnhucmF5Z2EzdHVpNno0eHU3c3E4M3k3NmxyNSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/BDucPOizdZ5AI/giphy.webp", //snowy
  };

  const fetchWeatherData = async (url) => {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        const errorMessage = `City not found. Please check the city name and try again.`;
        console.error('Error:', errorMessage);
        alert(errorMessage);
        return null;
      }

      const data = await response.json();
      return data;

    } catch (error) {
      console.error("Error fetching weather data:", error);
      alert("There was an issue fetching the weather data. Please try again later.");
      return null;
    }
  };

  const search = async (city) => {
    if (city === "") {
      alert("Enter City Name");
      return;
    }
    setLoading(true);
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${process.env.REACT_APP_API_KEY}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${process.env.REACT_APP_API_KEY}`;

    const weatherData = await fetchWeatherData(weatherUrl);
    const forecastData = await fetchWeatherData(forecastUrl);

    if (weatherData && forecastData) {
      const icon = allIcons[weatherData.weather[0].icon] || clear_icon;
      setWeatherData({
        date: new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
        humidity: weatherData.main.humidity,
        windSpeed: weatherData.wind.speed,
        temperature: Math.floor(weatherData.main.temp),
        location: weatherData.name,
        icon: icon
      });

      setBackgroundUrl(backgroundImages[weatherData.weather[0].icon] || backgroundImages["01d"]);

      const dailyData = forecastData.list.filter(reading => reading.dt_txt.includes("12:00:00")).slice(1, 5);
      setForecastData(dailyData);
    } else {
      setWeatherData(null);
      setForecastData([]);
      setBackgroundUrl('');
    }
    setLoading(false);
  };

  const fetchWeatherByCoords = async (latitude, longitude) => {
    setLoading(true);
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${process.env.REACT_APP_API_KEY}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${process.env.REACT_APP_API_KEY}`;

    const weatherData = await fetchWeatherData(weatherUrl);
    const forecastData = await fetchWeatherData(forecastUrl);

    if (weatherData && forecastData) {
      const icon = allIcons[weatherData.weather[0].icon] || clear_icon;
      setWeatherData({
        date: new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
        humidity: weatherData.main.humidity,
        windSpeed: weatherData.wind.speed,
        temperature: Math.floor(weatherData.main.temp),
        location: weatherData.name,
        icon: icon
      });

      setBackgroundUrl(backgroundImages[weatherData.weather[0].icon] || backgroundImages["01d"]);

      const dailyData = forecastData.list.filter(reading => reading.dt_txt.includes("12:00:00")).slice(1, 5);
      setForecastData(dailyData);
    } else {
      setWeatherData(null);
      setForecastData([]);
      setBackgroundUrl('');
    }
    setLoading(false);
  };

  useEffect(() => {
    const successFunction = (position) => {
      console.log(position);
      fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
    };

    const errorFunction = (error) => {
      console.log("Unable to retrieve your location.", error);
      alert('Please allow your current location.');
      search("");
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(successFunction, errorFunction);
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }, []);

  const fetchCitySuggestions = async (query) => {
    if (query.length < 1) {
      setCitySuggestions([]);
      return;
    }

    try {
      const response = await axios.get(`https://wft-geo-db.p.rapidapi.com/v1/geo/cities`, {
        headers: {
          'X-RapidAPI-Key': process.env.REACT_APP_RAPIDAPI_KEY,
          'X-RapidAPI-Host': process.env.REACT_APP_RAPIDAPI_HOST
        },
        params: {
          namePrefix: query,
          limit: 10
        }
      });
      setCitySuggestions(response.data.data);
      setShowSuggestions(true);
    } catch (error) {
      console.error("Error fetching city suggestions:", error);
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setInputValue(query);
    fetchCitySuggestions(query);
  };

  const handleSearch = (city) => {
    if (city) {
      setInputValue(city);
      search(city);
    } else {
      search(inputRef.current.value);
    }
    setShowSuggestions(false);
  };

  return (
    <div className='weather' style={{ backgroundImage: `url(${backgroundUrl})` }}>
      <div className='search-bar'>
        <input
          ref={inputRef}
          type='text'
          placeholder='Search'
          value={inputValue}
          onChange={handleSearchChange}
          style={{boxShadow : "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"}}
        />
        <img src={search_icon} alt='searchIcon' onClick={() => handleSearch()} style={{boxShadow : "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"}}/>
      </div>
      <div  className='suggestion-list-container'>
      {showSuggestions && (
        <ul className='suggestions' style={{overflowY: "auto", maxHeight :"100px", width: "360px", paddingLeft: "10px",paddingTop: "3px", marginBottom : "5px", marginTop : "5px", cursor: "pointer"}}>
          {citySuggestions.length > 0 ? (citySuggestions.map((suggestion) => (
            <li
              key={suggestion.id}
              onClick={() => handleSearch(suggestion.city)}
            >
              {suggestion.city}, {suggestion.country}
            </li>
          ))): ( <li >Please type city name......</li>)}
        </ul>
      )}
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : weatherData ? (
        <>
          <div className='current-weather'>
            <img src={weatherData.icon} alt='weather icon' className='weather-icon' loading='lazy'/>
            <p className='temperature'>{weatherData.temperature}<sup>o</sup>C</p>
            <p className='date'>{weatherData.date}</p>
            <p className='location'>{weatherData.location}</p>
            <div className='weather-data'>
              <div className='col'>
                <img src={humidity_icon} alt='humidity icon' />
                <div>
                  <p>{weatherData.humidity}%</p>
                  <span>Humidity</span>
                </div>
              </div>
              <div className='col'>
                <img src={wind_icon} alt='wind icon' />
                <div>
                  <p>{weatherData.windSpeed} Km/h</p>
                  <span>Wind Speed</span>
                </div>
              </div>
            </div>
          </div>

          <div className='forecast'>
            <h3>4-Day Forecast</h3>
            <div className='forecast-grid'>
              {forecastData.map((day, index) => (
                <div key={index} className='forecast-day'>
                  <p>{new Date(day.dt_txt).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                  <img src={allIcons[day.weather[0].icon] || clear_icon} alt='forecast icon' className='iconSize' />
                  <p>{Math.floor(day.main.temp)}<sup>o</sup>C</p>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default Weather;
