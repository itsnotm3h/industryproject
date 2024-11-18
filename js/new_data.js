let POKEMONURL = "https://pokeapi.co/api/v2/pokemon/";
let GEOJSON = "geojson/GreenMarkBuildingsGEOJSON.geojson";
const JSON_BIN_BASE_URL = "https://api.jsonbin.io/v3";
const JSON_BIN_ID = "67263111acd3cb34a8a14d55";
const JSON_BIN_GAME_ID = "673a3076e41b4d34e455dc60";


// This is to load all the data from the pokemon library.

let pokemonLimit = 300;
let pokemonLibrary = [];
let geoLibrary = [];
let questionLibrary = [];
let pokemonCollection = [];
let gameStatus = "";
let gameData = [];
let gameId="";

//map setting
let map;
let sgLat = 1.290270;
let sgLng = 103.851959;
let pokemonMarker;
const markerTimers = {};

//Game Setting

let questionLimit = 10;
let timerSetting = [5, 6, 7, 8];
let previousIndex = 0;
let generatedData = [];
// let timerSetting = [0.1, 0.1, 0.1, 0.1];
let currentIndex;
let sessionID = localStorage.getItem("progress");

var questionModal = new bootstrap.Modal(document.getElementById('myModal'), {
  keyboard: false
});


//loadMap 
async function loadMap(lat, lng) {

  // if (map) {
  //   map.remove(); // Remove the existing map if it exists
  // }

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

    generatedData.push({ "questionId": questionId, "question": questionText, "answer": questionAnswer, "level": level, "userAnswer": "", "status": "", "timer": { "duration": timer, "current": timer }, pokemon: { "index": pokemonIndex, "coordinates": latLng, "imageURL": pokemon[pokemonIndex - 1].pokemonImage } });

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
    // pokemonLibrary = pokemonLibrary.sort((a, b) => a.key - b.key);
    generateQuestions(questionLibrary, geoLibrary, pokemonLibrary);
    loadGallery(pokemonLibrary);
    if(sessionID)
    {
      generatedData = gameData.session[sessionID].question;
      showSavedGallery(gameData.session[sessionID].PokemonGallery)

    }
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
      let markerStatus = element.status;

      if (index == 0) {
        newlat = lat;
        newlng = lng;

        generatedData[0].pokemon.coordinates[1] = lat;
        generatedData[0].pokemon.coordinates[0] = lng;
      }

      if(markerStatus == "correct")
      {
        // markerIMG = "./img/captured.png";
        markerTimer = "Success";

      }
      if(markerStatus == "wrong")
      {
        // markerIMG = "./img/empty.png";
        markerTimer = "Failed";
      }

      let customDivIcon = L.divIcon({
        html: `<div class="marker-wrapper" data-marker-id="${markerQuestionId}"><div class="indicator hidden" data-arrow-id="${markerQuestionId}"><img src="./img/arrow.svg" class="img-fluid"></div><img src="${markerIMG}" class="img-fluid pokeIcon" data-pokeIcon-id="${markerQuestionId}"><div class="text-center timer w-50 m-auto" data-timer-id="${markerQuestionId}">${markerTimer}</div></div>`,
        iconSize: [100, 100],
        zIndex: 1000,
        className: "markerIndex"
      });

      pokemonMarker = new L.marker([newlat, newlng], { icon: customDivIcon });
      pokemonMarker.addTo(map);

    });


    removeExisting();

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
  currentIndex = questionID;

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


function showCorrectAnswer(target) {
  let currentAnswer = document.querySelector(".answerInput");
  let status = target.status;
  let time = target.timer.current;
  let answer = target.answer;


  if (status != "" && time <= 0) {

    currentAnswer.value = getUserAnswer(currentIndex);
    document.querySelector(".icon").classList.remove("hidden");
    document.querySelector(".submitAnswer").classList.add("hidden");
    document.querySelector(".answerInput").disabled = true;
    document.querySelector(".correctAnswer").innerHTML = answer;


    //remove hidden class from
    if (status == "correct") {
      document.querySelector(".answerIcon").src = "./img/icon_correct.svg";
    }

    if (status == "wrong") {
      document.querySelector(".answerIcon").src = "./img/icon_wrong.svg";
    }
  }

  else {
    currentAnswer.value = "";
    document.querySelector(".answerInput").disabled = false;
    document.querySelector(".icon").classList.add("hidden");
    document.querySelector(".submitAnswer").classList.remove("hidden");
  }

}




