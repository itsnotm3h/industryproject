let editStatus = "";
let questionSelected = "";

function submitFunction(status) {

    try {
        let currentRecord = checkExist(questionSelected);

        if (currentRecord) {

            if (status == "Edit") {
                document.querySelector(".answerSection").classList.add("was-validated");
                let newQuestion = document.querySelector(".settingQuestion").value;
                let newAnswer = document.querySelector(".settingAnswer").value;
                let newLevel = document.querySelector(".settingLevel").value;

                if(newQuestion =="")
                {
                    document.querySelector(".error-question").innerHTML="Field is empty";
                    document.querySelector(".error-question").classList.add("is-invalid");
                }
                if(newAnswer=="")
                {
                    document.querySelector(".error-answer").innerHTML="Field is empty";
                    document.querySelector(".error-answer").classList.add("is-invalid");
                }
                if(newQuestion !="" && newAnswer!="" )
                {
                    editQuestion(currentRecord, newQuestion, newAnswer, newLevel);
                    questionModal.hide();
                    document.querySelector(".answerSection").classList.remove("was-validated");

                }
            }
            else if (status == "Delete") {
                
            }

            displayQuestion();
            saveData(userQuestions);

        }

    }
    catch (error) {
        console.log(error);
    }

}


function activateBtn(){


    let submitEdit = document.querySelector(".submit");
    submitEdit.addEventListener("click", function () {
        submitFunction(editStatus);
    });

    let editableQuestion = document.querySelectorAll(".editQuestion");
    let deleteableQuestion = document.querySelectorAll(".deleteQuestion");


    try{

        // Using for (let i in editableQuestions) to iterate over a NodeList can cause errors because it will return not only the indices but also additional properties like the NodeList's length and methods. Instead, it’s better to use for...of or forEach() to directly access the elements without encountering unexpected results.
        
        editableQuestion.forEach(function(editBtn,index) {
            editBtn.addEventListener("click", function (e) {
                let valueQuestion = userQuestions[index].question;
                let valueAnswer = userQuestions[index].answer;
                let valueLevel = userQuestions[index].difficulty;
                questionSelected = e.target.dataset.questionId;
        
                let setQuestion = document.querySelector(".settingQuestion");
                let setAnswer = document.querySelector(".settingAnswer");
                let setLevel = document.querySelector(".settingLevel");
        
                setQuestion.value = valueQuestion;
                setAnswer.value = valueAnswer;
                setLevel.value = valueLevel;
        
                editStatus = "Edit";
                
                questionModal.show();
                document.querySelector(".modal-title").innerHTML = `<b>${editStatus} Question</b>`;
            });
        });
        
        deleteableQuestion.forEach(function(deleteBtn) {
            deleteBtn.addEventListener("click", function (e) {
                questionSelected = e.target.dataset.questionId;
                editStatus = "Delete";
                questionModal.show();
                document.querySelector(".modal-title").innerHTML = `<b>${editStatus} Question</b>`;
            });
        });

        
    }
    catch(error)
    {
        console.log(error);
    }

}






function displayQuestion() {
    let questionTable = document.querySelector("#question-body");
    questionTable.innerHTML=""; 

    for (let question in userQuestions) {
        let questNo = parseInt(question) + 1;
        let questText = userQuestions[question].question;
        let questIndex = userQuestions[question].id;

        if (questText.length > 50) {
            questText = questText.slice(0, 57) + "...";
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
}

async function saveData(object) {
    const response = await axios.put(`${JSON_BIN_BASE_URL}/b/${JSON_BIN_ID}`, object);

}

function editQuestion(object, newQuestion, newAnswer, newLevel) {
    object.question = newQuestion;
    object.answer = newAnswer;
    object.difficulty = newLevel; 
}

//Check and return data accordingly. 
function checkExist(theRecord) {
    //find to return item, some is to return true or false. 
    const checked = userQuestions.find(item => item.id === theRecord);
    console.log(checked);
    return checked;
}


function app() {

    //loading presets and datas
    document.addEventListener("DOMContentLoaded", async function () {

        userQuestions = await loadQuestionData();
        displayQuestion();
        activateBtn();
    })



}




app();