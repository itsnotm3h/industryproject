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

        if (status == "redo") {

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

            pokmonCont.dataset.pokemonIndex = x[j].pokemonId;

            pokmonCont.innerHTML = `<img src="${x[j].pokemonImage}"  class="img-fluid" >`;
            wrapper.appendChild(pokmonCont);
        }

        slider.append(wrapper);
        galleryStage.append(slider);
    }

}








function app() {

    // function to load data
    document.addEventListener("DOMContentLoaded", async function () {
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
            alert("You have saved.");
        }
    
    
    })
    
    document.getElementById('carouselExample').addEventListener('slid.bs.carousel', function (event) {
        const slideNumber = event.to + 1; // `event.to` gives the zero-based index
        document.querySelector("#boxName").innerHTML = `BOX ${slideNumber}`;
    });

    document.querySelector(".submitAnswer").addEventListener("click", function () {

        let userInput = document.querySelector(".answerInput").value;

        let entry = generatedData.find(item => item.questionId == currentIndex);

        checkAnswer(entry,userInput);
        // if (userinput == "") {
        //     document.querySelector(".error-answer").classList.add("was-validated");
        //     document.querySelector(".error-answer").innerHTML = "Field is empty";
        //     document.querySelector(".error-answer").style.display = "block";
        // }
        // else {
        //     document.querySelector(".error-answer").style.display = "none";
        //     checkAnswer(answer);
        // }
    }
    );



};

app();


