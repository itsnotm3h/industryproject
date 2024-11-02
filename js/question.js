function appendQuestion (x)
{
    let questionTable = document.querySelector("#question-body");
    for(let question in x)
    {
        let questNo = parseInt(question) + 1;
        let questText = x[question].question;

        if(questText.length >50)
        {
            questText = questText.slice(0,57)+"...";
        }

        let questAnswer = x[question].answer;
        let questDiff = x[question].difficulty;
        const questionTr = document.createElement("tr");
        questionTr.classList.add('greyBorder','align-self-middle');

        let starHmtl = `<img src="img/star-level.svg" class="img-fluid" width="18px">`.repeat(questDiff);

        questionTr.innerHTML=`
        <td>${questNo}</td>
        <td>${questText}</td>
        <td>${questAnswer}</td>
        <td>${starHmtl}</td>
        <td><div class="btn me-1 editQuestion btn-primary">Edit</div><div class="btn deleteQuestion btn-danger">Delete</div></td>`;

        questionTable.appendChild(questionTr);

    }

        
}


function app() {

    //loading presets and datas
    document.addEventListener("DOMContentLoaded", async function () {

        mathQuestions = await loadQuestionData();
        appendQuestion(mathQuestions);

        
    let editQuestion = document.querySelectorAll(".editQuestion");

    for(let q in editQuestion)
        {
            editQuestion[q].addEventListener("click", function(){

                let valueQuestion = mathQuestions[q].question;
                let valueAnswer = mathQuestions[q].answer;
                let valueLevel = mathQuestions[q].difficulty;

                let setQuestion = document.querySelector(".settingQuestion");
                let setAnswer = document.querySelector(".settingAnswer");
                let setLevel = document.querySelector(".settingLevel");

                setQuestion.value = valueQuestion;
                setAnswer.value = valueAnswer;
                setLevel.value = valueLevel;

                questionModal.show();
            });
    
        }

    })


}




app();