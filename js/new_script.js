//To start the application for the website.


//this is to add in question to the side panel
function loadPreset(question) {


    let questionTab = document.querySelector(".questionLog");
    questionTab.innerHTML = "";

    question.forEach((item, index) => {

        let questionNo = index + 1;
        let questionId = item.questionId;
        let level = item.level;
        let status = item.status;

        const questionContainer = document.createElement("div");
        questionContainer.dataset.questionId = questionId;
        questionContainer.classList.add('col-12', 'p-1', 'm-1', 'mt-0', 'questionItem', 'd-flex');


        let imgURl = "normal";
        if (status == "") {
            questionContainer.classList.add('deactivate');
        }
        if(status=="redo")
        { 
            questionContainer.classList.remove('deactivate');
        }

        if (status == "correct" || status == "wrong") {
            imgURl = status;
            questionContainer.classList.add(`${status}`);
        }

        let starLevel = `<img src="img/star.svg" class="img-fluid" width="10px">`.repeat(level);

        questionContainer.innerHTML = `<div class="p-2 pb-0 w-100 d-flex"  data-questionitem-id="${questionId}"><div class="questionIcon" ><img src="img/${imgURl}.png" class="img-fluid pokemonIcon" data-question-icon="${questionId}"></div><div class="my-auto questionText ps-1"><div><b>Question ${questionNo}</b></div><div class="w-100 d-flex align-items-stretch"><div class="smallText align-self-center">Level:${starLevel}</div><div class="status ps-1" data-questionitem-status="${questionId}"></div></div></div>`;

        questionTab.appendChild(questionContainer);
    })

    addClick("questionItem");
}

function loadGallery(x) {

    let total = x.length;
    let column = 10;
    let row = 4;
    let galleryStage = document.querySelector(".carousel-inner");

    for (let i = 0; i < Math.ceil(total / (column * row)); i++) {
        const slider = document.createElement("div");
        const wrapper = document.createElement("div");
        wrapper.classList.add('d-flex', 'flex-wrap',);


        if (i == 0) {
            slider.classList.add('carousel-item', 'active');
        }
        else {
            slider.classList.add('carousel-item');
        }

        let startNum = i * (column * row);
        let stopNum = (column * row) * (i + 1);

        if (stopNum > total) {
            stopNum = total - 1;
        }



        for (let j = startNum; j < stopNum; j++) {
            const pokmonCont = document.createElement("div");
            pokmonCont.classList.add('pokemonGallery', 'flex-fill', 'deactivate');

            pokmonCont.dataset.pokemonIndex = (x[j].pokemonId);
            pokmonCont.innerHTML = `<img src="${x[j].pokemonImage}"  class="img-fluid" >`;
            wrapper.appendChild(pokmonCont);
        }

        slider.append(wrapper);
        galleryStage.append(slider);
    }

}

function showNotification(event,count) {
    const submitYes = document.querySelector(".submitYes");

    var notificationModal = new bootstrap.Modal(document.getElementById('notification'), {
        keyboard: false
    });

    document.querySelector(".submitNo").style.display = "block";


    let title = "";
    let message = "";

    if (event == "newQuestion") {
        title = "New Questions Detected!";
        message = "Do you wish to proceed to refresh the question? You will lose your progress so far."

    }

    if (event == "redo") {


        title = "You have complete the quiz";
        message = `Your score:${count} <br/> Please click yes to redo the wrong question and no to reveal the correct answer.`
    }

    if (event == "reGenerate") {
        title = "You have complete the quiz";
        message = `Your score:${count} <br/> Please click yes to restart.`
        document.querySelector(".submitNo").style.display = "none";
    }


    document.querySelector(".notificationTitle").innerHTML = title;
    document.querySelector(".notificationText").innerHTML = message;

    notificationModal.show();


    submitYes.addEventListener("click", function () {

        gameStatus=event;




        if (event == "reGenerate" || event == "newQuestion") {

            location.reload();
            notificationModal.hide();

        }

        if (event == "redo") {

            console.log("redo");

            for (let item in generatedData) {

                if (generatedData[item].status == "wrong") {
                    let questionId = generatedData[item].questionId;

                    generatedData[item].status = "redo";
                    generatedData[item].timer.current = generatedData[item].timer.duration;

                    let markerTimer = setDisplayTime(generatedData[item].timer.current);


                    document.querySelector(`[data-pokeIcon-id=${questionId}]`).src=generatedData[item].pokemon.imageURL;
                    

                    document.querySelector(`[data-timer-id=${questionId}]`).innerHTML=markerTimer;


                    markerTimers[questionId] = null; 
                }
            }
            
            document.querySelector(".explainSection").classList.add("hidden");
            loadPreset(generatedData);
            notificationModal.hide();
  

        }

    })


    document.querySelector(".submitNo").addEventListener("click", function () {
        document.querySelector(".explainSection").classList.remove("hidden");
        notificationModal.hide(); 

        gameStatus="reviewAnswer";

    })


}


