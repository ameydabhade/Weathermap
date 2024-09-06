let todaycity = document.querySelector("#todaycity");
let searchbox = document.querySelector("#searchbox");
let submitbtn = document.querySelector("#submitbtn1");
let todaytemp = document.querySelector("#todaytemp");
let todayimg = document.querySelector("#todayimg");
let todaycor = document.querySelector("#todaycor");
let todaydate = document.querySelector("#todaydate");
let currentlocbtn = document.querySelector("#currentlocbtn");
let dropdown = document.querySelector("#dropdown");
let recentCitiesList = document.querySelector("#recentCitiesList");
let realfeel = document.querySelector("#realfeel");
let wind = document.querySelector("#wind");
let humidity = document.querySelector("#humidity");
let uvindex = document.querySelector("#uvindex");
let forecast = document.querySelector("#forecast");

// Load recently searched cities from localStorage
function loadRecentCities() {
  recentCitiesList.innerHTML = ""; // Clear dropdown
  let recentCities = JSON.parse(localStorage.getItem("recentCities")) || [];
  recentCities.forEach((city, index) => {
    let cityItem = document.createElement("li");
    cityItem.classList.add(
      "flex",
      "justify-between",
      "items-center",
      "px-4",
      "py-2",
      "hover:bg-gray-700",
      "rounded-lg"
    );
    cityItem.innerHTML = `
      <span class="cursor-pointer">${city}</span>
      <button class="delete-city bg-red-500 text-white rounded-full w-6 h-6 flex justify-center items-center">X</button>
    `;

    // Event listener for selecting a city
    cityItem.querySelector("span").addEventListener("click", () => {
      searchbox.value = city;
      fetchWeatherData(city);
      dropdown.classList.add("hidden"); // Hide dropdown after selection
    });

    // Event listener for deleting a city
    cityItem.querySelector(".delete-city").addEventListener("click", () => {
      recentCities.splice(index, 1);
      localStorage.setItem("recentCities", JSON.stringify(recentCities));
      loadRecentCities();
    });

    recentCitiesList.appendChild(cityItem);
  });
}

// Update localStorage with the new city
function updateRecentCities(city) {
  let recentCities = JSON.parse(localStorage.getItem("recentCities")) || [];
  if (!recentCities.includes(city)) {
    if (recentCities.length >= 5) {
      recentCities.pop(); // Limit to 5 cities
    }
    recentCities.unshift(city);
    localStorage.setItem("recentCities", JSON.stringify(recentCities));
  }
  loadRecentCities(); // Refresh dropdown
}

// Fetch weather data based on the city name
function fetchWeatherData(city) {
  fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=18f557c2dc594893925111213242607&q=${city}&days=5&aqi=no`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log("API Data:", data); // Log the entire API response for debugging
      
      // Update the DOM with the fetched data
      let currentDate = new Date(data.location.localtime).toLocaleDateString();
      
      todaycity.textContent = data.location.name;
      todaytemp.textContent = `${data.current.temp_c}°C`;
      todaydate.textContent = `Date: ${currentDate}`;
      todaycor.textContent = `Condition: ${data.current.condition.text}`;
      todayimg.src = data.current.condition.icon;

      // Update additional weather metrics
      realfeel.textContent = `${data.current.feelslike_c}°C`;
      wind.textContent = `${data.current.wind_kph} km/h`;
      humidity.textContent = `${data.current.humidity}%`;
      uvindex.textContent = `${data.current.uv}`;

      // Update the 5-day forecast
      updateForecast(data.forecast.forecastday);

      // Update recently searched cities
      updateRecentCities(city);
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error);
      todaycity.textContent = "Error fetching weather data";
      todaytemp.textContent = "";
      todaycor.textContent = "";
      todayimg.src = "";
      realfeel.textContent = "--°C";
      wind.textContent = "-- km/h";
      humidity.textContent = "--%";
      uvindex.textContent = "--";
    });
}

function updateForecast(forecastDays) {
  console.log("Forecast Days:", forecastDays); // Log forecast data for debugging
  forecast.innerHTML = ""; // Clear previous forecast


  let daysToShow = forecastDays.slice(1, 3);

  daysToShow.forEach((day) => {
    let date = new Date(day.date); // Parse the date string
    let formattedDate = date.toLocaleDateString("en-US", {
      weekday: "short", // e.g., Mon
      month: "short",   // e.g., Sep
      day: "numeric"    // e.g., 6
    });

    let forecastItem = document.createElement("div");
    forecastItem.classList.add(
      "bg-gray-800",
      "p-4",
      "rounded-lg",
      "flex",
      "flex-col",
      "items-center",
      "text-center",
      "min-w-[150px]" // Ensure forecast tiles have a minimum width for horizontal layout
    );
    forecastItem.innerHTML = `
      <p class="text-xl font-semibold">${formattedDate}</p>
      <img src="${day.day.condition.icon}" alt="Weather Icon" class="w-16 h-16 mt-2">
      <p class="text-lg font-bold">${day.day.avgtemp_c}°C</p>
      <p>Wind: ${day.day.maxwind_kph} km/h</p>
      <p>Humidity: ${day.day.avghumidity}%</p>
    `;
    forecast.appendChild(forecastItem);
  });
}

// Search button event listener
submitbtn.addEventListener("click", () => {
  let city = searchbox.value.trim();
  if (city) {
    fetchWeatherData(city);
  } else {
    alert("Please enter a city name.");
  }
});

// Current location button event listener
currentlocbtn.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      let lat = position.coords.latitude;
      let lon = position.coords.longitude;
      fetchWeatherData(`${lat},${lon}`);
    }, (error) => {
      alert("Error retrieving your location.");
      console.error("Geolocation error:", error);
    });
  } else {
    alert("Geolocation is not supported by your browser.");
  }
});

// Event listener for the dropdown
searchbox.addEventListener("focus", () => {
  loadRecentCities(); // Load the recent cities on focus
  dropdown.classList.remove("hidden");
});

// Event listener for clicking outside the dropdown
document.addEventListener("click", (event) => {
  if (!dropdown.contains(event.target) && event.target !== searchbox) {
    dropdown.classList.add("hidden");
  }
});

// Set default city on page load
function setDefaultCity() {
  fetchWeatherData("Mumbai");
}

// Run the function when the page loads
document.addEventListener("DOMContentLoaded", () => {
  setDefaultCity();
});
