const API_KEY = 'e8d973b8fba73a98a71fa8c57b8adc66'
const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=44.34&lon=10.99&appid=${API_KEY}`

function getApi() {
    fetch(apiUrl)
    .then(function(response) {
        return response.json
    })
}


fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      console.log('API Response:', data);
     
    })
    .catch(error => {
      console.error('Error:', error);
    });

