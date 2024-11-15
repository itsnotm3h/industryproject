let POKEMONURL = "https://pokeapi.co/api/v2/pokemon/";
let GEOJSON = "geojson/GreenMarkBuildingsGEOJSON.geojson";
const JSON_BIN_BASE_URL = "https://api.jsonbin.io/v3";
const JSON_BIN_ID = "67263111acd3cb34a8a14d55";

// This is to load all the data from the pokemon library.

let pokemonLimit = 300;
let pokemonLibrary = [];
let geoLibrary = [];
let questionLibrary = [];

//map setting
let map;
let sgLat = 1.290270;
let sgLng = 103.851959;
let pokemonMarker;
const markerTimers = {};

var questionModal = new bootstrap.Modal(document.getElementById('myModal'), {
  keyboard: false
});


//loadMap 
async function loadMap(lat, lng) {

  if (map) {
    map.remove(); // Remove the existing map if it exists
  }

  map = L.map('map').setView([lat, lng], 16);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    minZoom: 14,
    maxZoom: 16,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  addMarker(generatedData, lat, lng);
  addClick("marker");

};

//detect the location.
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      let lat = position.coords.latitude;
      let lng = position.coords.longitude;
      loadMap(lat, lng);
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


//This is to load Pokemon api. 
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
      return {
        id: 'null',
        name: 'Unknown Pokémon',
        image: 'Unknown'
      }
    }
  }
  catch (error) {
    console.error(`Failed to load Pokémon data for index ${index}:`, error);
    return {
      id: 'null',
      name: 'Unknown Pokémon',
      image: 'Unknown'
    };
  }

}


async function createPokemonLibrary() {
  const promises = [];

  for (let i = 1; i < pokemonLimit; i++) {
    promises.push(
      loadPokemonLibrary(i).then(pokemonData => {

        if (pokemonData.id != "null" && pokemonData.name != "Unknown Pokémon" && pokemonData.image != "Unknown") {
          let pokemonId = pokemonData.id;
          let pokemonName = pokemonData.name;
          let pokemonImage = pokemonData.image;
          pokemonLibrary.push({ pokemonId, pokemonName, pokemonImage });
        }
      })
    )

  }

  await Promise.all(promises);

}

//Load/Generate question Data

let questionLimit = 10;
let timerSetting = [5, 6, 7, 8];
let previousIndex = 0;
let generatedData = [];
// let timerSetting = [0.1, 0.1, 0.1, 0.1];


//1. load question from jsonbin
async function loadQuestionData() {
  let response = await axios.get(`${JSON_BIN_BASE_URL}/b/${JSON_BIN_ID}/latest`);
  return response.data.record;
}

//2. load coordinates to place the pokemon on map. 
async function loadGeoLocation() {
  let response = await axios.get(GEOJSON);
  return response.data.features
}


//3.generate question index;
function generateQuestions(question, coordinates, pokemon) {
  let checkQuestionIndex = [];
  let checkCoordinateIndex = [];
  let checkPokemonIndex = [];


  for (let j = 0; j < questionLimit; j++) {
    let questionIndex;
    let coordinateIndex;
    let pokemonIndex;

    let min = 0;
    let qMax = questionLibrary.length - 1;
    let cMax = geoLibrary.length - 1;
    let pMax = pokemonLibrary.length - 1;

    do {
      questionIndex = Math.floor(Math.random() * (qMax - min + 1)) + min;
      coordinateIndex = Math.floor(Math.random() * (cMax - min + 1)) + min;
      pokemonIndex = Math.floor(Math.random() * (pMax - min + 1)) + min;

    }
    while (
      checkQuestionIndex.includes(questionIndex) || checkCoordinateIndex.includes(coordinateIndex) || checkPokemonIndex.includes(pokemonIndex));


    // }

    checkQuestionIndex.push(questionIndex);
    checkCoordinateIndex.push(coordinateIndex);
    checkPokemonIndex.push(pokemonIndex);

    let questionId = question[questionIndex].id;
    let questionText = question[questionIndex].question;
    let questionAnswer = question[questionIndex].answer;
    let level = question[questionIndex].difficulty;

    let timer = (timerSetting[Math.floor(Math.random() * ((timerSetting.length - 1) - min + 1)) + min]) * 60 * 1000;;


    let latLng = coordinates[coordinateIndex].geometry.coordinates;

    generatedData.push({ "questionId": questionId, "question": questionText, "answer": questionAnswer, "level": level, "userAnswer":"", "status": "", "timer": { "duration": timer, "current": timer }, pokemon: { "index": pokemonIndex, "coordinates": latLng, "imageURL": pokemon[pokemonIndex - 1].pokemonImage } });

  }
  // return checkIndex;

}

