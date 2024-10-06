let POKEMONURL = "https://pokeapi.co/api/v2/pokemon/";
let GEOJSON = "geojson/GreenMarkBuildingsGEOJSON.geojson";
let fullPokemon = [];

var map;
let sgLat = 1.290270;
let sgLng = 103.851959;


//get random function to randomise question and pokemon
let questionLimit = 10;
let timerSetting = [5, 6, 7, 8];
let answer;
let pokemonMarker;
let markerArray = [];
let currentId;

//setting for modal
var questionModal = new bootstrap.Modal(document.getElementById('myModal'), {
  keyboard: false
});


function getRandomIndex(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

let fullData = [];
let selectedQuestion = [];
let mathQuestions = [
  {
    question: "What is 3/4 of 16?",
    answer: 12
  },
  {
    question: "If you have 5 apples and you buy 3 more, how many apples do you have in total?",
    answer: 8
  },
  {
    question: "A rectangle has a length of 10 cm and a width of 5 cm. What is the area?",
    answer: 50
  },
  {
    question: "What is 20% of 50?",
    answer: 10
  },
  {
    question: "If there are 12 students in a class and 3 are girls, what fraction of the class are boys?",
    answer: "3/4"
  },
  {
    question: "What is the perimeter of a square with a side length of 6 cm?",
    answer: 24
  },
  {
    question: "What is the sum of 567 and 234?",
    answer: 801
  },
  {
    question: "If a toy costs $15 and you pay with a $20 note, how much change do you get?",
    answer: 5
  },
  {
    question: "How many days are there in 3 weeks?",
    answer: 21
  },
  {
    question: "What is the difference between 100 and 47?",
    answer: 53
  }
]

let geoLibrary = [];

//pulling up data via axios. 
async function loadPokemon(index) {

  let response = await axios.get(POKEMONURL + index);
  return response.data.sprites.front_default;
  //   axios({
  //     method: 'get',
  //     url: POKEMONURL + index,
  //   })
  //     .then(function (response) {
  //     //   console.log(response.data.sprites.front_shiny);
  //       return response.data.sprites.front_shiny;
  //     })
  //     .catch(function (error) {
  //       // handle error
  //       console.log(error);
  //     });

}


async function loadGeoLocation() {

  let response = await axios.get(GEOJSON);
  return response.data;
}




async function generateData(x) {
  //pokemonUniqueID,pokemonName,pokemonImage,question,answer,time;

  geoLibrary = await loadGeoLocation();

  let pokemonIndex = getRandomIndex(0, 1025);
  let pokemonImage = await loadPokemon(pokemonIndex);
  let questionIndex = x;
  let timer = timerSetting[getRandomIndex(0, 3)];
  let coordinates = geoLibrary.features[getRandomIndex(0,2919)].geometry.coordinates;
  fullData.push({ pokemonIndex, pokemonImage, questionIndex, timer,coordinates });
};


//detect the location.
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError);
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
}

//To use the location coordinates to load the map.
function showPosition(position) {
  let lat = position.coords.latitude;
  let lng = position.coords.longitude;
  loadMap(lat, lng);
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


let submitBtn = document.querySelector(".submitAnswer");
submitBtn.addEventListener("click", function () {
  checkAnswer(answer)
}
);

function checkAnswer(answer) {
  let userinput = document.querySelector(".answerInput").value;
  if (userinput == answer) {
    console.log("Answer Correct");
    map.removeLayer(markerArray[currentId]);
    questionModal.hide();
  }
  else {
    console.log("Wrong Answer");
  }
}


//Load the map
async function loadMap(lat, lng) {

  map = L.map('map').setView([lat, lng], 16);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    minZoom:16,
    maxZoom: 18,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);


  for (let i = 0; i < questionLimit; i++) {

    // it need to be await as we have to wait for Axios to load the image URL.
    await generateData(i);

    let imageURL = fullData[i].pokemonImage;
    let questionIndex = fullData[i].questionIndex;
    let countDownTime = fullData[i].timer;

    // console.log(imageURL);

    var customDivIcon = L.divIcon({
      html: `<div class="marker-wrapper"><img src="${imageURL}" class="img-fluid pokeIcon"><div class="text-center timer w-50 m-auto" data-question-id="${i}"></div></div>`,
      iconSize: [100, 100],
      className: "markerIndex-" + i
    });


    // Latitude: Approximately 1.22° N to 1.48° N
    // Longitude: Approximately 103.60° E to 104.10° E

    //1, the limit of the lat and long 
    //2. calculate from your location whats the furthest you are away from the end.
    function getRandomCoordinates(min, max) {
      let randomInteger = Math.random() * (max - min)+ min;
      return Math.random() < 0.5 ? randomInteger : -randomInteger;
    };


    let randomLat = getRandomCoordinates(0.0001,0.026);
    let randomLng = getRandomCoordinates(0.0001,0.050);

    // console.log(randomLat,randomLng );

    if(i == 0)
    {
      randomLat = 0;
      randomLng = 0;
      pokemonMarker = L.marker([lat,lng], { icon: customDivIcon });

    }
    else{
      pokemonMarker = L.marker([(fullData[i].coordinates[1]), (fullData[i].coordinates[0])], { icon: customDivIcon });
    }


    // let randomLat = getRandomIndex(1.22 , 1.48);
    // let randomLng = getRandomIndex(103.60 , 104.10);
    // pokemonMarker = L.marker([(lat + randomLat), (lng + randomLng)], { icon: customDivIcon });
    // let userAnswer = []; // to capture answer form user. [think if i want to capture this****  **********]
    pokemonMarker.addTo(map);

    markerArray.push(pokemonMarker);


    let allTimer = document.querySelectorAll(".timer");
    let miliSec = countDownTime * 60 * 1000;
    let myInterval = setInterval(startTime, 1000);
    // let deleteCheck = setInterval(removeMarker(allTimer), 1000);


    function startTime() {

      if (miliSec > 0) {
        miliSec = miliSec - 1000;
        //how many milisecond in minutes ()
        var minutes = Math.floor(miliSec / 1000 / 60);
        var seconds = Math.floor(miliSec / 1000) % 60;
        if(seconds <=9)
        {
          seconds = "0" + seconds;
        }
        // console.log(thisTimer);
        allTimer[i].innerHTML = minutes + ":" + seconds;
      }
      else{
        removeMarker(allTimer);
      }
    }

    function removeMarker(allTimer){
     for(let t in allTimer)
      {
        if(allTimer[t].innerHTML == "0:00")
        {
          let questionId = allTimer[t].getAttribute("data-question-id");
          map.removeLayer(markerArray[questionId]);
        }

      }
    }





    pokemonMarker.addEventListener("click", function (e) {

      //So that the question will only be loaded when the pokemon is clicked. 
      let question = mathQuestions[questionIndex].question;


      document.querySelector(".modal-title").innerHTML = "Question:";
      document.querySelector(".question").innerHTML = `<p>${question}</p>`;

      questionModal.show();

      answer = mathQuestions[fullData[i].questionIndex].answer;

      currentId = i;



      // let questionTab = document.querySelector(".questionList");
      // const questionContainer = document.createElement("div");
      // questionContainer.dataset.questionId= i; 
      // questionContainer.classList.add('col-12','p-1','questionItem','d-flex');
      // questionContainer.innerHTML = `<div class="p-2"><img src="${imageURL}" class="img-fluid"></div><div class="my-auto"><b>Question:</b><br/>${question}</div>`;
      // questionTab.appendChild(questionContainer);

    })






    // singaporeMarker.classList.add("new-class");
    //   circle.addTo(map);
  }

}
