const API_KEY = "331e8e1033c9a5ed77d4105a9ae89494";

const getCountryCode = async (countryName) => {
    const response = await fetch("https://restcountries.com/v3.1/all");
    const countries = await response.json();
    const countryData = countries.find(
        (country) => country.name.common.toLowerCase() === countryName.toLowerCase()
    );
    return countryData ? countryData.cca2.toLowerCase() : null;
};

const getWeatherData = async (city, countryCode) => {
    // const geocodingUrl = `http://api.openweathermap.org/data/2.5/weather?q=${city},${countryCode}&appid=${API_KEY}`;

    const geocodingUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city},${countryCode}&appid=${API_KEY}`;

    const response = await fetch(geocodingUrl);
    const data = await response.json();

    if (data.cod === 200) {
        return data;
    } else if (data.cod === "404") {
        alert("City not found. Please check the name and try again!");
        return null;
    } else {
        alert(`The city '${city}' is not in the specified country. Please verify your inputs.`);
        return null;
    }
};

const setBackground = (temperature) => {
    const body = document.body;
    body.classList.remove("cold", "cool", "warm", "hot");

    if (temperature <= 5) {
        body.classList.add("cold");
    } else if (temperature > 5 && temperature <= 20) {
        body.classList.add("cool");
    } else if (temperature > 20 && temperature <= 30) {
        body.classList.add("warm");
    } else {
        body.classList.add("hot");
    }
};

const displayWeather = async (event) => {
  event.preventDefault();

  const country = document.getElementById("country").value.trim();
  const city = document.getElementById("city").value.trim();

  // Check if country and city names are the same
  if (country.toLowerCase() === city.toLowerCase()) {
      alert("Both country and city are the same. Please change the city and country name.");
      return;
  }

  const countryCode = await getCountryCode(country);

  if (!countryCode) {
      alert("Invalid country name. Please check and try again.");
      return;
  }

  const weatherData = await getWeatherData(city, countryCode);

  if (weatherData) {
      const temperature = weatherData.main.temp - 273.15; // Convert from Kelvin to Celsius
      const description = weatherData.weather[0].description;

      setBackground(temperature);

      document.getElementById("main").innerHTML = `
          <div class="weather-card">
              <h2>Weather in ${city.charAt(0).toUpperCase() + city.slice(1)}, ${country.charAt(0).toUpperCase() + country.slice(1)}</h2>
              <div class="weather-details">
                  <p>Temperature: ${temperature.toFixed(2)}°C</p>
                  <p>Condition: ${description}</p>
              </div>
          </div>
      `;
  }
};

// Add event listener for form submission
document.getElementById("form").addEventListener("submit", displayWeather);