function quizCheck() {

    try {

        let correct = 0;
        let wrong = 0;
        let redo = 0;
        let questionLeft = 0;


        for (let item in generatedData) {
            if (generatedData[item].status == "correct") {
                correct++;
            }
            else if (generatedData[item].status == "wrong") {
                wrong++;
            }
            else if (generatedData[item].status == "redo") {
                redo++;
            }
            else {
                questionLeft++;
            }
        }

        console.log("correct:" + correct);
        console.log("wrong:" + wrong);
        console.log("Redo:" + redo);
        console.log("questionLeft:" + questionLeft);

        if(questionLeft == 0 && redo == 0)
        {
            if(correct == 10)
            {
                showNotification("reGenerate",correct);
            }
            else if(wrong !=0)
            {
                showNotification("redo",correct);
            }
        }

    }
    catch (e) {
        console.log(e);
    }


}

function showSavedGallery(x) {

    for (let pokemon in x) {
        let pokeId = x[pokemon];
        let addPokemon = document.querySelector(`[data-pokemon-index="${pokeId}"]`);

        addPokemon.classList.remove("deactivate");
        addPokemon.classList.add("colured");

    }

}




function app() {

    // function to load data
    document.addEventListener("DOMContentLoaded", async function () {
        gameData = await loadGameData();
        await loadAllData();
        await getLocation(function (coords) {
            sgLat = coords[0];
            sgLng = coords[1];
        });

    

    });


    document.querySelector(".sidebar").addEventListener("click", function (e) {

        if (e.target.id == "galleryButton") {
            // showSavedGallery(localGallery);
            document.querySelector("#map").classList.add("hidden");
            document.querySelector("#gallery").classList.remove("hidden");
        }
        if (e.target.id == "homeButton") {
            document.querySelector("#map").classList.remove("hidden");
            document.querySelector("#gallery").classList.add("hidden");
        }

        if (e.target.id == "saveButton") {
            // showSavedGallery(localGallery);
            // saveLocalStorage();
            if(!sessionID)
            {
                let alphabet = ["a","b","c","e","f","g","h","i","j","k","l","n","m"];
                let randomNumber = Math.floor(Math.random() * (100 - 1 + 1)) + 1;
    
                    gameId = alphabet[ (Math.floor(Math.random() * (alphabet.length-1 - 0 + 1)) + 0)]+ randomNumber + alphabet[ Math.floor(Math.random() * (alphabet.length-1 - 0 + 1)) + 0] + randomNumber
           
                gameData.session[gameId] = {
                    "question": generatedData,
                    "PokemonGallery": pokemonCollection,
                    "GameStatus": gameStatus
                };
    
                localStorage.setItem("progress", gameId);

            }
            else{

                gameData.session[sessionID].question = generatedData;
                gameData.session[sessionID].PokemonGallery = pokemonCollection;
                gameData.session[sessionID].gameStatus = pokemonCollection;


            };

            saveGameData(gameData);
            alert("You have saved your progress.");

    
        }
    })

    document.getElementById('carouselExample').addEventListener('slid.bs.carousel', function (event) {
        const slideNumber = event.to + 1; // `event.to` gives the zero-based index
        document.querySelector("#boxName").innerHTML = `BOX ${slideNumber}`;
    });

    document.querySelector(".submitAnswer").addEventListener("click", function () {

        let userInput = document.querySelector(".answerInput").value;

        let entry = generatedData.find(item => item.questionId == currentIndex);


        if (userInput == "") {
            document.querySelector(".error-answer").classList.add("was-validated");
            document.querySelector(".error-answer").innerHTML = "Field is empty";
            document.querySelector(".error-answer").style.display = "block";
        }
        else {
            document.querySelector(".error-answer").style.display = "none";
            checkAnswer(entry, userInput);
        }
    }
    );
};

app();



