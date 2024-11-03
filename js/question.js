let editStatus = "";
let questionSelected = "";


function submitFunction(status) {

    try {
        let currentRecord = checkExist(questionSelected,status);

        if (status =="New")
        {
            currentRecord = userQuestions[userQuestions.length-1].id;
        }
        if (currentRecord) {
            if (status == "Edit" || status =="New") {
                document.querySelector(".answerSection").classList.add("was-validated");

                let newQuestion = document.querySelector(".settingQuestion").value;
                let newAnswer = document.querySelector(".settingAnswer").value;
                let newLevel = document.querySelector(".settingLevel").value;

                if (newQuestion == "") {
                    document.querySelector(".error-question").innerHTML = "Field is empty";
                    document.querySelector(".error-question").classList.add("is-invalid");
                }
                if (newAnswer == "") {
                    document.querySelector(".error-answer").innerHTML = "Field is empty";
                    document.querySelector(".error-answer").classList.add("is-invalid");
                }
                if (newQuestion != "" && newAnswer != "") {

                    if(status =="Edit")
                    {
                        editQuestion(currentRecord, newQuestion, newAnswer, newLevel);
                    }
                    else if(status=="New")
                    {
                        let newNum = parseInt(currentRecord.replace("Q",""))+1;
                        let newId = `Q${newNum.toString().padStart(3,"0")}`                        ;
                        addNewQuestion(newId,newQuestion,newAnswer,newLevel);
                    }
                    questionModal.hide();
                    document.querySelector(".answerSection").classList.remove("was-validated");

                }
            }
            else if (status == "Delete") {

                console.log(currentRecord);
                deleteQuestion(userQuestions, currentRecord);
                questionModal.hide();

            }

            displayQuestion();
            saveData(userQuestions);

        }

    }
    catch (error) {
        console.log(error);
    }

}


function activateBtn() {


    try {

        // Using for (let i in editableQuestions) to iterate over a NodeList can cause errors because it will return not only the indices but also additional properties like the NodeList's length and methods. Instead, it’s better to use for...of or forEach() to directly access the elements without encountering unexpected results.

        let editableQuestion = document.querySelectorAll(".editQuestion");
        let deleteableQuestion = document.querySelectorAll(".deleteQuestion");

        editableQuestion.forEach(function (editBtn, index) {
            editBtn.addEventListener("click", function (e) {
                document.querySelector(".editDisplay").classList.remove("hidden");
                document.querySelector(".deleteDisplay").classList.add("hidden");
                let valueQuestion = userQuestions[index].question;
                let valueAnswer = userQuestions[index].answer;
                let valueLevel = userQuestions[index].difficulty;
                questionSelected = e.target.dataset.questionId;


                let setQuestion = document.querySelector(".settingQuestion");
                let setAnswer = document.querySelector(".settingAnswer");
                let setLevel = document.querySelector(".settingLevel");
                let sliderValue = document.querySelector(".levelValue")



                setQuestion.value = valueQuestion;
                setAnswer.value = valueAnswer;
                setLevel.value = valueLevel;
                sliderValue.innerHTML = valueLevel;


                editStatus = "Edit";

                questionModal.show();
                document.querySelector(".modal-title").innerHTML = `<b>${editStatus} Question</b>`;
            });
        });

        deleteableQuestion.forEach(function (deleteBtn, index) {
            deleteBtn.addEventListener("click", function (e) {


                let valueQuestion = userQuestions[index].question;


                document.querySelector(".editDisplay").classList.add("hidden");
                document.querySelector(".deleteDisplay").classList.remove("hidden");
                questionSelected = e.target.dataset.questionId;
                editStatus = "Delete";
                questionModal.show();
                document.querySelector(".modal-title").innerHTML = `<b>${editStatus} Question</b>`;


                let deleteInfo = document.querySelector(".deleteDisplay .deleteInfo");
                deleteInfo.innerHTML = `${valueQuestion}`


            });
        });


    }
    catch (error) {
        console.log(error);
    }

}



function displayQuestion() {
    let questionTable = document.querySelector("#question-body");
    questionTable.innerHTML = "";

    for (let question in userQuestions) {
        let questNo = parseInt(question) + 1;
        let questText = userQuestions[question].question;
        let questIndex = userQuestions[question].id;

        if (questText.length > 50) {
            questText = questText.slice(0, 50) + "...";
        }

        let questAnswer = userQuestions[question].answer;
        let questDiff = userQuestions[question].difficulty;
        const questionTr = document.createElement("tr");
        questionTr.classList.add('greyBorder', 'align-self-middle');

        let starHmtl = `<img src="img/star-level.svg" class="img-fluid" width="18px">`.repeat(questDiff);

        questionTr.innerHTML = `
        <td>${questNo}</td>
        <td>${questText}</td>
        <td>${questAnswer}</td>
        <td>${starHmtl}</td>
        <td><div class="btn me-1 editQuestion btn-primary" data-question-id="${questIndex}">Edit</div><div class="btn deleteQuestion btn-danger" data-question-id="${questIndex}">Delete</div></td>`;

        questionTable.appendChild(questionTr);

    }
    activateBtn();


}

async function saveData(object) {
    const response = await axios.put(`${JSON_BIN_BASE_URL}/b/${JSON_BIN_ID}`, object);

}

function addNewQuestion(newId, newQuestion, newAnswer, newLevel) {

    const newEntry = {
        id: newId,
        question:newQuestion,
        answer:newAnswer,
        difficulty:newLevel
    }

    userQuestions.push(newEntry);
}

function editQuestion(object, newQuestion, newAnswer, newLevel) {
    object.question = newQuestion;
    object.answer = newAnswer;
    object.difficulty = newLevel;
}


//This is to delete the story.
function deleteQuestion(object, record) {

    let index = object.indexOf(record);
    object.splice(index, 1);
}

//Check and return data accordingly. 
function checkExist(theRecord,status) {
    //find to return item, some is to return true or false. 
    const checked = userQuestions.find(item => item.id === theRecord);
    console.log("checked");
    return checked;
}

let addQuestion = document.querySelector(".addQuestion");
let submitEdit = document.querySelector(".submit");
let slider = document.querySelector(".settingLevel");



function app() {

    //loading presets and datas
    document.addEventListener("DOMContentLoaded", async function () {

        userQuestions = await loadQuestionData();
        displayQuestion();
    })

    let sliderValue = document.querySelector(".levelValue");
    slider.onchange = function () {
        sliderValue.innerHTML = this.value;
    }



    submitEdit.addEventListener("click", function () {
        submitFunction(editStatus);
    });


    addQuestion.addEventListener("click", function () {

        document.querySelector(".editDisplay").classList.remove("hidden");
        document.querySelector(".deleteDisplay").classList.add("hidden");

        editStatus = "New";
        document.querySelector(".settingQuestion").value="";
        document.querySelector(".settingAnswer").value=""
        document.querySelector(".settingLevel").value = 1;
        document.querySelector(".modal-title").innerHTML = `<b>${editStatus} Question</b>`;

        questionModal.show();
    });




}




app();