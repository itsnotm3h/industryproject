//this is to add in question to the side panel
function loadPreset(questionArray) {


    let questionTab = document.querySelector(".questionLog");
    questionTab.innerHTML = "";

    for (let questionNo in questionArray) {
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

        if (progressStatus == "redo") {

        }

        if (progressStatus == "correct" || progressStatus == "wrong") {
            imgURl = progressStatus;
            questionContainer.classList.add(`${progressStatus}`);
        }

        let starHmtl = `<img src="img/star.svg" class="img-fluid" width="10px">`.repeat(difficulty);


        questionContainer.innerHTML = `<div class="p-2 pb-0 w-100 d-flex"  data-questionitem-id="${questionID}">
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


function scrollQuestion(questionIndex) {
    let scrollItem = document.querySelector(`[data-questionitem-id="${questionIndex}"`)
    scrollItem.scrollIntoView({ behavior: 'smooth', block: "start" }, true);
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
    let questionID = userQuestions[index].id;
    currentIndicator(questionID);

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

function saveLocalStorage() {

    localStorage.setItem("progress", JSON.stringify(userGeneratedData));
    localStorage.setItem("userAnswer", JSON.stringify(userAnswer));
    localStorage.setItem("userPokemon", JSON.stringify(collectPokemon));
    localStorage.setItem("userQuestion", JSON.stringify(userQuestions));
    localStorage.setItem("timer", JSON.stringify(defaultTimer));

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

function showNotification(event) {
    const submitYes = document.querySelector(".submitYes");

    let localAnswer = JSON.parse(localStorage.getItem("userAnswer"));



    var notificationModal = new bootstrap.Modal(document.getElementById('notification'), {
        keyboard: false
    });

    document.querySelector(".submitNo").style.display = "block";


    let title = "";
    let message = "";

    let count = 0;
    for (let correct in localAnswer) {
        if (localAnswer[correct].status == "correct") {
            count++;
        }
    }

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



        if (event == "reGenerate" || event == "newQuestion") {


            localStorage.removeItem("progress");
            localStorage.removeItem("userAnswer");
            localStorage.removeItem("userQuestion");
            localStorage.removeItem("timer");

            location.reload();

            // loadPreset(userGeneratedData);
            notificationModal.hide();

        }

        if (event == "redo") {

            let localProgress = JSON.parse(localStorage.getItem("progress"));
            let defaultTimer = JSON.parse(localStorage.getItem('timer'));


            userGeneratedData = localProgress;


            console.log("redo");

            for (let timer in userGeneratedData) {

                if (userGeneratedData[timer].status == "wrong") {
                    userGeneratedData[timer].timer = defaultTimer[timer].timer;
                    userGeneratedData[timer].status = "redo";
                }
            }

            console.log(userGeneratedData);

            saveLocalStorage();
            loadPreset(userGeneratedData);
            notificationModal.hide();



        }





    })


    document.querySelector(".submitNo").addEventListener("click", function () {
        let localProgress = JSON.parse(localStorage.getItem("progress"));

        for (let timer in localProgress) {
            if (localProgress[timer].status == "wrong") {
                localProgress[timer].timer = 0;
            }
        }
        userGeneratedData = localProgress;
        saveLocalStorage();

        removeCorrect(userGeneratedData);
        document.querySelector(".explainSection").classList.remove("hidden");

        notificationModal.hide();

    })


}




//To start the application for the website.
function app() {
    //true

    let localProgress = JSON.parse(localStorage.getItem("progress"));
    let localAnswer = JSON.parse(localStorage.getItem("userAnswer"));

    

    if(localProgress)
    {
        let correct=0;
        let wrong=0;


        for (let item in localProgress) {
            if (localProgress[item].status == "correct") {
                correct++;
            }
            if (localProgress[item].status == "wrong") {
                wrong++;
            }
        }

        if(correct == 10)
        {
            showNotification("reGenerate");
        }
        if(wrong <= 10 && localAnswer.length==10)
            {
                showNotification("redo");
            }
    }


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


            if (!checkQuestion) {
                showNotification("newQuestion");
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

        let userinput = document.querySelector(".answerInput").value;

        if (userinput == "") {
            document.querySelector(".error-answer").classList.add("was-validated");
            document.querySelector(".error-answer").innerHTML = "Field is empty";
            document.querySelector(".error-answer").style.display = "block";
        }
        else {
            document.querySelector(".error-answer").style.display = "none";
            checkAnswer(answer);
        }
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
        let questIndex = userGeneratedData[currentId].questionIndex;
        let pokeIndex = userGeneratedData[currentId].pokemonIndex;
        let answerStatus = "";


        
 


        let localAnswer = JSON.parse(localStorage.getItem("userAnswer"));
        let localGallery = JSON.parse(localStorage.getItem('userPokemon'));
        let localProgress = JSON.parse(localStorage.getItem("progress"));



        if (localAnswer) {
            userAnswer = localAnswer;
        }
        if (localGallery) {
            collectPokemon = localGallery;
        }
        if(localProgress)
        {
            userGeneratedData = localProgress;

        }
        


        if (userinput == answer) {



            let noticeTab = document.querySelector(".noticeTab");
            // let questionTab = document.querySelector(".answerQuestionTab");
            // map.removeLayer(markerArray[currentId]);
            questionItem[currentId].classList.remove("wrong");
            questionItem[currentId].classList.add("correct");
            pokemonIcon[currentId].src = "./img/correct.png";
            questionStatus[currentId].innerHTML = `<img src="./img/correct-status.png" class="img-fluid">`;

            noticeTab.innerHTML = `<img src="./img/thumbsup.jpg" class="img-fluid>`;

            noticeTab.classList.remove("hidden");
            userGeneratedData[currentId].status = "correct";
            userGeneratedData[currentId].timer = 0;

            answerStatus = "correct";


            const checkedPokemon = collectPokemon.find(item => item === pokeIndex);

            if (!checkedPokemon) {
                collectPokemon.push(pokeIndex);
            }


            let addPokemon = document.querySelector(`[data-pokemon-index="${pokeIndex}"]`);
            document.querySelector(`[data-pokeIcon-id="${questIndex}"]`).src = "./img/captured.svg";
            document.querySelector(`[data-timer-id="${questIndex}"]`).innerHTML = "Success";

            addPokemon.classList.remove("deactivate");
            addPokemon.classList.add("colured");

            questionModal.hide();
        }
        else {
            console.log("Wrong Answer");

            questionItem[currentId].classList.remove("correct");
            questionItem[currentId].classList.add("wrong");
            pokemonIcon[currentId].src = "./img/wrong.png";
            questionStatus[currentId].innerHTML = `<img src="./img/wrong-status.png" class="img-fluid">`;

            userGeneratedData[currentId].status = "wrong";
            answerStatus = "wrong";

            questionModal.hide();
        }


        ///update the localStorage for userAnswer;

        try {



        
            const checkedQuestion = userAnswer.find(item => item.questionId === questIndex);

            if (checkedQuestion) {
                checkedQuestion.status = answerStatus;
                checkedQuestion.answer = userinput;

            }
            else {
                userAnswer.push({ "questionId": questIndex, "pokemonID": pokeIndex, "answer":userinput, status: answerStatus });
            }

            saveLocalStorage();



            let correct = 0;

            for (let time in userGeneratedData) {
                if (userGeneratedData[time].status == "correct") {
                    correct++;
                }
            }



            let redo = 0;

            for (let time in userGeneratedData) {
                if (userGeneratedData[time].status == "redo") {
                    redo++;
                }
            }


            
            let wrong = 0;

            for (let time in userGeneratedData) {
                if (userGeneratedData[time].status == "wrong") {
                    wrong++;
                }
            }


            if (userAnswer.length == 10) {
                if (correct == 10 && redo == 0) {
                    showNotification("reGenerate");
                }
                else if (redo == 0 && wrong !=0) {
                    showNotification("redo");
                }


            }

        }
        catch (e) {
            console.log(e);
        }




    }

}

app();

