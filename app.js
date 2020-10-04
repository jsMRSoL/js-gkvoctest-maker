// Selectors
const marksButtons = document.getElementsByClassName('mark');
console.log(`marksButtons.length ${marksButtons.length}`);

const deleteButtons = document.getElementsByClassName('delete');
console.log(`deleteButtons.length ${deleteButtons.length}`);
const moveUpButtons = document.getElementsByClassName('move-up');
console.log(`moveUpButtons.length ${moveUpButtons.length}`);
const moveDownButtons = document.getElementsByClassName('move-down');
console.log(`moveDownButtons.length ${moveDownButtons.length}`);

const addAnswerButtons = document.getElementsByClassName('add-answer');
console.log(`addAnswerButtons.length ${addAnswerButtons.length}`);

const qCards = document.getElementsByClassName('card');
const qSpan = document.querySelector('#q-count');
qSpan.innerText = qCards.length;

const qAccordion = document.querySelector('#accordion');

const addQuButton = document.querySelector('#add-btn');
const importQsButton = document.querySelector('#import-btn');
const exportQsButton = document.querySelector('#export-btn');
const quizletButton = document.querySelector('#quizlet-btn');
const startAgainButton = document.querySelector('#start-btn');

const btnEditable = document.getElementsByClassName('unlock-btn');
console.log(`btnEditable.length ${btnEditable.length}`);

const deleteQuButtons = document.getElementsByClassName('delete-question');
console.log(`deleteQuButtons.length ${deleteQuButtons.length}`);

const fileSelector = document.createElement('input');
fileSelector.setAttribute('type', 'file');
fileSelector.setAttribute('accept', '.csv');
fileSelector.setAttribute('style', 'display:none');
document.body.appendChild(fileSelector);

// const testButton = document.querySelector('#test-btn');
// testButton.addEventListener('click', testVBR);

// Events
for (var i=0; i < marksButtons.length; i++) {
    var marksBtn = marksButtons[i];
    marksBtn.addEventListener('click', toggleMark);
}

for (i=0; i < deleteButtons.length; i++) {
    var delBtn = deleteButtons[i];
    delBtn.addEventListener('click', deleteAnswer);
}

for (i=0; i < moveUpButtons.length; i++) {
    var upBtn = moveUpButtons[i];
    upBtn.addEventListener('click', moveAnswerUp);
    var downBtn = moveDownButtons[i];
    downBtn.addEventListener('click', moveAnswerDown);
}

for (i=0; i < addAnswerButtons.length; i++) {
    var addBtn = addAnswerButtons[i];
    addBtn.addEventListener('click', addAnswer);
}

for (i=0; i < btnEditable.length; i++) {
    var lockBtn = btnEditable[i];
    lockBtn.addEventListener('click', toggleEditable);
}

for (i=0; i < deleteQuButtons.length; i++) {
    var delQBtn = deleteQuButtons[i];
    delQBtn.addEventListener('click', deleteQuestion);
}

addQuButton.addEventListener('click', addQuestion);
importQsButton.addEventListener('click', importQuestions);
fileSelector.addEventListener('input', reportFile);
exportQsButton.addEventListener('click', exportQuestions);
quizletButton.addEventListener('click', quizletQuestions);
startAgainButton.addEventListener('click', startAgain);

// Functions
function toggleMark() {
    this.classList.add('btn-dark');
    this.classList.remove('btn-secondary');
    // console.log(`this.classList ${this.classList}`);
    var btn;
    if (!this.nextElementSibling) {
        btn = this.previousElementSibling;
        btn.classList.remove('btn-dark');
        btn.classList.add('btn-secondary');
        // console.log(`next btn.classList ${btn.classList}`);
    } else {
        btn = this.nextElementSibling;
        btn.classList.remove('btn-dark');
        btn.classList.add('btn-secondary');
        // console.log(`prev btn.classList ${btn.classList}`);
    }
}

