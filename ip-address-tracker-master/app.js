const ApiKey = "at_oy4d5r8cZYys4whzJyxYs10Wfb1lp";
const GeoCoderApiKey = "03abc70993ee4fd1adb60f73adb42565";
const apiCall = `https://geo.ipify.org/api/v2/country?apiKey=${ApiKey}`;
const searchBar = document.querySelector(".search-bar");
const searchBtn = document.querySelector(".search-btn");
const form = document.querySelector(".search-form");
const dataSection = document.querySelector(".data");

form.addEventListener("submit", async (event) => {
  event.preventDefault(); // Prevent default form submission behavior
  return false; // Prevent form submission behavior
});

function searchFor() {
  async function getData() {
    try {
      const valueEntered = searchBar.value;
      const response = await fetch(
        `${apiCall}&${
          /^(\d{1,3}\.){3}\d{1,3}$/.test(valueEntered)
            ? "ipAddress=" + valueEntered
            : "domain=" + valueEntered
        }`
      );
      const data = await response.json();
      console.log(data);

      /*Updating data */
      dataSection.innerHTML = `<div class="ip">
    <p>IP ADRESS</p>
    <p class="data-result">${data.ip}</p>
  </div>
  <div class="vl"></div>
  <div class="location">
    <p>LOCATION</p>
    <p class="data-result">${data.location.region}</p>
  </div>
  <div class="vl"></div>
  <div class="timezone">
    <p>TIMEZONE</p>
    <p class="data-result">UTC ${data.location.timezone}</p>
  </div>
  <div class="vl"></div>
  <div class="isp">
    <p>ISP</p>
    <p class="data-result">${data.isp}</p>
  </div>`;

      var url =
        "https://api.opencagedata.com/geocode/v1/json?q=" +
        data.location.region +
        "&key=" +
        GeoCoderApiKey;
      fetch(url)
        .then(function (resp) {
          return resp.json();
        })
        .then(function (dt) {
          var lat = dt.results[0].geometry.lat;
          var lng = dt.results[0].geometry.lng;

          var marker = L.marker([lat, lng]).addTo(map);

          // Use Leaflet setView method to update the map center to the city's location
          map.setView([lat, lng], 13);
        });
    } catch (error) {
      console.error(error);
    }
  }
  getData();
}

searchBtn.addEventListener("click", function () {
  searchFor();
});

/*LeafLet code */
var map = L.map("map").setView([51.505, -0.09], 13);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

/* to request the current location of the user , we use the HTML5 geolocation api which is available in the navigator.geolocation */

navigator.geolocation.watchPosition(success, error);
let marker, circle;
function success(pos) {
  const lat = pos.coords.latitude;
  const lng = pos.coords.longitude;
  const accuracy = pos.coords.accuracy;

  if (marker) {
    map.removeLayer(marker);
    map.removeLayer(circle);
  }

  marker = L.marker([lat, lng]).addTo(map);
  circle = L.circle([lat, lng], { radius: accuracy }).addTo(map);

  map.fitBounds(circle.getBounds());
}

/*error handling in case user isnt allowing current location or because of some technical error */

function error(err) {
  if (err.code === 1) {
    alert("Please allow geolocation access");
  } else {
    alert("Cannot get current location");
  }
}
