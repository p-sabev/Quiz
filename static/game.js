const socket = io();
const loginButton = document.getElementById("start");
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
    questions,
    allPlayers = [];
const divQuestion = `<div class="question" id="question" onmousedown='return false;' onselectstart='return false;'>`;

fetch("/static/questions.json")
  .then(response => response.json())
  .then(json => questions = json);

function logIn(){
    playerName = document.getElementById("name").value;

    if(checkName(playerName)){
        if(allPlayers.indexOf(playerName) === -1){
            socket.emit('new player', playerName);
            sessionStorage.setItem("username", playerName);
            gameBox.innerHTML = `<button id="start" class="btn" onclick="startGame()">Start</button>`;
        }else{
            alert("This user already exists, please choose other name.");
        }
    }else{
        alert("Please set correct name");
    }
    return;
}

function checkName(name){
    const regExp = /^[a-zA-Z0-9]+$/;
    return regExp.test(name);
}

function startGame(){
    score = 0;
    nextQuestion();
    return;
}

function nextQuestion(){
    let answers = questions[current].wrong;
    answers.push(questions[current].correct);
    answers = shuffle(answers);
    gameBox.innerHTML = `${divQuestion}${questions[current].question}</div>` + generateAnswers(answers) + `<img src="/static/media/${questions[current].img}.jpg" class="image">`;
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
    gameBox.innerHTML = `${divQuestion}${questions[current].question}</div><input type="text" name="answer" id="answerBox"><button type="button" onclick="checkOpenAnswer()">Check</button><img src="/static/media/${questions[current].img}.jpg" class="image">`;
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

function shuffle(a){
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function checkOpenAnswer(){
    checkAnswer(document.getElementById("answerBox").value);
}

function checkAnswer(word){
    window.clearInterval(window.myInterval);
    secs = 20;

    let wrong = questions[current].wrong;
    if(wrong && wrong.length === 3){
        checkClosedQuestion();
    }else{
        checkOpenQuestion(word);
    }

    socket.emit('score', playerName, score);
    current++;
    
    continueGame();
    return;
}

function checkClosedQuestion(){
    if(word === questions[current].correct){
        return trueAnswer();
    }else{
        return wrongAnswer();
    }
}

function checkOpenQuestion(word){
    if(checkString(word, questions[current].correct)){
        return trueAnswer();
    }else{
        return wrongAnswer();
    }
}

function continueGame(){
    if(current < 10){
        setTimeout(function(){nextQuestion();}, 500);
    }else if(current < 15){
        setTimeout(function(){nextOpenQuestion();}, 500);
    }else {
        gameBox.innerHTML = `<h2 class="over">Game over</br>You have: ${score}points :)</h2>`;
        num.innerHTML = "";
    }
    return;
}

function trueAnswer(){
    num.innerHTML = "";
    game.style.background = "#46B29D";
    setTimeout(function(){game.style.background = "#324D5C";}, 500);
    score += 3;
}

function wrongAnswer(){
    num.innerHTML = "";
    game.style.background = "#F53855";
    setTimeout(function(){game.style.background = "#324D5C";}, 500);
    score -= 1;
}

function generateAnswers(answers){
    let tmp = "";
    for(let i = 0; i <= 3; i++){
        tmp += `<div id="answer" onclick="checkAnswer('${answers[i]}');">${answers[i]}</div>`;
    }
    return tmp;
}

function checkString(text, check) {
    return text.toLowerCase().includes(check.toLowerCase());
}

function updateScores(scores, players){
    let list = "";
    for(let i = 0 ; i <= players.length; i++){
        if(players[i]){
            list += `<li>${players[i] || ""}: ${scores[i] || "0"} points</li>`;
        }
    }
    resultsList.innerHTML = list;
    return;
}

//First array should be that with scores
function sortArraysByFirstArray(arr1, arr2){
    let len = arr1.length;
    for (let i = len-1; i>=0; i--){
        for(let j = 1; j<=i; j++){
            if(arr1[j-1] < arr1[j]){
                swap(arr1, j-1, j);
                swap(arr2, j-1, j);
            }
        }
    }
    return [arr1, arr2];
}

function swap(arr, i, j){
    var temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}


socket.on('scoreUpdate', function (scores, players) {
    let tmp = sortArraysByFirstArray(scores, players);
    scores = tmp[0];
    players = tmp[1];
    updateScores(scores, players);
});

socket.on('playersUpdate', function (players){
    allPlayers = players;
});

loginButton.addEventListener("click", logIn);

window.onload = function() {
    socket.emit('getPlayers');
    let item = sessionStorage.getItem("username");
    if(item && item !== ""){
        playerName = sessionStorage.getItem("username");
        if(allPlayers.indexOf(playerName) === -1){
            socket.emit('new player', playerName);
        }
        gameBox.innerHTML = `<button id="start" class="btn" onclick="startGame()">Start</button>`;
    }
    return;
};

particlesJS.load('particles-js', '/static/particlesjs-config.json', function() {
    console.log('callback - particles.js config loaded');
});