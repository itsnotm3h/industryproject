let POKEMONURL = "https://pokeapi.co/api/v2/pokemon/";
let fullPokemon = [];

var map;
let sgLat = 1.290270;
let sgLng = 103.851959;


//get random function to randomise question and pokemon
let questionLimit = 20;
let timer = [1000]

function getRandomIndex(min,max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

let fullData = [];
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

  
//pulling up data via axios. 
 async function loadPokemon(index) {

    let response = await axios.get(POKEMONURL+index);
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

    
 async function generateData(){
    //pokemonUniqueID,pokemonName,pokemonImage,question,answer,time;
    let pokemonIndex = getRandomIndex(0,1025);
    let pokemonImage = await loadPokemon(pokemonIndex);
    let questionIndex = getRandomIndex(0,mathQuestions.length);
    let timer = getRandomIndex(1200,6000);
    fullData.push({pokemonIndex,pokemonImage,questionIndex,timer});
};


//detect the location.
function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition,showError);
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }
  
  //To use the location coordinates to load the map.
  function showPosition(position) {
    let lat = position.coords.latitude;
    let lng = position.coords.longitude;
    loadMap(lat,lng);
  }
  
  
  // this is a default from HTML api.
  function showError(error) {
    switch(error.code) {
      case error.PERMISSION_DENIED:
        console.log("User denied the request for Geolocation.");
        // this is to generate the map even if the user doesnt allow geolocation.
        loadMap(sgLat,sgLng);
        break;
      case error.POSITION_UNAVAILABLE:
        console.log("Location information is unavailable.");
         // this is to generate the map even if the user doesnt allow geolocation.
        loadMap(sgLat,sgLng);
        break;
      case error.TIMEOUT:
        console.log("The request to get user location timed out.");
        break;
      case error.UNKNOWN_ERROR:
        console.log("An unknown error occurred.");
        break;
    }
  }

  var MyDemoClass = L.Marker.extend({

    // A property with initial value = 42
    myDemoProperty: 42,   

    // A method 
    myDemoMethod: function() { return this.myDemoProperty; }
    
});

var myDemoInstance = new MyDemoClass();

// This will output "42" to the development console
console.log( myDemoInstance.myDemoMethod() );   

  
  //Load the map
  async function loadMap(lat,lng) {
  
    map = L.map('map').setView([lat, lng], 18);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
  
  
    for (let i = 0; i < questionLimit; i++) {
    
    // it need to be await as we have to wait for Axios to load the image URL.
    await generateData();

    let imageURL= fullData[i].pokemonImage;
    let questionIndex= fullData[i].questionIndex;
  
    // console.log(imageURL);

    var customDivIcon = L.divIcon({
        html: `<div class="marker-wrapper"><img src="${imageURL}" class="img-fluid pokeIcon"><div class="text-center timer w-100">Marker Content</div></div>`,
        iconSize: [100, 100],
        className: "markerIndex-"+i
    });


  
      let extra = i * 0.0010;
      let pokemonMarker = L.marker([lat + extra, lng], {icon: customDivIcon});
      // let userAnswer = []; // to capture answer form user. [think if i want to capture this**************]
      pokemonMarker.addTo(map);

      pokemonMarker.addEventListener("click",function(e){

        //So that the question will only be loaded when the pokemon is clicked. 
        let question = mathQuestions[questionIndex].question;


        var questionModal = new bootstrap.Modal(document.getElementById('myModal'), {
          keyboard: false
        });
        
        document.querySelector(".modal-title").innerHTML = "Question:";
        document.querySelector(".question").innerHTML = `<p>${question}</p>`;

        questionModal.show();


        let answer = mathQuestions[fullData[i].questionIndex].answer;
        let userinput = document.querySelector(".answerInput").value;


        // put a check answer function here!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        

      })

      

      // singaporeMarker.classList.add("new-class");
    //   circle.addTo(map);
    }
  
  }