function addClick(item) {

  if (item == "marker") {
    let allMarker = document.querySelectorAll(".marker-wrapper");
    allMarker.forEach((marker) => {
      marker.addEventListener("click", function () {
        let questionId = this.dataset.markerId;
        let target = generatedData.find(item => item.questionId === questionId);
        let question = target.question;


        document.querySelector(".modal-title").innerHTML = "Question:";
        document.querySelector(".question").innerHTML = `<p>${question}</p>`;

        questionModal.show();

        currentIndicator(questionId);
        scrollQuestion(questionId);
        showCorrectAnswer(target);



        function clearAllIntervalsExceptCurrent(questionId) {
          for (let index in markerTimers) {
            if (index != questionId && markerTimers[index]) {
              clearInterval(markerTimers[index]);
              markerTimers[index] = null; // Optionally reset the cleared interval
            }
          }
        }

        //save timer in map so that we can stop the interval when they answer correct. I have use the index id as the key to retrieving the timer. 
        if (!markerTimers[questionId] && target.status!="correct" && target.status!="wrong") {

          clearAllIntervalsExceptCurrent(questionId);
          // Start a new timer for this marker
          markerTimers[questionId] = setInterval(() => {
            setTimer(target, questionId);
          }, 1000);
        }

        let showQuestion = document.querySelector(`[data-question-id=${questionId}]`);
        showQuestion.classList.remove("deactivate");
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
        currentIndicator(questionId);

      });
    });



  }

}


function getUserAnswer(x) {
  let target = generatedData.find(item => item.questionId === x);
  let answer = target.userAnswer;

  console.log(target);

  if (!answer) {
    return "blank";
  }
  else {
    return answer;
  }
}


function checkAnswer(target, userInput) {

  let answer = target.answer;
  let pokemonIndex = target.pokemon.index;
  let questionItem = document.querySelector(`[data-question-id="${currentIndex}"]`);
  let pokemonIcon = document.querySelector(`[data-pokeicon-id="${currentIndex}"]`)
  let timer = document.querySelector(`[data-timer-id="${currentIndex}"]`);
  let questionIcon = document.querySelector(`[data-question-icon="${currentIndex}"]`);
  let questionStatus = document.querySelector(`[data-questionitem-status="${currentIndex}"]`);

  target.userAnswer = userInput;
  let pokemonIconImg ="";
  let timerHTML = "";

  if (userInput == answer) {
    target.status = "correct";
    console.log(generatedData)
    questionItem.classList.add("correct");
    questionItem.classList.remove("wrong");
    pokemonIconImg ="captured";
    timerHTML = "Success";

    let pokeCheck = pokemonCollection.find(item=>item == pokemonIndex);
    if(!pokeCheck){
      pokemonCollection.push(pokemonIndex);
    }
  }

  else {
    target.status = "wrong";
    questionItem.classList.add("wrong");
    questionItem.classList.remove("correct");
    pokemonIconImg ="empty";
    timerHTML = "Failed";
  }

  target.timer.current = 0;
  clearInterval(markerTimers[currentIndex]);

  
  questionStatus.innerHTML = `<img src="./img/${target.status}-status.png" class="img-fluid">`;
    pokemonIcon.src = `./img/${pokemonIconImg}.svg`;
    timer.innerHTML = `${timerHTML}`;
  questionIcon.src = `./img/${target.status}.png`;

  if(pokemonCollection.length != 0)
  {
    showSavedGallery(pokemonCollection);
  }
  showCorrectAnswer(target);
  quizCheck();
  questionModal.hide();


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
  let timer = document.querySelector(`[data-timer-id="${index}"]`);
  let questionItem = document.querySelector(`[data-question-id="${index}"]`);

  if (miliSec >= 0) {
    //how many milisecond in minutes ()
    var minutes = Math.floor(miliSec / 1000 / 60);
    var seconds = Math.floor(miliSec / 1000) % 60;
    if (seconds <= 9) {
      seconds = "0" + seconds;
    }
    timer.innerHTML = minutes + ":" + seconds;
    miliSec = miliSec - 1000;
    target.timer.current = miliSec;

    if (miliSec < 0) {

      let entry = generatedData.find(item => item.questionId == currentIndex);
      let status = entry.status;
      let userInput = entry.userAnswer;
      console.log(userInput)
        
      if (status != "correct" ) {
        questionItem.classList.add("wrong");
        target.timer.current = 0;
        checkAnswer(target,userInput);
      }
      showCorrectAnswer(entry);
      clearInterval(markerTimers[index]);
    }
  }

}


async function loadGameData() {

  let response = await axios.get(`${JSON_BIN_BASE_URL}/b/${JSON_BIN_GAME_ID}/latest`);
  
  return response.data.record;
}



async function saveGameData(object) {
  const response = await axios.put(`${JSON_BIN_BASE_URL}/b/${JSON_BIN_GAME_ID}`, object);

}



function removeExisting()
{

  for(let item in generatedData)
  {
    let index = generatedData[item].questionId;
    let IMG="";


    if(generatedData[item].status=="correct")
    {
      IMG="captured";
      document.querySelector(`[data-pokeIcon-id=${index}]`).src=`./img/${IMG}.svg`

    }
    else if(generatedData[item].status=="wrong")
      {
      IMG="empty";
      document.querySelector(`[data-pokeIcon-id=${index}]`).src=`./img/${IMG}.svg`

    }
    

  }
 

}




