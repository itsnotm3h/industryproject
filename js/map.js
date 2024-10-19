let POKEMONURL = "https://pokeapi.co/api/v2/pokemon/";
let GEOJSON = "geojson/GreenMarkBuildingsGEOJSON.geojson";
let fullPokemon = [];

var map;
let sgLat = 1.290270;
let sgLng = 103.851959;

let pokemonMarker;
let markerArray = [];
let timerInterval;


//Loading the Pokemon Data + Generating marker. 


//detect the location.
function getLocation() {
  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
          let lat = position.coords.latitude;
          let lng = position.coords.longitude;
          loadMap(lat,lng);
      }, showError);
  } else {
      console.log("Geolocation is not supported by this browser.");
  }
}

// this is a default from HTML api.
function showError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      console.log("User denied the request for Geolocation.");
      // this is to generate the map even if the user doesnt allow geolocation.
      loadMap(sgLat, sgLng);
      break;
    case error.POSITION_UNAVAILABLE:
      console.log("Location information is unavailable.");
      // this is to generate the map even if the user doesnt allow geolocation.
      loadMap(sgLat, sgLng);
      break;
    case error.TIMEOUT:
      console.log("The request to get user location timed out.");
      break;
    case error.UNKNOWN_ERROR:
      console.log("An unknown error occurred.");
      break;
  }
}


//loadMap 
async function loadMap(lat, lng) {

  geoLibrary = await loadGeoLocation();
  await generateQuestion(questionLimit);

  map = L.map('map').setView([lat, lng], 16);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    minZoom:12,
    // maxZoom: 18,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);


  //generate marker here. 
  for (let eachMarker in fullData)
    {
      let imageURL = fullData[eachMarker].pokemonImage;
      // to not that the coordinate is [lng,lat,0]
      let lat = fullData[eachMarker].coordinates[1];
      let lng = fullData[eachMarker].coordinates[0];


  
      let customDivIcon = L.divIcon({
        html: `<div class="marker-wrapper"><img src="${imageURL}" class="img-fluid pokeIcon"><div class="text-center timer w-50 m-auto" data-question-id="${eachMarker}"></div></div>`,
        iconSize: [100, 100],
        zIndex: 1000,
        className: "markerIndex" 
      });
  
      pokemonMarker = L.marker([lat,lng], { icon: customDivIcon });
      pokemonMarker.addTo(map);
      markerArray.push(pokemonMarker);     
      let timer = document.querySelectorAll(".timer");
      // setInterval(startTime(miliSec,timer[eachMarker]),1000);
      timerInterval = setInterval(() => {
        setTimer(timer[eachMarker],eachMarker)
    }, 1000);

    };
};


function removeMarker(){
let allTimer = document.querySelectorAll(".timer");

  for(let t in allTimer)
   {
     if(allTimer[t].innerHTML == "0:00")
     {
      map.removeLayer(markerArray[t]);
     }

   }
 }


function setTimer(timer,index) {

  let miliSec = fullData[index].timer;
  
  if(miliSec >= 0) {

    //how many milisecond in minutes ()
    var minutes = Math.floor(miliSec / 1000 / 60);
    var seconds = Math.floor(miliSec / 1000) % 60;
    if(seconds <=9)
    {
      seconds = "0" + seconds;
    }
    // console.log(thisTimer);
    timer.innerHTML = minutes + ":" + seconds;
    miliSec = miliSec - 1000;
    fullData[index].timer =  miliSec;
  }
  else{
    removeMarker();
  }
}


