//this is to add in question to the side panel
function loadPreset(questionArray) {
    for (let questionNo in questionArray) {
        let questionTab = document.querySelector(".questionLog");
        let questionNum = parseInt(questionNo) + 1;
        let questionID = userQuestions[questionNo].id;
        let difficulty = userQuestions[questionNo].difficulty;
        let progressStatus = questionArray[questionNo].status;
        const questionContainer = document.createElement("div");
        questionContainer.dataset.questionId = questionID;

        questionContainer.classList.add('col-12', 'p-1', 'm-1', 'mt-0', 'questionItem', 'd-flex');

        let imgURl = "normal";
        if (progressStatus == "") {
            questionContainer.classList.add('deactivate');
        }

        if (progressStatus == "correct" || progressStatus == "wrong") {
            imgURl = progressStatus;
            questionContainer.classList.add(`${progressStatus}`);
        }

        let starHmtl = `<img src="img/star.svg" class="img-fluid" width="10px">`.repeat(difficulty);


        questionContainer.innerHTML = `<div class="p-2 pb-0 w-100 d-flex"  data-question-id="${questionID}">
        <div class="questionIcon"><img src="img/${imgURl}.png" class="img-fluid pokemonIcon"></div>
        <div class="my-auto questionText ps-1"><div><b>Question ${questionNum}</b></div><div class="w-100 d-flex align-items-stretch"><div class="smallText align-self-center">Level:${starHmtl}</div><div class="status ps-1"></div></div>
        </div>`;
        questionTab.appendChild(questionContainer);

    }

    let questionbtn = document.querySelectorAll(".questionItem");

    try {

        // if you want to use for each and you need to pass the index.
        questionbtn.forEach((element, index) => {
            element.addEventListener("click", () => setMarkerClick(element, index));
        });

    }
    catch (error) {
        console.log(error);
    }


}


function showQuestion(x, index) {


    let question = userQuestions[index].question;

    document.querySelector(".modal-title").innerHTML = "Question:";
    document.querySelector(".answerLabel").innerHTML = "Your Anwser";
    document.querySelector(".question").innerHTML = `<p>${question}</p>`;

    answer = userAnswer[index].answer;
    questionModal.show();

}

function setMarkerClick(x, index) {
    let coordinate = userGeneratedData[index].coordinates;
    map.setView([coordinate[1], coordinate[0]]);
}

function loadLocalStorage() {
    // set questionProgress,userAnswer;
    localProgress = JSON.parse(localStorage.getItem("progress"));
    localAnswer = JSON.parse(localStorage.getItem("userAnswer"));
    localGallery = JSON.parse(localStorage.getItem('userPokemon'));
    localQuestion = JSON.parse(localStorage.getItem("userQuestion"));


    if (localProgress == null || localAnswer == null) {
        return false
    }
    else {
        return true
    }



};


function saveLocalStorage() {

    localStorage.setItem("progress", JSON.stringify(userGeneratedData));
    localStorage.setItem("userAnswer", JSON.stringify(userAnswer));
    localStorage.setItem("userPokemon", JSON.stringify(collectPokemon));
    localStorage.setItem("userQuestion", JSON.stringify(userQuestions));

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

        if (stopNum > 1024) {
            stopNum = 1023;
        }



        for (let j = startNum; j < stopNum; j++) {
            const pokmonCont = document.createElement("div");
            pokmonCont.classList.add('pokemonGallery', 'flex-fill', 'deactivate');

            pokmonCont.dataset.pokemonIndex = fullPokemon[j].pokemonId;

            pokmonCont.innerHTML = `<img src="${fullPokemon[j].pokemonImage}"  class="img-fluid" >`;
            wrapper.appendChild(pokmonCont);
        }

        slider.append(wrapper);
        galleryStage.append(slider);
    }

}

