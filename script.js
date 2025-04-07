const userLocation = document.getElementById("userLocation"),
    converter = document.getElementById("converter"),
    weatherIcon = document.querySelector(".weatherIcon"),
    temperature = document.querySelector(".temperature"),
    feelsLike = document.querySelector(".feelslike"),
    description = document.querySelector(".description"),
    date = document.querySelector(".date"),
    city = document.querySelector(".city"),
    HValue = document.getElementById("HValue"),
    WValue = document.getElementById("WValue"),
    SRValue = document.getElementById("SRValue"),
    SSValue = document.getElementById("SSValue"),
    CValue = document.getElementById("CValue"),
    Forecast = document.querySelector(".Forecast"),
    Pvalue = document.getElementById("PValue"),
    visibilty = document.getElementById("VisibilityKmValue");

const WEATHER_API_ENDPOINT = `https://api.openweathermap.org/data/2.5/weather?appid=0fcdf48d796759815cce99f892ee8b3e&q=`;
const FORECAST_API_ENDPOINT = `https://api.openweathermap.org/data/2.5/forecast?appid=0fcdf48d796759815cce99f892ee8b3e&units=metric&`;

function findUserLocation() {
    Forecast.innerHTML = "";
    fetch(WEATHER_API_ENDPOINT + userLocation.value)
        .then((response) => response.json())
        .then((data) => {
            if (data.cod != 200) {
                alert(data.message);
                return;
            }

            city.innerHTML = `${data.name}, ${data.sys.country}`;
            weatherIcon.style.background = `url(https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png)`;

            const options = {
                hour: "numeric",
                minute: "numeric",
                hour12: true,
            };

            const visibilityInKm = (data.visibility / 1000).toFixed(1);
            visibilty.innerHTML = visibilityInKm + " <span>km</span>";
            console.log(data.sys.sunrise);
            
            SRValue.innerHTML = formatUnixTime(data.sys.sunrise, options);
            SSValue.innerHTML = formatUnixTime(data.sys.sunset, options);
            // SRValue.innerHTML = formatUnixTime(data.sys.sunrise, data.timezone, options);
            // SSValue.innerHTML = formatUnixTime(data.sys.sunset, data.timezone, options);

            fetch(FORECAST_API_ENDPOINT + `lat=${data.coord.lat}&lon=${data.coord.lon}`)
                .then((response) => response.json())
                .then((forecastData) => {
                    temperature.innerHTML = temconverter(forecastData.list[0].main.temp);
                    feelsLike.innerHTML = `Feels like ${Math.round(forecastData.list[0].main.feels_like)}°C`;
                    description.innerHTML = forecastData.list[0].weather[0].description;

                    Pvalue.innerHTML = forecastData.list[0].main.pressure + " <span>hPa</span>";

                    const optionsDate = {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true,
                    };

                    const indianTime = new Date().toLocaleString("en-IN", optionsDate);

                    date.innerHTML = indianTime;


                    HValue.innerHTML = `${Math.round(forecastData.list[0].main.humidity)}<span>%</span>`;
                    WValue.innerHTML = `${Math.round(forecastData.list[0].wind.speed)}<span> m/s</span>`;
                    CValue.innerHTML = `${forecastData.list[0].clouds.all}<span>%</span>`;

                    forecastData.list.forEach((item, index) => {
                        if (index % 8 === 0) {
                            let div = document.createElement('div');
                            const dayOptions = {
                                weekday: 'long',
                                month: 'long',
                                day: 'numeric',
                            };
                            let daily = formatUnixTime(item.dt, dayOptions);
                            div.innerHTML = daily;
                            div.innerHTML += `<img src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" />`;
                            div.innerHTML += `<p class="forecast-desc">${item.weather[0].description}</p>`;
                            div.innerHTML += `<span><span>${temconverter(item.main.temp_min)}</span> &nbsp;&nbsp;<span>${temconverter(item.main.temp_max)}</span></span>`;
                            Forecast.appendChild(div);
                        }
                    });
                });
        });
}

function formatUnixTime(dtValue, options = {}) {
    const date = new Date(dtValue * 1000);
    return date.toLocaleString("en-IN", { timeZone: "Asia/Kolkata", ...options });
}

function temconverter(temp) {
    let tempValue = Math.round(temp);
    if (converter.value === "°C") {
        return tempValue + "<span>°C</span>";
    } else {
        let ctof = (tempValue * 9) / 5 + 32;
        return ctof + "<span>°F</span>";
    }
}
