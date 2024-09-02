let todaycity = document.querySelector("#todaycity");
let searchbox = document.querySelector("#searchbox");
let submitbtn = document.querySelector("#submitbtn1");
let todaytemp = document.querySelector("#todaytemp");
let todayimg = document.querySelector("#todayimg");
let todaycor = document.querySelector("#todaycor");
let currentlocbtn = document.querySelector("#currentlocbtn");

currentlocbtn.addEventListener('click', function() {
  navigator.geolocation.getCurrentPosition(
    function(position) {
      const url = `https://api.weatherapi.com/v1/current.json?key=18f557c2dc594893925111213242607&q=${position.coords.latitude},${position.coords.longitude}&aqi=no`;
      console.log('Latitude:', position.coords.latitude);
      console.log('Longitude:', position.coords.longitude);
      console.log('URL:', url);
      
      // Fetch weather data for the current location
      fetch(url)
        .then(response => response.json())
        .then(data => {
          // Update the DOM with the fetched data
          todaycity.innerHTML = data.location.name; // Update with city name
          todaytemp.innerHTML = `${data.current.temp_c}°C`; // Update with temperature
          todaycor.innerHTML = `Condition: ${data.current.condition.text}`; // Update with condition
          todayimg.src = `${data.current.condition.icon}`; // Update with weather icon
        })
        .catch(error => {
          console.error('Error fetching weather data:', error);
          // Handle errors here (e.g., display an error message)
          todaycity.innerHTML = 'Error fetching weather data';
          todaytemp.innerHTML = '';
          todaycor.innerHTML = '';
          todayimg.src = '';
        });
    },
    function(error) {
      console.error('Error getting location:', error);
    }
  );
});

submitbtn.addEventListener('click', function() {
  // Fetch weather data from the API
  fetch(`https://api.weatherapi.com/v1/current.json?key=18f557c2dc594893925111213242607&q=${searchbox.value}&aqi=no`)
    .then(response => response.json())
    .then(data => {
      // Update the DOM with the fetched data
      todaycity.innerHTML = data.location.name; // Update with city name
      todaytemp.innerHTML = `${data.current.temp_c}°C`; // Update with temperature
      todaycor.innerHTML = `Condition: ${data.current.condition.text}`; // Update with condition
      todayimg.src = `${data.current.condition.icon}`; // Update with weather icon
    })
    .catch(error => {
      console.error('Error fetching weather data:', error);
      // Handle errors here (e.g., display an error message)
      todaycity.innerHTML = 'Error fetching weather data';
      todaytemp.innerHTML = '';
      todaycor.innerHTML = '';
      todayimg.src = '';
    });
});