function detectGallery(x) {

    let allGallery = document.querySelectorAll(".pokemonGallery");

    try {

        for (let item in allGallery) {
            if (item.dataset.pokemonIndex == x) {
                item.classList.remove("deactivate");
                console.log(x);
            }
        }


    }
    catch (error) {
        console.log(error);
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






//To start the application for the website.
function app() {
 //true


    //loading presets and datas
    document.addEventListener("DOMContentLoaded", async function () {


        userQuestions = await loadQuestionData();

        // console.log(fullPokemon);

        let local = loadLocalStorage();
        console.log(local);

        if (!local) {
            await loadAllPokemonData();
            await generateQuestion(userQuestions.length);
            await getLocation(function (coords) {
                sgLat = coords[0];
                sgLng = coords[1];
                loadMap(sgLat, sgLng);
            });

            loadGallery(fullPokemon);
            loadPreset(userGeneratedData);
        }

        else {
            // console.log("its works")
            await loadAllPokemonData();

            let checkQuestion = JSON.stringify(userQuestions) === JSON.stringify(localQuestion);



            var notificationModal = new bootstrap.Modal(document.getElementById('notification'), {
                keyboard: false
              });


            if(!checkQuestion)
            {

                  notificationModal.show();


                  document.querySelector(".submitYes").addEventListener("click",function(){

                    localStorage.removeItem("progress");
                    localStorage.removeItem("userAnswer");
                    localStorage.removeItem("userQuestion");


                location.reload();

                  })


                  document.querySelector(".submitNo").addEventListener("click",function(){
                    notificationModal.hide();

                  })


            
            }

            userQuestions = localQuestion;
            userGeneratedData = localProgress;

            await getLocation(function (coords) {
                sgLat = coords[0];
                sgLng = coords[1];
                loadMap(sgLat, sgLng);
            });

            loadGallery(fullPokemon);
            loadPreset(localProgress);

          
        }


    })

    // after all is load add in the function.
    let submitBtn = document.querySelector(".submitAnswer");
    submitBtn.addEventListener("click", function () {
        checkAnswer(answer)
    }
    );

    document.querySelector("#galleryButton").addEventListener("click", function () {
        showSavedGallery(localGallery);
        document.querySelector("#map").classList.add("hidden");
        document.querySelector("#gallery").classList.remove("hidden");
    })

    document.querySelector("#homeButton").addEventListener("click", function () {
        document.querySelector("#map").classList.remove("hidden");
        document.querySelector("#gallery").classList.add("hidden");
    });

    document.querySelector("#saveButton").addEventListener("click", function () {
        saveLocalStorage();
        alert("You have saved.");
    })

    document.getElementById('carouselExample').addEventListener('slid.bs.carousel', function (event) {
        const slideNumber = event.to + 1; // `event.to` gives the zero-based index
        document.querySelector("#boxName").innerHTML = `BOX ${slideNumber}`;
    });



    function checkAnswer(answer) {
        let userinput = document.querySelector(".answerInput").value;
        let questionItem = document.querySelectorAll(".questionItem");
        let pokemonIcon = document.querySelectorAll(".pokemonIcon");
        let questionStatus = document.querySelectorAll(".status");

        if (userinput == answer) {

            let noticeTab = document.querySelector(".noticeTab");
            // let questionTab = document.querySelector(".answerQuestionTab");
            map.removeLayer(markerArray[currentId]);
            questionItem[currentId].classList.remove("wrong");
            questionItem[currentId].classList.add("correct");
            pokemonIcon[currentId].src = "./img/correct.png";
            questionStatus[currentId].innerHTML = `<img src="./img/correct-status.png" class="img-fluid">`;

            noticeTab.innerHTML = `<img src="./img/thumbsup.jpg" class="img-fluid>`;

            noticeTab.classList.remove("hidden");
            let pokeIndex = userGeneratedData[currentId].pokemonIndex;
            let questIndex = userGeneratedData[currentId].questionIndex;

            userGeneratedData[currentId].status = "correct";
            userGeneratedData[currentId].timer = 0;


            // console.log(userGeneratedData);
            collectPokemon.push(pokeIndex);

            userAnswer.push({ "questionId": questIndex, "pokemonID": pokeIndex, answer, status: "correct" });

            let addPokemon = document.querySelector(`[data-pokemon-index="${pokeIndex}"]`);



            addPokemon.classList.remove("deactivate");
            addPokemon.classList.add("colured");


            let questionbtn = document.querySelector(`.questionLog [data-question-id="${questIndex}"]`);

            questionbtn.removeEventListener("click", setMarkerClick);
            questionModal.hide();
        }

        else {
            console.log("Wrong Answer");
            let questIndex = userGeneratedData[currentId].questionIndex;
            let pokeIndex = userGeneratedData[currentId].pokemonIndex;

            questionItem[currentId].classList.remove("correct");
            questionItem[currentId].classList.add("wrong");
            pokemonIcon[currentId].src = "./img/wrong.png";
            questionStatus[currentId].innerHTML = `<img src="./img/wrong-status.png" class="img-fluid">`;

            userGeneratedData[currentId].status = "wrong";



            userAnswer.push({ "questionId": questIndex, "pokemonID": pokeIndex, answer, status: "wrong" });

            questionModal.hide();
        }
    }
}



app();