function toggleEditable() {

    this.classList.add('d-none');
    var btn;
    if (!this.previousElementSibling) {
        btn = this.nextElementSibling;
    } else {
        btn = this.previousElementSibling;
    }
    btn.classList.remove('d-none');

    var btnGroup = $(this).parent('div');
    var row = btnGroup.parent('div');
    // console.log(row);
    var cardLink = row.find('a')[0];
    // console.log(cardLink);
    if(this.classList.contains('fa-unlock')) {
        // console.log('fa-unlock pressed');
        $(cardLink).attr('contenteditable', 'true');
    } else {
        // console.log('fa-lock pressed');
        $(cardLink).attr('contenteditable', 'false');
    }
}

function deleteAnswer() {
    this.parentElement.parentElement.remove();
}

function addAnswer() {
    var tbl = this.parentElement.parentElement.getElementsByTagName('tbody')[0];
    // console.log(`addAnswer.parentElement.parentElement ${tbl}`);
    var row = makeAnswerRow("", false);

    tbl.appendChild(row);
}

function makeAnswerRow(answer, halfMark) {
    // decide which mark html we want
    var markHTML;
    if(!halfMark) {
        markHTML = `
                    <button type="button" class="mark btn btn-dark">100%</button>
                    <button type="button" class="mark btn btn-secondary">50%</button>`;
        feedback = "Well done!";
    } else {
        markHTML = `
                    <button type="button" class="mark btn btn-secondary">100%</button>
                    <button type="button" class="mark btn btn-dark">50%</button>`;
        feedback = "Good try! What verb form is it?";
    }
    // create the row and write the html
    row = document.createElement('tr');
    row.innerHTML = `
                    <tr>
                        <td>
                            <div class="btn-group">
                                ${markHTML}
                            </div>
                        </td>
                        <td contenteditable="true" class="answer">${answer}</td>
                        <td contenteditable="true" class="feedback">${feedback}</td>
                        <td class="d-flex">
                            <button type="button" class="btn basic btn-sm move-up fa fa-arrow-circle-up"></button>
                            <button type="button" class="btn basic btn-sm delete fa fa-minus-square"></button>
                            <button type="button" class="btn basic btn-sm move-down fa fa-arrow-circle-down"></button>
                        </td>
                    </tr>
`;
    // add events
    var markBtns = row.getElementsByClassName('mark');
    for (var i=0; i < markBtns.length; i++) {
        var markBtn = markBtns[i];
        markBtn.addEventListener('click', toggleMark);
    }
    var delBtn = row.getElementsByClassName('delete')[0];
    delBtn.addEventListener('click', deleteAnswer);
    var moveUpBtn = row.getElementsByClassName('move-up')[0];
    moveUpBtn.addEventListener('click', moveAnswerUp);
    var moveDownBtn = row.getElementsByClassName('move-down')[0];
    moveDownBtn.addEventListener('click', moveAnswerDown);
    // finished!
    return row;
}

