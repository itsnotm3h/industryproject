//get random function to randomise question and pokemon
let questionLimit = 20;
let timerSetting = [5, 6, 7, 8];
let answer;

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

}

async function loadGeoLocation() {
  let response = await axios.get(GEOJSON);
  return response.data;
}


async function generateQuestion (x)
{

  geoLibrary = await loadGeoLocation();
   const promises = []; // Array to hold promises

    for (let i = 0; i < x; i++) {
        let pokemonIndex = getRandomIndex(0, 1025);
        // Push the promise for loading the Pokémon image into the array
        promises.push(
            loadPokemon(pokemonIndex).then(pokemonImage => {
                let questionIndex = x;
                let timer = (timerSetting[getRandomIndex(0, 3)])* 60 * 1000;
                let coordinates = geoLibrary.features[getRandomIndex(0, 2919)].geometry.coordinates;
                fullData.push({ pokemonIndex, pokemonImage, questionIndex, timer, coordinates });
            })
        );
    }

    // Wait for all Pokémon images to load concurrently
    await Promise.all(promises);
    
}