//5. Load all data and start to generate Question
async function loadAllData() {

  // you have to first load all the data 
  try {
    await createPokemonLibrary();
    geoLibrary = await loadGeoLocation();
    questionLibrary = await loadQuestionData();
    pokemonLibrary = pokemonLibrary.sort((a, b) => a.key - b.key);
    generateQuestions(questionLibrary, geoLibrary, pokemonLibrary);
    loadPreset(generatedData);

  }
  catch (error) {
    console.error("Error loading data:", error.message);
  }
}

//6. Add marker into the map.

function addMarker(x, lat, lng) {
  try {

    x.forEach((element, index) => {


      let newlat = element.pokemon.coordinates[1];
      let newlng = element.pokemon.coordinates[0];

      let markerQuestionId = element.questionId;
      let markerIMG = element.pokemon.imageURL;
      let markerTimer = setDisplayTime(element.timer.current);

      if (index == 0) {
        newlat = lat;
        newlng = lng;

        generatedData[0].pokemon.coordinates[1] = lat;
        generatedData[0].pokemon.coordinates[0] = lng;

      }

      let customDivIcon = L.divIcon({
        html: `<div class="marker-wrapper" data-marker-id="${markerQuestionId}"><div class="indicator hidden" data-arrow-id="${markerQuestionId}"><img src="./img/arrow.svg" class="img-fluid"></div><img src="${markerIMG}" class="img-fluid pokeIcon" data-pokeIcon-id="${markerQuestionId}"><div class="text-center timer w-50 m-auto" data-timer-id="${markerQuestionId}">${markerTimer}</div></div>`,
        iconSize: [100, 100],
        zIndex: 1000,
        className: "markerIndex"
      });


      let marker = L.marker([newlat, newlng], { icon: customDivIcon }).addTo(map);

      if (marker) {
        map.addLayer(marker);
      } else {
        console.log("Marker could not be created.");
      }


      pokemonMarker = new L.marker([newlat, newlng], { icon: customDivIcon });
      pokemonMarker.addTo(map);

    });


  }
  catch (error) {
    console.log(error);

  }


}

function scrollQuestion(questionIndex) {
  let scrollItem = document.querySelector(`[data-questionitem-id="${questionIndex}"`)
  scrollItem.scrollIntoView({ behavior: 'smooth', block: "start" }, true);
}


function currentIndicator(questionID) {

  let allIndicator = document.querySelectorAll(`.indicator`);
  let allQuestionItem = document.querySelectorAll(`.questionItem`);

  allIndicator.forEach((element) => {

      if (element.dataset.arrowId == questionID) {
          element.classList.remove("hidden");
      }
      if (element.dataset.arrowId != questionID) {
          element.classList.add("hidden");
      }
  });

  allQuestionItem.forEach((question) => {

      if (question.dataset.questionId == questionID) {
          question.classList.add("currentQuestion");
      }
      if (question.dataset.questionId != questionID) {
          question.classList.remove("currentQuestion");
      }
  });
}




