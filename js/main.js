// alert("hello world!");

// 1. Get the user's location
// 2. Set the map to their view
// 3. What is the game format? the map will refresh every 3 sections. 



//get location:
const x = document.getElementById("demo");
let currentLongtitude = 0;
let currentLatitude = 0;

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else { 
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

function showPosition(position) {

  currentLongtitude = position.coords.longitude;
  currentLatitude = position.coords.latitude
}



var map = L.map('map').setView([51.505, -0.09], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);


// map.locate({setView: true})
//         .on('locationerror', function(e){
//             console.log(e);
//             alert("Location access has been denied.");
//         });


//get random pokemon
let min = 1;
let max = 1025;
function getRandomIndex() {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
  }

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
      // storyBoard = await loadData();
      // loadStory();
      loadData();

  

        
  })

  //Function for items that is on the webpage.
  preparePage();


}


app();