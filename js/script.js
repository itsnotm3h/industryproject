//this is to add in question to the side panel
function loadPreset(questionArray) {
    for (let questionNo in questionArray) {
        let questionTab = document.querySelector(".questionLog");
        let questionIndex = parseInt(questionNo) + 1;
        let difficulty = mathQuestions[questionNo].difficulty;
        const questionContainer = document.createElement("div");
        questionContainer.dataset.questionId = questionNo;
        questionContainer.classList.add('col-12', 'p-1','m-1','mt-0', 'questionItem','deactivate','d-flex');

        let starHmtl = `<img src="img/star.svg" class="img-fluid" width="10px">`.repeat(difficulty);


        questionContainer.innerHTML =`<div class="p-2 pb-0 w-100 d-flex"  data-question-id="${questionIndex}">
        <div class="questionIcon"><img src="img/normal.png" class="img-fluid pokemonIcon"></div>
        <div class="my-auto questionText ps-1"><div><b>Question ${questionIndex}</b></div><div class="w-100 d-flex align-items-stretch"><div class="smallText align-self-center">Level:${starHmtl}</div><div class="status ps-1"></div></div>
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


function loadGallery(x){

    let total = x.length;
    let column = 10;
    let row = 4;
    let galleryStage = document.querySelector(".carousel-inner");

    for(let i=0; i < Math.ceil(total/(column*row)); i++)
    {
        const slider = document.createElement("div");
        const wrapper = document.createElement("div");
        wrapper.classList.add('d-flex','flex-wrap',);

        
        if(i == 0)
        {
            slider.classList.add('carousel-item','active');
        }
        else{
            slider.classList.add('carousel-item');
        }

        let startNum = i*(column*row);
        let stopNum =(column*row)*(i+1); 

        if(stopNum > 1024)
        {
            stopNum = 1024;
        }


    
        for(let j=startNum; j < stopNum; j++)
        {
            const pokmonCont = document.createElement("div");
            pokmonCont.classList.add('pokemonGallery','flex-fill','deactivate');

            pokmonCont.dataset.pokemonIndex = fullPokemon[j].pokemonId;
    
            pokmonCont.innerHTML = `<img src="${fullPokemon[j].pokemonImage}"  class="img-fluid" >`;
            wrapper.appendChild(pokmonCont);
        }

        slider.append(wrapper);
        galleryStage.append(slider);
    }

}


//To start the application for the website.
function app() {

    //loading presets and datas
    document.addEventListener("DOMContentLoaded", async function () {

        mathQuestions = await loadQuestionData();
        await loadAllPokemonData();
        await generateQuestion(questionLimit);
        await getLocation(function (coords) {
            sgLat = coords[0];
            sgLng = coords[1];
            loadMap(sgLat, sgLng);
        });

        console.log(fullPokemon);
        loadPreset(fullData);
        loadGallery(fullPokemon);
    })

    // after all is load add in the function.
    let submitBtn = document.querySelector(".submitAnswer");
    submitBtn.addEventListener("click", function () {
        checkAnswer(answer)
    }
    );

    document.querySelector("#galleryButton").addEventListener("click",function(){
        document.querySelector("#map").classList.toggle("hidden");
        document.querySelector("#gallery").classList.toggle("hidden");
    })

    document.getElementById('carouselExample').addEventListener('slid.bs.carousel', function (event) {
        const slideNumber = event.to + 1; // `event.to` gives the zero-based index
        document.querySelector("#boxName").innerHTML=`BOX ${slideNumber}`;
      });

    function checkAnswer(answer) {
        let userinput = document.querySelector(".answerInput").value;
        let questionItem = document.querySelectorAll(".questionItem");
        let pokemonIcon = document.querySelectorAll(".pokemonIcon");
        let questionStatus = document.querySelectorAll(".status")
        if (userinput == answer) {
            console.log("Answer Correct");
            map.removeLayer(markerArray[currentId]);
            questionItem[currentId].classList.remove("wrong");
            questionItem[currentId].classList.add("correct");
            pokemonIcon[currentId].src="/img/correct.png";
            questionStatus[currentId].innerHTML =`<img src="/img/correct-status.png" class="img-fluid">`;
            questionModal.hide();
        }

        else {
            console.log("Wrong Answer");
            questionItem[currentId].classList.remove("correct");
            questionItem[currentId].classList.add("wrong");
            pokemonIcon[currentId].src="/img/wrong.png";
            questionStatus[currentId].innerHTML =`<img src="/img/wrong-status.png" class="img-fluid">`;
            questionModal.hide();
        }
        console.log(fullData[currentId].pokemonIndex)
    }
}



app();