function addClick(item) {

  if (item == "marker") {
    let allMarker = document.querySelectorAll(".marker-wrapper");
    allMarker.forEach((marker) => {
      marker.addEventListener("click", function () {
        let questionId = this.dataset.markerId;
        let target = generatedData.find(item => item.questionId === questionId);

        let question = target.question;
        let answer = target.answer;
        let status = target.status;
        let currentAnswer = document.querySelector(".answerInput");

        document.querySelector(".modal-title").innerHTML = "Question:";
        document.querySelector(".question").innerHTML = `<p>${question}</p>`;

        questionModal.show();

        currentIndicator(questionId);
        scrollQuestion(questionId);



        let isCorrect = document.querySelector(`[data-question-id="${questionId}"]`).classList.contains("correct");
        let isWrong = document.querySelector(`[data-question-id="${questionId}"]`).classList.contains("wrong");
  
  
        if (isCorrect || (isWrong && target.timer.current <=0)) {
          currentAnswer.value = target.userAnswer;
  
          // document.querySelector(".userAnswer").innerHTML = userAnswer;
          document.querySelector(".icon").classList.remove("hidden");
          document.querySelector(".submitAnswer").classList.add("hidden");
          document.querySelector(".answerInput").disabled = true;
          document.querySelector(".userAnswer").innerHTML = correcAnswer;
          document.querySelector(".explainSection").classList.remove("hidden");
  
  
  
          //remove hidden class from
  
  
          if (isCorrect) {
            document.querySelector(".answerIcon").src = "./img/icon_correct.svg";
            document.querySelector(".explainSection").classList.add("hidden");
          }
  
          if (isWrong) {
            document.querySelector(".answerIcon").src = "./img/icon_wrong.svg";
          }
  
        }
        else {
          currentAnswer.value = "";
          document.querySelector(".answerInput").disabled = false;
          document.querySelector(".explainSection").classList.add("hidden");
          document.querySelector(".icon").classList.add("hidden");
          document.querySelector(".submitAnswer").classList.remove("hidden");
        }

        function clearAllIntervalsExceptCurrent(questionId) {
          for (let index in markerTimers) {
            if (index != questionId && markerTimers[index]) {
              clearInterval(markerTimers[index]);
              markerTimers[index] = null; // Optionally reset the cleared interval
            }
          }
        }
  
        //save timer in map so that we can stop the interval when they answer correct. I have use the index id as the key to retrieving the timer. 
        if (!markerTimers[questionId]) {
  
          clearAllIntervalsExceptCurrent(questionId);
          // Start a new timer for this marker
          markerTimers[questionId] = setInterval(() => {
            setTimer(target, questionId);
          }, 1000);
        }
  
        let showQuestion = document.querySelector(`[data-question-id=${questionId}]`);
        showQuestion.classList.remove("deactivate");

        

        //function checkAnswer(userInput,correctAnswer);







      })
    });
  }

  if (item == "questionItem") {
    let questionItem = document.querySelectorAll(".questionItem");
    questionItem.forEach((item) => {
      let questionId = item.dataset.questionId;
      let target = generatedData.find(item => item.questionId === questionId);

      item.addEventListener("click", () => {
        map.setView([target.pokemon.coordinates[1], target.pokemon.coordinates[0]]);
      });
    });

  }

}



function setDisplayTime(x) {
  var minutes = Math.floor(x / 1000 / 60);
  var seconds = Math.floor(x / 1000) % 60;
  if (seconds <= 9) {
    seconds = "0" + seconds;
  }

  let display = minutes + ":" + seconds;
  return display;

}

function setTimer(target, index) {

  let miliSec = target.timer.current;
  let questionStatus = target.status;
  let pokemonIcon = document.querySelectorAll(".pokemonIcon");
  let questionItem = document.querySelectorAll(".questionItem");
  let questIndex = index;
  let pokeIndex = target.pokemonIndex;

  console.log(target);


  if (miliSec >= 0) {
    //how many milisecond in minutes ()
    var minutes = Math.floor(miliSec / 1000 / 60);
    var seconds = Math.floor(miliSec / 1000) % 60;
    if (seconds <= 9) {
      seconds = "0" + seconds;
    }
    // console.log(thisTimer);
    timer.innerHTML = minutes + ":" + seconds;
    miliSec = miliSec - 1000;
    userGeneratedData[index].timer = miliSec;
    saveLocalStorage();

    if (miliSec < 0) {
      // check id the answer is already in and correct/ esle put it as wrong. 
      // map.removeLayer(markerArray[index]);
      let check = questionItem[index].classList.contains("correct");

      if (!check) {
        questionItem[index].classList.add("wrong");
        pokemonIcon[index].src = "./img/wrong.png";
        questionStatus[index].innerHTML = `<img src="./img/wrong-status.png" class="img-fluid">`;

        const checkedQuestion = userAnswer.find(item => item.questionId === questIndex);

        if (checkedQuestion) {
          checkedQuestion.status = "wrong";
        }
        else {
          userAnswer.push({ "questionId": questIndex, "pokemonID": pokeIndex, answer, status: "wrong" });
        }


        document.querySelector(`[data-pokeIcon-id="${questIndex}"]`).src = "./img/empty.svg";
        document.querySelector(`[data-timer-id="${questIndex}"]`).innerHTML = "Failed";


      }
      else {
        document.querySelector(`[data-timer-id="${questIndex}"]`).innerHTML = "Success";

      }

    }
  }

}