function addQuestion(greek, answer, halfMark) {
    // line up variables
    var qNo = parseInt(qSpan.innerText) + 1;
    qSpan.innerText = qNo;
    if(typeof greek !== 'string') {
        greek = "Q.";
    }
    if(typeof answer !== 'string') {
        answer = "";
    }
    if(typeof halfMark !== 'boolean') {
        halfMark = false;
    }
    // insert variables
    cardHTML = `
                <div class="card-header d-flex">
                    <a class="collapsed card-link flex-grow-1" data-toggle="collapse" href="#collapse${qNo}" contenteditable="false">
                        ${greek}
                    </a>
                    <div class="btn-group btn-group-lg">
                        <button type="button" class="btn basic fa fa-lock d-none unlock-btn"></button>
                        <button type="button" class="btn basic fa fa-unlock unlock-btn"></button>
                        <button type="button" class="btn basic fa fa-minus-circle delete-question"></button>
                    </div>
                </div>
                <div id="collapse${qNo}" class="collapse show" data-parent="#accordion">
                    <div class="card-body">
                        <table class="table table-striped">
                            <thead>
                                <tr>
                                    <th>Mark</th>
                                    <th>Answer</th>
                                    <th>Feedback</th>
                                    <th>Edits</th>
                                </tr>
                            </thead>
                            <tbody>
                            </tbody>
                        </table>
                        <div class="d-flex justify-content-center">
                            <i class="add-answer fa fa-plus-circle" title="Add answer"></i>
                        </div>
                    </div>
                </div>
`;
    // create element
    var qCard = document.createElement('div');
    qCard.classList.add('card');
    qCard.innerHTML = cardHTML;

    // split answers and loop
    answer = answer.replace(/\;/g, ",");
    answer = answer.replace(/\(.*\)/g, "");
    answer = answer.replace(/\+ [A-Z]*/g, "");
    // console.log(answer);
    var answerlist = answer.split(',');
    for(var i = 0; i < answerlist.length; i++) {
        // make row
        var row = makeAnswerRow(answerlist[i], halfMark);
        // add row
        var tblbody = qCard.querySelector('tbody');
        tblbody.append(row);
    }
    // add event 1
    var addBtn = qCard.getElementsByClassName('add-answer')[0];
    addBtn.addEventListener('click', addAnswer);
    // add event 2
    var lockBtns = qCard.getElementsByClassName('unlock-btn');
    for (var i=0; i < lockBtns.length; i++) {
        lockBtn = lockBtns[i];
        lockBtn.addEventListener('click', toggleEditable);
    }
    // add event 3
    var delQBtn = qCard.getElementsByClassName('delete-question')[0];
    delQBtn.addEventListener('click', deleteQuestion);
    // add to accordion
    qAccordion.append(qCard);
}


