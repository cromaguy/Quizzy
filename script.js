let currentQuestion = 0;
let score = 0;
let answered = false;
let selectedAnswers = new Array(10).fill(null); // Store selected answers
let scoredQuestions = new Set(); // Track which questions have been scored

const questions = [
    {
        question: "Who is replacing Justin Trudeau as leader of the Liberal party in Canada?",
        answers: ["Mark Carney", "François-Philippe Champagne", "Chrystia Freeland", "Melanie Joly"],
        correctAnswer: 1
    },
    {
        question: "Which country will host the FIFA World Cup in 2026?",
        answers: ["Germany", "India", "Australia", "United States, Canada, and Mexico"],
        correctAnswer: 3
    },
    {
        question: "What is the capital of Guatemala?",
        answers: ["Antigua", "Quetzaltenango", "Guatemala City", "Escuintla"],
        correctAnswer: 2
    },
    {
        question: "Which planet is known as the Red Planet?",
        answers: ["Mars", "Venus", "Jupiter", "Saturn"],
        correctAnswer: 0
    },
    {
        question: "What is the chemical symbol for Gold?",
        answers: ["Ag", "Au", "Go", "Gd"],
        correctAnswer: 1
    },
    {
        question: "Who painted the Mona Lisa?",
        answers: ["Michelangelo", "Raphael", "Leonardo da Vinci", "Caravaggio"],
        correctAnswer: 2
    },
    {
        question: "What is the largest planet in our solar system?",
        answers: ["Saturn", "Earth", "Uranus", "Jupiter"],
        correctAnswer: 3
    },
    {
        question: "Which country is known as the Land of the Rising Sun?",
        answers: ["China", "South Korea", "Thailand", "Japan"],
        correctAnswer: 3
    },
    {
        question: "What is the smallest prime number?",
        answers: ["2", "1", "3", "5"],
        correctAnswer: 0
    },
    {
        question: "Which element has the chemical symbol 'O'?",
        answers: ["Gold", "Silver", "Oxygen", "Osmium"],
        correctAnswer: 2
    }
];

const questionElement = document.getElementById('question');
const answersElement = document.getElementById('answers');
const submitBtn = document.getElementById('submit-btn');
const resultElement = document.getElementById('result');
const progressBar = document.getElementById('progress-bar');

const prevBtn = document.getElementById("prev-btn");
const startScreen = document.getElementById("start-screen");
const startBtn = document.getElementById("start-btn");
const quizContainer = document.getElementById("quiz-container");
const restartBtn = document.getElementById("restart-btn");

// Start Quiz - Hide Start Screen & Show Quiz
startBtn.addEventListener("click", () => {
    startScreen.style.opacity = "0"; // Smooth fade-out
    setTimeout(() => {
        startScreen.style.display = "none";
        quizContainer.style.display = "block";
        loadQuestion(); // Load the first question only after showing the quiz
    }, 500);
});

function loadQuestion() {
    answered = selectedAnswers[currentQuestion] !== null; // If already answered, allow proceeding
    questionElement.innerText = questions[currentQuestion].question;
    answersElement.innerHTML = '';

    questions[currentQuestion].answers.forEach((answer, index) => {
        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'answer';
        radio.value = index;
        radio.id = `answer-${index}`;

        if (selectedAnswers[currentQuestion] === index) {
            radio.checked = true; // Restore previous selection
        }

        const label = document.createElement('label');
        label.htmlFor = `answer-${index}`;
        label.innerText = answer;

        radio.addEventListener('change', () => {
            markAnswer(index);
        });

        answersElement.appendChild(radio);
        answersElement.appendChild(label);
    });

    updateProgressBar();
    prevBtn.style.display = currentQuestion > 0 ? "inline-block" : "none";
}

// Go to Previous Question
prevBtn.addEventListener("click", () => {
    if (currentQuestion > 0) {
        currentQuestion--;
        loadQuestion();
    }
});

function markAnswer(selectedIndex) {
    answered = true;
    selectedAnswers[currentQuestion] = selectedIndex;
}

// Validate answer before proceeding
function checkAnswer() {
    if (!answered) {
        alert("Please select an answer.");
        return false;
    }

    const selectedAnswer = selectedAnswers[currentQuestion];

    // Apply correct/incorrect styling
    const labels = answersElement.querySelectorAll('label');
    labels.forEach((label, index) => {
        if (index === questions[currentQuestion].correctAnswer) {
            label.classList.add('correct-answer');
        } else if (index === selectedAnswer) {
            label.classList.add('incorrect-answer');
        }
    });

    // Score only if first time answering this question
    if (!scoredQuestions.has(currentQuestion) && selectedAnswer === questions[currentQuestion].correctAnswer) {
        score++;
        scoredQuestions.add(currentQuestion);
    }

    setTimeout(() => {
        nextQuestion();
    }, 1500);

    return true;
}

function nextQuestion() {
    currentQuestion++;

    if (currentQuestion >= questions.length) {
        displayResult();
    } else {
        loadQuestion();
    }
}

// Display Result & Show Restart Button
function displayResult() {
    prevBtn.style.display = "none";
    questionElement.innerText = '';
    answersElement.innerHTML = '';
    submitBtn.style.display = 'none';
    progressBar.style.display = 'none';

    let icon = document.createElement("span");
    icon.classList.add("icon");

    if (score >= questions.length / 2) {
        icon.innerHTML = "✅";
        icon.classList.add("correct-icon");
        resultElement.innerText = `Quiz Completed! Your Score: ${score} / ${questions.length}`;
    } else {
        icon.innerHTML = "❌";
        icon.classList.add("incorrect-icon");
        resultElement.innerText = `Better luck next time! Your Score: ${score} / ${questions.length}`;
    }

    resultElement.appendChild(icon);
    resultElement.style.display = 'flex';
    restartBtn.style.display = 'block'; // Show Restart Button
}

// Restart Quiz Function
restartBtn.addEventListener("click", () => {
    window.location.reload();
});

function updateProgressBar() {
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    progressBar.style.width = `${progress}%`;
}

// Event listener to check the answer
submitBtn.addEventListener('click', checkAnswer);
