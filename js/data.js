let POKEMONURL = "https://pokeapi.co/api/v2/pokemon/";
let GEOJSON = "geojson/GreenMarkBuildingsGEOJSON.geojson";
let questionLimit = 10;
let timerSetting = [5, 6, 7, 8];
// let timerSetting = [0.1, 0.1, 0.1, 0.1];

let maxPokemon = 1024;
let ignoreIndex = [];
let result = [];
let answer;
let currentId;

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

let fullData = [];
let fullPokemon = [];
let selectedQuestion = [];
let mathQuestions = [
  {
    question: "What is 3/4 of 16?",
    answer: 12,
    difficulty:3
  },
  {
    question: "If you have 5 apples and you buy 3 more, how many apples do you have in total?",
    answer: 8,
    difficulty:2
  },
  {
    question: "A rectangle has a length of 10 cm and a width of 5 cm. What is the area?",
    answer: 50,
    difficulty:3
  },
  {
    question: "What is 20% of 50?",
    answer: 10,
    difficulty:1
  },
  {
    question: "If there are 12 students in a class and 3 are girls, what fraction of the class are boys?",
    answer: "3/4",
    difficulty:2
  },
  {
    question: "What is the perimeter of a square with a side length of 6 cm?",
    answer: 24,
    difficulty:1
  },
  {
    question: "What is the sum of 567 and 234?",
    answer: 801,
    difficulty:2
  },
  {
    question: "If a toy costs $15 and you pay with a $20 note, how much change do you get?",
    answer: 5,
    difficulty:1
  },
  {
    question: "How many days are there in 3 weeks?",
    answer: 21,
    difficulty:2
  },
  {
    question: "What is the difference between 100 and 47?",
    answer: 53,
    difficulty:1
  }
]

let geoLibrary = [];


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

async function generateQuestion(x) {

  let coordinates;
  geoLibrary = await loadGeoLocation();

  for (let i = 0; i < x; i++) {
    let pokemonIndex = getRandomIndex(0, 1025, ignoreIndex);
    let questionIndex = i;
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
          html: `<div class="marker-wrapper"><img src="${imageURL}" class="img-fluid pokeIcon"><div class="text-center timer w-50 m-auto" data-question-id="${eachMarker}"></div></div>`,
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
        let question = mathQuestions[questionIndex].question;
  
        document.querySelector(".modal-title").innerHTML = "Question:";
        document.querySelector(".question").innerHTML = `<p>${question}</p>`;
  
        questionModal.show();
        answer = mathQuestions[questionIndex].answer;
        currentId = eachMarker;

        timerInterval = setInterval(() => {
          setTimer(timer[eachMarker],eachMarker)
      }, 1000);

        let showQuestion = document.querySelectorAll(".questionItem");
        showQuestion[questionIndex].classList.remove("deactivate");
  
      })
      }; 
  };
  
  
  
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
      
      if(miliSec == 0){
        map.removeLayer(markerArray[index]);
      }
    }
  }