async function addVerbQuestion(greekVerb, answer, halfMark) {
    //get array of meanings
    answer = answer.replace("I ", "");
    answer = answer.replace(";", ",");
    answer = answer.replace(/\(.*\)/g, "");
    answer = answer.replace(/\+ [A-Z]*/g, "");
    // console.log(answer);
    var meanings = answer.split(","); 
    // create array of verb objects
    // console.log(meanings);
    var i = 0;
    var verbCollection = [];
    key = env.KEY;
    while (i < meanings.length) {
        var verb = await getVerbResponse(meanings[i].trim(), key);
        // console.log("The addVerbQuestion sees: ", verb);
        verbCollection.push(verb);
        // console.log(meanings[i].trim());
        i++;
    }
    
    // // get greek verb parts
    var greekParts = greekVerb.split(',');

    // // line up variables for present
    var qNo = parseInt(qSpan.innerText) + 1;
    // // create element
    var qCard = document.createElement('div');
    qCard.classList.add('card');
    cardHTML = getCardHTML(greekParts[0], qNo);
    qCard.innerHTML = cardHTML;

    // split answers and loop
    for(var i = 0; i < verbCollection.length; i++) {
        // make row
        var pres = `I ${verbCollection[i].present}`;
        var row = makeAnswerRow(pres, false);
        // add row
        var tblbody = qCard.querySelector('tbody');
        tblbody.append(row);
        row = makeAnswerRow(verbCollection[i].asterisked.replace('*am* ', '*'), true);
        tblbody.append(row);
    }
    // add halfmark answer
    // add event 1
    var addBtn = qCard.getElementsByClassName('add-answer')[0];
    addBtn.addEventListener('click', addAnswer);
    // add event 2
    var lockBtns = qCard.getElementsByClassName('unlock-btn');
    for (var i=0; i < lockBtns.length; i++) {
        lockBtn = lockBtns[i];
        lockBtn.addEventListener('click', toggleEditable);
    }
    // add event 3
    var delQBtn = qCard.getElementsByClassName('delete-question')[0];
    delQBtn.addEventListener('click', deleteQuestion);
    // add to accordion
    qAccordion.append(qCard);

    if (greekParts[1]) {
        
        // line up variables for future
        var qNo = qNo + 1;
        // create element
        var qCard = document.createElement('div');
        qCard.classList.add('card');
        cardHTML = getCardHTML(greekParts[1], qNo);
        qCard.innerHTML = cardHTML;

        // split answers and loop
        for(var i = 0; i < verbCollection.length; i++) {
            // make row
            var fut = `I*ll ${verbCollection[i].present.replace('am', 'be')}`;
            var row = makeAnswerRow(fut, false);
            // add row
            var tblbody = qCard.querySelector('tbody');
            tblbody.append(row);
            row = makeAnswerRow(verbCollection[i].asterisked.replace('*am* ', '*'), true);
            tblbody.append(row);
        }
        // add event 1
        var addBtn = qCard.getElementsByClassName('add-answer')[0];
        addBtn.addEventListener('click', addAnswer);
        // add event 2
        var lockBtns = qCard.getElementsByClassName('unlock-btn');
        for (var i=0; i < lockBtns.length; i++) {
            lockBtn = lockBtns[i];
            lockBtn.addEventListener('click', toggleEditable);
        }
        // add event 3
        var delQBtn = qCard.getElementsByClassName('delete-question')[0];
        delQBtn.addEventListener('click', deleteQuestion);
        // add to accordion
        qAccordion.append(qCard);
    }

    if (greekParts[2]) {
        
        // line up variables for aorist
        var qNo = qNo + 1;
        // create element
        var qCard = document.createElement('div');
        qCard.classList.add('card');
        cardHTML = getCardHTML(greekParts[2], qNo);
        qCard.innerHTML = cardHTML;

        // split answers and loop
        for(var i = 0; i < verbCollection.length; i++) {
            // make row
            var preterite = `I ${verbCollection[i].past_simple}`;
            var row = makeAnswerRow(preterite, false);
            // add row
            var tblbody = qCard.querySelector('tbody');
            tblbody.append(row);
            row = makeAnswerRow(verbCollection[i].asterisked.replace('*am* ', '*'), true);
            tblbody.append(row);
        }
        // add event 1
        var addBtn = qCard.getElementsByClassName('add-answer')[0];
        addBtn.addEventListener('click', addAnswer);
        // add event 2
        var lockBtns = qCard.getElementsByClassName('unlock-btn');
        for (var i=0; i < lockBtns.length; i++) {
            lockBtn = lockBtns[i];
            lockBtn.addEventListener('click', toggleEditable);
        }
        // add event 3
        var delQBtn = qCard.getElementsByClassName('delete-question')[0];
        delQBtn.addEventListener('click', deleteQuestion);
        // add to accordion
        qAccordion.append(qCard);
    }

    if (greekParts[3]) {
        
        // line up variables for aorist passive
        var qNo = qNo + 1;
        // create element
        var qCard = document.createElement('div');
        qCard.classList.add('card');
        cardHTML = getCardHTML(greekParts[3], qNo);
        qCard.innerHTML = cardHTML;

        // split answers and loop
        for(var i = 0; i < verbCollection.length; i++) {
            // make row
            var pastPt = `I was ${verbCollection[i].past_simple}`;
            var row = makeAnswerRow(pastPt, false);
            // add row
            var tblbody = qCard.querySelector('tbody');
            tblbody.append(row);
            row = makeAnswerRow(verbCollection[i].asterisked.replace('*am* ', '*'), true);
            tblbody.append(row);
        }
        // add event 1
        var addBtn = qCard.getElementsByClassName('add-answer')[0];
        addBtn.addEventListener('click', addAnswer);
        // add event 2
        var lockBtns = qCard.getElementsByClassName('unlock-btn');
        for (var i=0; i < lockBtns.length; i++) {
            lockBtn = lockBtns[i];
            lockBtn.addEventListener('click', toggleEditable);
        }
        // add event 3
        var delQBtn = qCard.getElementsByClassName('delete-question')[0];
        delQBtn.addEventListener('click', deleteQuestion);
        // add to accordion
        qAccordion.append(qCard);
    }
    // finally update display of question count
    qSpan.innerText = qNo;
}

