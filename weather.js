const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const currentWeatherItemsEl = document.getElementById('current-weather-items');
const timezone = document.getElementById('time-zone');
const countryEl = document.getElementById('country');
const weatherForecastEl = document.getElementById('weather-forecast');
const currentTempEl = document.getElementById('current-temp');

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const API_KEY='6f6a466617a337433c5af259b63b4532';

setInterval(() => {
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const hoursIn12HrFormat = hour >= 13 ? hour %12 : hour;
    const minutes = time.getMinutes();
    const ampm = hour >= 12 ? 'PM' : 'AM';
    timeEl.innerHTML = hoursIn12HrFormat + ':' + (minutes < 10? '0' + minutes : minutes) + ' ' + `<span id="am-pm">${ampm}</span>`
    dateEl.innerHTML = innerHTML = days[day] + ', ' + date + ' ' + months[month];
},1000);

getWeatherData();

function getWeatherData() {
    navigator.geolocation.getCurrentPosition((e) => {
        console.log(e);
        let lat = e.coords.latitude;
        let lon = e.coords.longitude;

        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly, minutely&appid=${API_KEY}&units=metric`)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            showWeatherData(data);
        })
    });
}


function showWeatherData(data) {
   let { humidity, pressure, sunrise, sunset, wind_speed } = data.current;
   timezone.innerHTML = data.timezone;
   countryEl.innerHTML = data.lat + 'N ' + data.lon + 'E';

   currentWeatherItemsEl.innerHTML =
            `<div class="weather-items">
                <p>Humidity</p>
                <p>${humidity}</p>
            </div>
            <div class="weather-items">
                <p>Pressure</p>
                <p>${pressure} hPa</p>
            </div>
            <div class="weather-items">
                <p>Wind speed</p>
                <p>${wind_speed} km/h</p>
            </div>
            <div class="weather-items">
                <p>Sunrise</p>
                <p>${window.moment(sunrise*1000).format('HH:mm a')}</p>
            </div>
            <div class="weather-items">
                <p>Sunset</p>
                <p>${window.moment(sunset*1000).format('HH:mm a')}</p>
            </div>`;

            let otherDayForcast = ''

            data.daily.forEach((day, idx) => {
                if(idx == 0) {
                    currentTempEl.innerHTML = `
                            <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
                            <div class="other">
                                <div class="day">${window.moment(day.dt*1000).format('ddd')}</div>
                                <div class="temp"> Day ${day.temp.day} &#176;C</div>
                                <div class="temp"> Night ${day.temp.night} &#176;C</div>
                            </div>`
                } else {
                    otherDayForcast += `
                        <div class="weather-forecast-item">
                            <div class="day">${window.moment(day.dt*1000).format('ddd')}</div>
                            <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
                            <div class="temp"> Day ${day.temp.day}&#176;C</div>
                            <div class="temp"> Night ${day.temp.night} &#176;C</div>
                        </div>`
                }
            });
            weatherForecastEl.innerHTML = otherDayForcast;
}
