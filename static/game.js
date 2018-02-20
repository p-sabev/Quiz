const socket = io();


const questions = [
    {
        "question": "What is the name of Batman's butler?",
        "correct": "Alfred",
        "wrong": ["James", "John", "Tom"]
    },{
        "question": "Who is the founder of the social networking website Twitter? ",
        "correct": "Jack Dorsey",
        "wrong": ["Mark Zuckerberg", "Steve Jobs", "Sergey Brin"]
    },{
        "question": "What`s the name of the younger son of England`s Prince Charles and Princess Diana?",
        "correct": "Prince Harry",
        "wrong": ["Prince Charlston","Prince William","Prince Harold"]
    },{
        "question": "Which of these books is Stephen King`s book? ",
        "correct": "The girl who loved Tom Gordon",
        "wrong": ["Frankenstein","Haunted","House of Leaves"]
    },{
        "question": "Which of these celebrities wasn`t in 'The Mickey Mouse Club'?",
        "correct": "Jessica Simpson",
        "wrong": ["Christina Aguilera", "Justin Timberlake", "Ryan Gosling"]
    }
];

const startButton = document.getElementById("start");
const gameBox = document.getElementById("gameBox");
const game = document.getElementById("game");

let current = 0,
    score = 0;

function nextQuestion(){
    let answers = questions[current].wrong;
    answers.push(questions[current].correct);
    answers = shuffle(answers);
    gameBox.innerHTML = `<div class="question" id="question" onmousedown='return false;' onselectstart='return false;'>${questions[current].question}</div>` + generateAnswers(answers);
}

function generateAnswers(answers){
    let tmp = "";
    for(let i = 0; i <= 3; i++){
        tmp += `<div id="answer" onclick="checkAnswer('${answers[i]}');">${answers[i]}</div>`;
    }
    return tmp;
}

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function checkAnswer(word){
    if(word === questions[current].correct){
        game.style.background = "#46B29D";
        setTimeout(function(){game.style.background = "#324D5C";}, 500);
        score += 3;
    }else{
        game.style.background = "#F53855";
        setTimeout(function(){game.style.background = "#324D5C";}, 500);
        score -= 1;
    }
    current++;
    if(current < questions.length){
        setTimeout(function(){nextQuestion();}, 500);
    }else {
        alert(score);
    }
}

startButton.addEventListener("click", nextQuestion);

socket.emit('New player');

setInterval(function() {
  socket.emit('message', "hi");
}, 1000 / 60);