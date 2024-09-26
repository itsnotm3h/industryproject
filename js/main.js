// alert("hello world!");

// 1. Get the user's location - done
// 2. Set the map to their view - done
// 3. What is the game format? the map will refresh every 3 sections. 
// 4. Timer on the questions. 


// About pokemon markers
// 1. I have to set questions + location + answer + pokemon + timer;
// 1.1 How do i set the location at random. 
// 1.2 Need a function to set all the arrays. 
// 2. On click it will out the question based on the dataset on the Array; 
// 3. validate question and answer through array.
// 4. if correct it will delete the icon and add pokemon into library.


//get location:
const x = document.getElementById("demo");
let currentLongtitude = 0;
let currentLatitude = 0;
var map;

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else { 
    console.log("Geolocation is not supported by this browser.");
  }
}

function showPosition(position) {

  currentLongtitude = position.coords.longitude;
  currentLatitude = position.coords.latitude;

  map = L.map('map').setView([position.coords.latitude, position.coords.longitude], 18);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);



// let singaporeMarker = L.marker([1.29, 103.85]);
// singaporeMarker.addTo(map);

for(i=0; i<questionLimt; i++)
  {
    let circle = L.circle([currentLatitude+0.02, currentLongtitude], {
      color: 'red',
      fillColor:"orange",
      fillOpacity:0.5,
      radius: 10,
      className: 'new-class',
  })

    let extra = i*0.0010;
    let singaporeMarker = L.marker([currentLatitude+extra, currentLongtitude]);
    singaporeMarker.addTo(map);
    // singaporeMarker.classList.add("new-class");
    circle.addTo(map);

  }

  
let markerDetect = document.querySelector(".leaflet-interactive");

markerDetect.addEventListener("click",function(){
  console.log("YYYYYEEESSSS!!!!!");
})


}


//get random pokemon
let min = 1;
let max = 1025;
let questionLimt = 10;
function getRandomIndex() {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

let pokemonArray = [];

// function generatePokemon(){

//   for(i=0; i<questionLimt; i++)
//   {
//     pokemonArray.push(loadData());

//   }

// };


let POKEMONURL = "https://pokeapi.co/api/v2/pokemon/";
  
//pulling up data via axios. 
function loadData(){

  let randIndex = getRandomIndex();

  axios({
    method: 'get',
    url: POKEMONURL + randIndex ,
  })
    .then(function (response) {
      console.log(response.data.sprites.front_shiny);
      // return response.data.sprites.front_shiny;
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });

}


    //To start the application for the website.
function app() {

  //Loading the data storyBoard.
  document.addEventListener("DOMContentLoaded", async function () {
    getLocation();
    // generatePokemon(); 

    
  })

  //add a marker



  console.log(pokemonArray);


}


app();