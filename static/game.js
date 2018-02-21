const socket = io();
const startButton = document.getElementById("start");
const gameBox = document.getElementById("gameBox");
const pictureBox = document.getElementById("pictureBox");
const game = document.getElementById("game");
const num = document.getElementById("num");
const resultsList = document.getElementById("resultsList");
let playerName = "",
    current = 0,
    score = 0,
    secs = 20,
    interval,
    questions;

fetch("/static/questions.json")
  .then(response => response.json())
  .then(json => questions = json);

function startGame(){
    const nameInput = document.getElementById("name");
    playerName = nameInput.value;
    if(playerName !== ""){
        socket.emit('new player', playerName);
        nextQuestion();
    }else{
        alert("Please set name");
    }
    return;
}

function nextQuestion(){
    let answers = questions[current].wrong;
    answers.push(questions[current].correct);
    answers = shuffle(answers);
    gameBox.innerHTML = `<div class="question" id="question" onmousedown='return false;' onselectstart='return false;'>${questions[current].question}</div>` + generateAnswers(answers);
    pictureBox.innerHTML = `<img src="/static/media/${questions[current].img}.jpg" class="image">`;
    window.myInterval = setInterval(function(){ 
        secs--;
        if(secs === 0){
            checkAnswer("sdadasd");
            secs = 20;
            num.innerHTML = "";
            clearInterval(interval);
        }
        num.innerHTML = secs;
    }, 1000);
    return;
}

function nextOpenQuestion(){
    gameBox.innerHTML = `<div class="question" id="question" onmousedown='return false;' onselectstart='return false;'>${questions[current].question}</div>
    <input type="text" name="answer" id="answerBox"><button type="button" onclick="checkOpenAnswer()">Check</button>`;
    pictureBox.innerHTML = `<img src="/static/media/${questions[current].img}.jpg" class="image">`;
    window.myInterval = setInterval(function(){ 
        secs--;
        if(secs === 0){
            checkAnswer("sdadasd");
            secs = 20;
            num.innerHTML = "";
            clearInterval(interval);
        }
        num.innerHTML = secs;
    }, 1000);
    return;
}

function checkOpenAnswer(){
    checkAnswer(document.getElementById("answerBox").value);
}
function generateAnswers(answers){
    let tmp = "";
    for(let i = 0; i <= 3; i++){
        tmp += `<div id="answer" onclick="checkAnswer('${answers[i]}');">${answers[i]}</div>`;
    }
    return tmp;
}

function shuffle(a){
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function checkAnswer(word){
    window.clearInterval(window.myInterval);
    secs = 20;
    if(current < 10){
        if(word === questions[current].correct){
            game.style.background = "#46B29D";
            setTimeout(function(){game.style.background = "#324D5C";}, 500);
            score += 3;
        }else{
            game.style.background = "#F53855";
            setTimeout(function(){game.style.background = "#324D5C";}, 500);
            score -= 1;
        }
    }else{
        if(checkString(word, questions[current].correct)){
            game.style.background = "#46B29D";
            setTimeout(function(){game.style.background = "#324D5C";}, 500);
            score += 3;
        }else{
            game.style.background = "#F53855";
            setTimeout(function(){game.style.background = "#324D5C";}, 500);
            score -= 1;
        }
    }

    socket.emit('score', playerName, score);
    current++;

    if(current < 10){
        setTimeout(function(){nextQuestion();}, 500);
    }else if(current < 15){
        setTimeout(function(){nextOpenQuestion();}, 500);
    }else {
        pictureBox.innerHTML = "";
        gameBox.innerHTML = `<h2 class="over">Game over</h2>`;
    }
    return;
}

function checkString(text, check) {
    return text.toLowerCase().includes(check.toLowerCase());
}

function updateScores(players, scores){
    let list = "";
    for(let i = 0 ; i <= players.length; i++){
        if(players[i]){
            list += `<li>${players[i] || ""}: ${scores[i] || "0"} points</li>`;
        }
    }
    resultsList.innerHTML = list;
    return;
}


socket.on('login', function (data) {
    //console.log(data);
    //updateNumOfPlayers(data);
});

socket.on('scoreUpdate', function (scores, players) {
    updateScores(players, scores);
});


startButton.addEventListener("click", startGame);