function getCardHTML(greek, qNo) {
    return `
                <div class="card-header d-flex">
                    <a class="collapsed card-link flex-grow-1" data-toggle="collapse" href="#collapse${qNo}" contenteditable="false">
                        ${greek}
                    </a>
                    <div class="btn-group btn-group-lg">
                        <button type="button" class="btn basic fa fa-lock d-none unlock-btn"></button>
                        <button type="button" class="btn basic fa fa-unlock unlock-btn"></button>
                        <button type="button" class="btn basic fa fa-minus-circle delete-question"></button>
                    </div>
                </div>
                <div id="collapse${qNo}" class="collapse show" data-parent="#accordion">
                    <div class="card-body">
                        <table class="table table-striped">
                            <thead>
                                <tr>
                                    <th>Mark</th>
                                    <th>Answer</th>
                                    <th>Feedback</th>
                                    <th>Edits</th>
                                </tr>
                            </thead>
                            <tbody>
                            </tbody>
                        </table>
                        <div class="d-flex justify-content-center">
                            <i class="add-answer fa fa-plus-circle" title="Add answer"></i>
                        </div>
                    </div>
                </div>
    `;
}

function moveAnswerUp() {
    // console.log("move up");
    var row = $(this).parents('tr');
    if (row.index() > 0) {
        row.insertBefore(row.prev());
    }
}

function moveAnswerDown() {
    // console.log("move down");
    var row = $(this).parents('tr');
    var tblbody = row.parents('tbody');
    if (row.index() < tblbody.children().length - 1) {
        row.insertAfter(row.next());
    }
}

function deleteQuestion() {
    var $card = $(this).parent().parent().parent();
    // console.log($card.index());
    $($card).remove();
    var qNo = parseInt(qSpan.innerText) - 1;
    qSpan.innerText = qNo;
}

function importQuestions() {
    fileSelector.click();
    // console.log(fileSelector.files[0].name);
}

function reportFile(e){
    // var f = e.target.files,
    //     len = f.length;
    // for (var i=0;i<len;i++){
    //     console.log(f[i].name);
    // }
    var input = e.target;

    Papa.parse(e.target.files[0], {
        header:true,
        complete: function(results) {
            // console.log(results);
            results.data.map((row, index)=> {
                // console.log(row);
                // console.log(row['Greek ']);
                if(row['Greek']) {
                    if(!row['Part of Speech'].includes('verb')) {
                        addQuestion(row['Greek'], row['English'], false);
                    } else {
                        addVerbQuestion(row['Greek'], row['English'], false);
                    }
                }
            });
        }
    });
}

function startAgain() {
    $(qAccordion).empty();
    qSpan.innerText = 0;
}

function exportQuestions() {
    var fileName = prompt("Enter filename: ", "filename.xml");
    var listId = prompt("Enter a name for the question set (A_ for A level, G_for GCSE): ", "A_");
    var content;
    var questions = "";
    var question;
    var greek;
    var score, answer, feedback;
    var tbl;
    var answerCode;
    var quNoShort = 1000;
    var quNoLong;
    $(qAccordion).children().each(function(index) {
        question = "";
        answerCode = "";
        greek = $(this).find('a').text();
        greek = $.trim(greek);
        // console.log("Question word:");
        // console.log($.trim(greek));
        tbl = $(this).find('tbody');
        // console.log(tbl);
        $(tbl).children('tr').each(function(index) {
            score = $(this).find('.btn-dark').text();
            score = $.trim(score);
            answer = $(this).find('.answer').text();
            answer = $.trim(answer);
            feedback = $(this).find('.feedback').text();
            feedback = $.trim(feedback);
            // console.log(`${score} | ${answer} | ${feedback}`);
            answerCode = `${answerCode}~%${score}${answer}#${feedback}`;
        });
        answerCode = `{1:SHORTANSWER:${answerCode}}`;
        quNoShort += 1;
        quNoLong = `${listId}_q_${quNoShort}`;
        question = makeQuestionString(quNoShort, quNoLong, greek, answerCode);
        questions = `${questions}${question}`;
    });
    const xmlStart =
`<?xml version="1.0" encoding="utf-8"?>
<quiz>
<!-- question: 0  -->
<question type="category">
<category>
<text>$course$/top/Vocabulary/${listId}</text>
</category>
</question>`;
    // add top and tail to xml
    content = `${xmlStart}${questions}</quiz>`;
    var blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    saveAs(blob, fileName);
}

