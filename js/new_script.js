//To start the application for the website.


//this is to add in question to the side panel
function loadPreset(question) {


    let questionTab = document.querySelector(".questionLog");
    questionTab.innerHTML = "";

    question.forEach((item,index)=>{

        let questionNo = index+1;
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

        questionContainer.innerHTML = `<div class="p-2 pb-0 w-100 d-flex"  data-questionitem-id="${questionId}"><div class="questionIcon"><img src="img/${imgURl}.png" class="img-fluid pokemonIcon"></div><div class="my-auto questionText ps-1"><div><b>Question ${questionNo}</b></div><div class="w-100 d-flex align-items-stretch"><div class="smallText align-self-center">Level:${starLevel}</div><div class="status ps-1"></div></div></div>`;

        questionTab.appendChild(questionContainer);
    })

    addClick("questionItem");

}






function app() {

    // function to load data
    document.addEventListener("DOMContentLoaded", async function () {
    await loadAllData();        
        
    await getLocation(function (coords) {
        sgLat = coords[0];
        sgLng = coords[1];
    });

        console.log(generatedData);

    });


};

app();


