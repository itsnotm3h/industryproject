//this is to add in question to the side panel
function loadPreset(questionArray) {
    for (let questionNo in questionArray) {
        let questionTab = document.querySelector(".questionLog");
        let questionNum = parseInt(questionNo) + 1;
        let questionID = userQuestions[questionNo].id;
        let difficulty = userQuestions[questionNo].difficulty;
        const questionContainer = document.createElement("div");
        questionContainer.dataset.questionId = questionNo;
        questionContainer.classList.add('col-12', 'p-1','m-1','mt-0', 'questionItem','deactivate','d-flex');

        let starHmtl = `<img src="img/star.svg" class="img-fluid" width="10px">`.repeat(difficulty);


        questionContainer.innerHTML =`<div class="p-2 pb-0 w-100 d-flex"  data-question-id="${questionID}">
        <div class="questionIcon"><img src="img/normal.png" class="img-fluid pokemonIcon"></div>
        <div class="my-auto questionText ps-1"><div><b>Question ${questionNum}</b></div><div class="w-100 d-flex align-items-stretch"><div class="smallText align-self-center">Level:${starHmtl}</div><div class="status ps-1"></div></div>
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

function loadLocalStorage(){

};


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

function detectGallery(x){

    let allGallery = document.querySelectorAll(".pokemonGallery");

    try{

        for(let item in allGallery)
            {
                if(item.dataset.pokemonIndex == x)
                {
                    item.classList.remove("deactivate");
                    console.log(x);
                }
            }
        

    }
    catch(error)
    {
        console.log(error);
    }


    
    
}

//To start the application for the website.
function app() {

    //loading presets and datas
    document.addEventListener("DOMContentLoaded", async function () {

        userQuestions = await loadQuestionData();
        await loadAllPokemonData();
        await generateQuestion(userQuestions.length);
        await getLocation(function (coords) {
            sgLat = coords[0];
            sgLng = coords[1];
            loadMap(sgLat, sgLng);
        });

        console.log(fullPokemon);
        loadPreset(fullData);
        loadGallery(fullPokemon);
        detectGallery(1);
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
        let questionStatus = document.querySelectorAll(".status");

        if (userinput == answer) {

            let noticeTab = document.querySelector(".noticeTab");
            // let questionTab = document.querySelector(".answerQuestionTab");
            map.removeLayer(markerArray[currentId]);
            questionItem[currentId].classList.remove("wrong");
            questionItem[currentId].classList.add("correct");
            pokemonIcon[currentId].src="/img/correct.png";
            questionStatus[currentId].innerHTML =`<img src="/img/correct-status.png" class="img-fluid">`;

            noticeTab.innerHTML=`<img src="./img/thumbsup.jpg" class="img-fluid>`;

            noticeTab.classList.remove("hidden");
            let pokeIndex = fullData[currentId].pokemonIndex;
            let questIndex = fullData[currentId].questionIndex;

            // console.log(fullData);

            correct.push({"questionId":questIndex,"pokemonID":pokeIndex});

            console.log(fullData[currentId]);
            console.log(correct);

            let addPokemon = document.querySelector(`[data-pokemon-index="${pokeIndex}"]`);

            addPokemon.classList.remove("deactivate");
            addPokemon.classList.add("colured");

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
    }
}



app();