function makeQuestionString(quNoShort, quNoLong, greek, answerCode) {
    return `
        <!-- question: ${quNoShort}  -->
        <question type="cloze" > 
        <name>
        <text>${quNoLong}</text>
        </name>
        <questiontext>
        <text>
        <![CDATA[<p>${greek}</p>
<p><font size="4" face="times new roman,times,serif">${answerCode}</font></p>]]>
        </text>
        </questiontext>
        <generalfeedback>
        <text></text>
        </generalfeedback>
        <shuffleanswers>0</shuffleanswers>
        </question>
`;
}

function testVBR() {
    getVerbResponse("give up on", env.KEY);
}

async function getVerbResponse(eng_verb, key) {
    // split phrasal verbs
    if (eng_verb.includes(' ')) {
        var parts = eng_verb.replace(' ', '|').split('|');
        var head = parts[0];
        var tail = ` ${parts[1]}`;
    } else {
        var head = eng_verb;
        var tail = '';
    }

    var response = await fetch(`https://www.dictionaryapi.com/api/v3/references/sd4/json/${head}?key=${key}`)
        .then(response => response.json())
        .then(json => { return json });
    // console.log(response);
    // get correct part of speech
    var i = 0;
    do {
        verb = response[i];
        i++;
    } while ((verb['fl'] !== "verb") && (i < response.length));
        
    // console.log(verb);
    // verb = response[0];
    // get required verb forms
    // check for existence of the inflections
    if (!verb['ins']) {
        if (head.endsWith('e')) {
            var preterite = `${head}d`;
        } else {
            var preterite = `${head}ed`;
        }
        var verbObj = {
            present: eng_verb,
            past_simple: `${preterite}${tail}`,
            past_part: `${preterite}${tail}`,
            asterisked: `*${head}*${tail}`,
        };
        // console.log("No inflections: default :", verbObj);
        return verbObj;
    }

    // get inflections
    preterite = verb['ins'][0]['if'].replace(/\*/g, '');
    past_pt = verb['ins'][1]['if'].replace(/\*/g, '');
    if (past_pt.endsWith('ing')) {
        past_pt = preterite;
    }
    // console.log(`Preterite: ${preterite}`);
    // console.log(`Past participle: ${past_pt}`);
    var verbObj = {
        present: eng_verb,
        past_simple: `${preterite}${tail}`,
        past_part: `${past_pt}${tail}`,
        asterisked: `*${head}*${tail}`,
    };
    // console.log('The async function: ', verbObj);
    return verbObj;
}

function quizletQuestions() {
    var questions = "";
    var question;
    var greek;
    var score, answer;
    var tbl;
    var answerCode;
    console.log("quizletQuestions function called...")
    $(qAccordion).children().each(function(index) {
        question = "";
        greek = $(this).find('a').text();
        greek = $.trim(greek);
        // console.log("Question word:");
        // console.log($.trim(greek));
        tbl = $(this).find('tbody');
        // console.log(tbl);
        answerCode = "";
        $(tbl).children('tr').each(function(index) {
            score = $(this).find('.btn-dark').text();
            score = $.trim(score);
            // put check for 100 here
            if ( score === '100%' ) {
                answer = $(this).find('.answer').text();
                answer = answer.replace('I*ll', 'I will');
                answer = $.trim(answer);
                // console.log(`${score} | ${answer} | ${feedback}`);
                answerCode = `${answerCode}, ${answer}`;
                console.log(answerCode);
            }
        });
        question = `<p>${greek}:${answerCode}</p>`
        question = question.replace(':,', ":");
        // console.log(question);
        questions = `${questions}${question}`;
    });
    // console.log(questions);
    var newWindow = window.open();
    newWindow.document.write(questions);
}
