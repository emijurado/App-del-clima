/*capturar los elementos de DOM pra modificarlos despues */

let container = document.getElementById("container");
let searchForm = document.getElementById("search__submit");
let searchInput = document.getElementById("search__input")
let temperatureDegrees = document.getElementById("degreenumber")
let velocidadViento = document.getElementById("speedViento")
let icono = document.getElementById("sun")
let timezone = document.getElementById("description")
let hora = document.getElementById("hora")
let fechaDia = document.getElementById("fechaDia")
let min = document.getElementById("min")
let max = document.getElementById("max")

const hourlyWeatherData = document.getElementById('weather-forecast')
const days = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado','Domingo'];
const ciudadLabel = document.getElementById('ciudad');

//capturamos el elemento selecionado del "selector de ciudades"
const select = document.getElementById("select");
//const searchCity = document.getElementById("search").addEventListener("click", getClima);
const myLocalizacion =document.getElementById("myLocation");


/*************************************************************** */
  //TO DO
  //ACOMODAR LOS NOMBRES DE LOS ELEMENTOS DEL MOSTRARDIARIOBYFOR()
  //USAR ALGUN COMPONENTE DE BOOSTRAP 5
  //AHORA MUESTRA DIARIO, PERO TARIA BUENO QUE TAMBIEN MOSTRARA POR HORA (CLIMA POR HORA (VER CODIGO DE CYWEATHER))
  //cambiar el fondo de panatlla dia-noche (segun la hora (VER CODIGO WEATHER-MAIN))
  //HACER QUE APENAS ENTRE A LA PAGINA WEB, DETECTE LA UBICACION  (VER CODIGO WEATHER-MAIN)
  //USAR OTRA API (api.bigdatacloud.net) PARA QUE TRAIGA EL NOMBRE DE LA CIUDAD Y PAIS CON LOS DATOS DE LATITUD Y LONGITUD (VER CODIGO WEATHER-MAIN)

  //displayBackgroundImage(data);
  //mostrara los datos en pantalla
  // displayData(data);
/*************************************************************** */


//que me pida una ciudad
//windown.onload=()=>{
//  getweatherData("sau paulo")
//}


//COMENTO la funcion del boton BUSCAR porque ya no muestro el boton
//porque al selecionar del SELECT OPTION ya se ejecuta la consulta al API

// function getClima() {
//   document.getElementById("search").innerHTML = "ENCONTRADO!";
//     getData(lat.value, long.value)
//     hourlyWeatherData.innerHTML = ''
// }

const opcionCambiada = () => {
  console.log("Cambio");
  var value = select.value;
  var ciudadSelect = select.options[select.selectedIndex].text;
  var option = select.options[select.selectedIndex];
  var attrs = option.attributes;
  var datalat = option.getAttribute("data-latitude");
  var datalon = option.getAttribute("data-longitude");

  console.log(datalat);
  console.log(datalon);
  console.log(value, ciudadSelect);

  getData(datalat, datalon);

};

select.addEventListener("change", opcionCambiada);


function getData(latitude, longitude) {
  hourlyWeatherData.innerHTML = ''

  fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relativehumidity_2m,cloudcover_mid,windspeed_120m&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,rain_sum,windgusts_10m_max&timezone=auto&current_weather=true&timezone=auto`)
    .then(res => res.json()).then(data => {
      console.log(data)
      mostrarDataCard(data);
      mostrarDiarioByFor(data);
    })

}

//consigo el clima de mi ubicacion actual
myLocalizacion.addEventListener('click', () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  }
  else {
    alert("Your browser does not support geolocation api")
  }

})

function onSuccess(position) {
  hourlyWeatherData.innerHTML = ''
  let { latitude, longitude } = position.coords
  fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relativehumidity_2m,cloudcover_mid,windspeed_120m&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,rain_sum,windgusts_10m_max&timezone=auto&current_weather=true&timezone=auto`).then(res => res.json()).then(data => {
    console.log(data)
    mostrarDataCard(data);
    mostrarDiarioByFor(data);
  })
}

function onError(error) {
  console.log(error)
}

function mostrarDataCard(data) {
  //console.log(data.current_weather)


  var d = new Date(data.current_weather.time);
  var dayName = days[d.getDay()];

  //REVISAR porque mantiene el formate css de CIUDAD
    ciudadLabel.innerText = select.options[select.selectedIndex].text;
  temperatureDegrees.innerText = data.current_weather.temperature + '°C';
  velocidadViento.innerText = data.current_weather.windspeed + ' km/h';
  fechaDia.innerText = data.current_weather.time.substring(0, 10) + '--' + dayName;

  //REVISAR porque no sobreescribe el texto del elemento, sino que lo concatena
  //ejemplo min y max
  min.innerText = data.daily.temperature_2m_min[0] + '°C';
  max.innerText = data.daily.temperature_2m_max[0] + '°C';
  
}

function mostrarDiarioByFor(data) {
  console.log(data.daily)
  console.log(data.daily.sunrise[0])

  //let otherHoursForecast = '';
  for (let x = 0; x <= 6; x++) {

      let time_data = data.daily.time[x]
      //obtenemos el nombre del dia
      var d = new Date(time_data);
      var dayName = days[d.getDay()];

      let temp_min = data.daily.temperature_2m_min[x]
      let temp_max = data.daily.temperature_2m_max[x]
      let amanecer = data.daily.sunrise[x].substring(11, 16)
      let atardecer = data.daily.sunset[x].substring(11, 16)


      hourlyWeatherData.innerHTML += ` <div class="weather-forecast-item">
          <div class="hour"> ${(time_data + " " + dayName)}  <span id='am-pm'></span></div>
          <div class="each-weather-item">
           <i class="fa fa-thermometer-half" aria-hidden="true"></i>
          <div class="temp">${temp_min}   &#176;C MIN</div>
          </div>
          <div class="each-weather-item wind-speed">
          <i class="fas fa-wind"></i>
          <div class="">${temp_max} &#176;C MAX</div>
          </div>
          <div class="each-weather-item">
          <img src="sun.png" class="card-img-top3">
          <div class="humidity">Amanece: ${amanecer}</div>
          </div>
          <div class="each-weather-item">
          <i class="fa-solid fa-cloud"></i>
          <div class="cloud-cover">Atarcede: ${atardecer}</div>
          </div>
      </div>`

  }
}