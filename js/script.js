//this is to add in question to the side panel
function loadPreset(questionArray) {
    for (let questionNo in questionArray) {
        let questionTab = document.querySelector(".questionLog");
        let questionIndex = parseInt(questionNo) + 1;
        let difficulty = mathQuestions[questionNo].difficulty;
        const questionContainer = document.createElement("div");
        questionContainer.dataset.questionId = questionNo;
        questionContainer.classList.add('col-12', 'p-1','m-1','mt-0', 'questionItem','deactive','d-flex');

        let starHmtl = `<img src="img/star.svg" class="img-fluid" width="10px">`.repeat(difficulty);


        questionContainer.innerHTML = `
        <div class="p-2 pb-0 w-100 d-flex"  data-question-id="${questionIndex}">
        <div class="questionIcon"><img src="img/pokemon_icon.png" class="img-fluid"></div>
        <div class="my-auto questionText ps-1"><b>Question ${questionIndex}</b><br/><small class="smallText">Difficulty:${starHmtl}</small></div>
        </div>`;
        questionTab.appendChild(questionContainer);

    }

    let questionbtn = document.querySelectorAll(".questionItem");

    questionbtn.forEach(element => {
        element.addEventListener("click", function () {
            let getIndex = element.dataset.questionId;
            let coordinate = fullData[getIndex].coordinates;
            map.setView([coordinate[1],coordinate[0]]);
        });
    });

}

//To start the application for the website.
function app() {


    //loading presets and datas
    document.addEventListener("DOMContentLoaded", async function () {

        await loadAllPokemonData();
        await generateQuestion(questionLimit);
        await getLocation(function (coords) {
            sgLat = coords[0];
            sgLng = coords[1];
            loadMap(sgLat, sgLng);
        });

        // console.log(fullData);
        // console.log(markerArray);
        // console.log(fullPokemon);
        // console.log(ignoreIndex);

        loadPreset(fullData);

    })


    // after all is load add in the function.
    let submitBtn = document.querySelector(".submitAnswer");
    submitBtn.addEventListener("click", function () {
        checkAnswer(answer)
    }
    );

    function checkAnswer(answer) {
        let userinput = document.querySelector(".answerInput").value;
        let questionItem = document.querySelectorAll(".questionItem")
        if (userinput == answer) {
            console.log("Answer Correct");
            map.removeLayer(markerArray[currentId]);
            questionItem[currentId].classList.add("cleared");
            questionModal.hide();
        }
        else {
            console.log("Wrong Answer");
        }
    }

}




app();

