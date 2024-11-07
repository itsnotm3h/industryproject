let POKEMONURL = "https://pokeapi.co/api/v2/pokemon/";
let GEOJSON = "geojson/GreenMarkBuildingsGEOJSON.geojson";
const JSON_BIN_BASE_URL="https://api.jsonbin.io/v3";
const JSON_BIN_ID  = "67263111acd3cb34a8a14d55";
let questionLimit = 10;
let timerSetting = [5, 6, 7, 8];
// let timerSetting = [0.1, 0.1, 0.1, 0.1];

let maxPokemon = 1024;
let ignoreIndex = [];
let correct = [];
let answer;
let currentId;
let collectPokemon=[];


let fullData = [];
let fullPokemon = [];
let selectedQuestion = [];
let userQuestions = [];

let geoLibrary = [];

//load all data from the pokemon api;
async function loadAllPokemonData() {
  const promises = [];

  for (let i = 1; i < maxPokemon; i++) {
    promises.push(
      loadPokemonLibrary(i).then(pokemonData => {

        if(pokemonData.id!="null" && pokemonData.name!="Unknown Pokémon" && pokemonData.image!="Unknown")
        {
          let pokemonId = pokemonData.id;
          let pokemonName = pokemonData.name;
          let pokemonImage = pokemonData.image;
          fullPokemon.push({ pokemonId, pokemonName, pokemonImage });
        }
      })
    )
    
  }

  await Promise.all(promises);

}

//setting for modal
var questionModal = new bootstrap.Modal(document.getElementById('myModal'), {
  keyboard: false
});

function getRandomIndex(min, max, ignore) {
  let calculate;
  calculate = Math.floor(Math.random() * (max - min + 1)) + min;

  if (ignore) {
    let check = ignore.includes(calculate);

    while (check) {
      calculate = Math.floor(Math.random() * (max - min + 1)) + min;
    }
  }

  return calculate;
};


async function loadQuestionData (){
  let response = await axios.get(`${JSON_BIN_BASE_URL}/b/${JSON_BIN_ID}/latest`);
  return response.data.record;
}

async function loadGeoLocation() {
  let response = await axios.get(GEOJSON);
  return response.data;
}


async function loadPokemonLibrary(index) {
  try {
    let response = await axios.get(POKEMONURL + index);
    if (response.data && response.data.id && response.data.name && response.data.sprites.front_default) {
      return {
        id: response.data.id,
        name: response.data.name,
        image: response.data.sprites.front_default,
      }
    }
    else {
      ignoreIndex.push(index);
      return {
        id: 'null',
        name: 'Unknown Pokémon',
        image: 'Unknown'
      }
    }
  }
  catch (error) {
    // console.error(`Failed to load Pokémon data for index ${index}:`, error);
    return {
      id: 'null',
      name: 'Unknown Pokémon',
      image: 'Unknown'
    };
  }

}



async function generateQuestion(x) {

  let coordinates;
  geoLibrary = await loadGeoLocation();

  for (let i = 0; i < x; i++) {
    let pokemonIndex = getRandomIndex(0, 1025, ignoreIndex);
    let questionIndex = userQuestions[i].id;
    let timer = (timerSetting[getRandomIndex(0, 3, "")]) * 60 * 1000;
    let pokemonImage = fullPokemon[pokemonIndex - 1].pokemonImage;
    coordinates = geoLibrary.features[getRandomIndex(1, 1025, "")].geometry.coordinates;
    fullData.push({ pokemonIndex, pokemonImage, questionIndex, timer, coordinates });
  }
}


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

  
    map = L.map('map').setView([lat, lng], 16);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      minZoom:14,
      maxZoom: 16,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
  
    fullData[0].coordinates[1] = lat;
    fullData[0].coordinates[0] = lng;
  
  
    //generate marker here. 
    for (let eachMarker in fullData)
      {
        let imageURL = fullData[eachMarker].pokemonImage;
        let questionIndex = fullData[eachMarker].questionIndex;
        
        // to not that the coordinate is [lng,lat,0]
        let newlat = fullData[eachMarker].coordinates[1];
        let newlng = fullData[eachMarker].coordinates[0];
  
      
  
        let customDivIcon = L.divIcon({
          html: `<div class="marker-wrapper"><img src="${imageURL}" class="img-fluid pokeIcon"><div class="text-center timer w-50 m-auto" data-question-id="${questionIndex}"></div></div>`,
          iconSize: [100, 100],
          zIndex: 1000,
          className: "markerIndex" 
        });
    
        pokemonMarker = L.marker([newlat,newlng], { icon: customDivIcon });
        pokemonMarker.addTo(map);
        markerArray.push(pokemonMarker);     
        let timer = document.querySelectorAll(".timer");
        // setInterval(startTime(miliSec,timer[eachMarker]),1000);
  
  
        pokemonMarker.addEventListener("click", function (e) {

  
        //So that the question will only be loaded when the pokemon is clicked. 
        let question = userQuestions[eachMarker].question;
  
        document.querySelector(".modal-title").innerHTML = "Question:";
        document.querySelector(".question").innerHTML = `<p>${question}</p>`;
  
        questionModal.show();
        answer = userQuestions[eachMarker].answer;
        currentId = eachMarker;

        timerInterval = setInterval(() => {
          setTimer(timer[eachMarker],eachMarker)
        }, 1000);

        let showQuestion = document.querySelectorAll(".questionItem");
        showQuestion[eachMarker].classList.remove("deactivate");
  
      })
      }; 
  };
  
  
  
  function setTimer(timer,index) {
  
    let miliSec = fullData[index].timer;
    let questionStatus = document.querySelectorAll(".status");
    let pokemonIcon = document.querySelectorAll(".pokemonIcon"); 
    let questionItem = document.querySelectorAll(".questionItem");
    
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
      
      if(miliSec == 0){
        // check id the answer is already in and correct/ esle put it as wrong. 
        map.removeLayer(markerArray[index]);
        questionItem[currentId].classList.add("wrong");
        pokemonIcon[index].src="/img/wrong.png";
        questionStatus[index].innerHTML =`<img src="/img/wrong-status.png" class="img-fluid">`;
      }
    }
  }

