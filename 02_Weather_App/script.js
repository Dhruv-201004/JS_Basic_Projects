document.addEventListener("DOMContentLoaded", () => {
  // *Get Required Elements*
  const cityInput = document.getElementById("city-input");
  const getWeatherButton = document.getElementById("get-weather-btn");
  const weatherInfo = document.getElementById("weather-info");
  const cityName = document.getElementById("city-name");
  const temperatureDisplay = document.getElementById("temperature");
  const maxTemperatureDisplay = document.getElementById("max-temperature");
  const minTemperatureDisplay = document.getElementById("min-temperature");
  const descriptionDisplay = document.getElementById("description");
  const pressureDisplay = document.getElementById("pressure");
  const humidityDisplay = document.getElementById("humidity");
  const errorMessage = document.getElementById("error-message");
  const weatherIcon = document.getElementById("weather-icon");

  const API_Key = "";

  // Weather Icon Map
  const weatherIconMap = {
    Clear: "sun",
    Clouds: "cloud",
    Rain: "cloud-rain",
    Drizzle: "cloud-rain",
    Thunderstorm: "cloud-bolt",
    Snow: "snowflake",
    Mist: "smog",
    Smoke: "smog",
    Haze: "smog",
    Dust: "smog",
    Fog: "smog",
    Sand: "smog",
    Ash: "smog",
    Squall: "wind",
    Tornado: "tornado",
  };

  // Add Enter key support
  cityInput.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
      getWeatherButton.click();
    }
  });

  // *Function to fetch weather data*
  getWeatherButton.addEventListener("click", async () => {
    const city = cityInput.value.trim();
    if (!city) return;

    // Show loading state
    getWeatherButton.innerHTML =
      '<i class="fas fa-spinner fa-spin"></i> Loading...';
    getWeatherButton.disabled = true;

    try {
      const weatherData = await fetchWeatherData(city);
      displayWeatherData(weatherData);
    } catch (error) {
      showError();
    } finally {
      // Reset button state
      getWeatherButton.innerHTML =
        '<i class="fas fa-location-dot"></i> Get Weather';
      getWeatherButton.disabled = false;
    }
  });

  // *Function to Fetch Data*
  async function fetchWeatherData(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_Key}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("City Not Found");
    }
    return await response.json();
  }

  // *Function to Display Data*
  function displayWeatherData(data) {
    const { name, main, weather } = data;

    // Update weather icon
    const weatherType = weather[0].main;
    const iconName = weatherIconMap[weatherType] || "cloud";
    weatherIcon.innerHTML = `<i class="fas fa-${iconName}"></i>`;

    // Update text content with units and formatting
    cityName.textContent = cityInput.value.trim();
    temperatureDisplay.textContent = `${Math.round(main.temp)}°C`;
    maxTemperatureDisplay.textContent = `High: ${Math.round(main.temp_max)}°C`;
    minTemperatureDisplay.textContent = `Low: ${Math.round(main.temp_min)}°C`;
    descriptionDisplay.textContent =
      weather[0].description.charAt(0).toUpperCase() +
      weather[0].description.slice(1);
    pressureDisplay.textContent = `${main.pressure} hPa`;
    humidityDisplay.textContent = `${main.humidity}%`;

    // Show weather info with animation
    weatherInfo.style.animation = "none";
    weatherInfo.offsetHeight; // Trigger reflow
    weatherInfo.style.animation = null;

    weatherInfo.classList.remove("hidden");
    errorMessage.classList.add("hidden");
  }

  // *Function to Show Error*
  function showError() {
    weatherInfo.classList.add("hidden");
    errorMessage.classList.remove("hidden");

    // Trigger shake animation
    errorMessage.style.animation = "none";
    errorMessage.offsetHeight; // Trigger reflow
    errorMessage.style.animation = null;
  }
});
