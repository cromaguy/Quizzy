let currentQuestion = 0;
let score = 0;
let answered = false; // Flag to track if an answer has been selected
const questions = [
    {
        question: "What is the capital of France?",
        answers: ["Berlin", "Paris", "London", "Rome"],
        correctAnswer: 1
    },
    {
        question: "What is the largest planet in our solar system?",
        answers: ["Earth", "Saturn", "Jupiter", "Uranus"],
        correctAnswer: 2
    },
    {
        question: "Who painted the Mona Lisa?",
        answers: ["Leonardo da Vinci", "Michelangelo", "Raphael", "Caravaggio"],
        correctAnswer: 0
    },
    {
        question: "Which is the most spoken language in the world (2025)?",
        answers: ["English", "Mandarin Chinese", "Spanish", "Hindi"],
        correctAnswer: 1
    },
    {
        question: "What is the latest iPhone model released in 2025?",
        answers: ["iPhone 14", "iPhone 15", "iPhone 16", "iPhone 17"],
        correctAnswer: 2
    },
    {
        question: "Which country will host the FIFA World Cup 2026?",
        answers: ["United States, Canada, Mexico", "Germany", "India", "Australia"],
        correctAnswer: 0
    },
    {
        question: "What is the speed of light in vacuum?",
        answers: ["299,792 km/s", "150,000 km/s", "1,000 km/s", "3,000 km/s"],
        correctAnswer: 0
    },
    {
        question: "Which tech company developed ChatGPT?",
        answers: ["Google", "Microsoft", "OpenAI", "Apple"],
        correctAnswer: 2
    },
    {
        question: "What is the chemical symbol for Gold?",
        answers: ["Go", "Gd", "Au", "Ag"],
        correctAnswer: 2
    },
    {
        question: "Which planet is known as the Red Planet?",
        answers: ["Mars", "Venus", "Saturn", "Neptune"],
        correctAnswer: 0
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
    }, 500);
    loadQuestion();
});

// Load Question & Update UI
function loadQuestion() {
    answered = false;
    questionElement.innerText = questions[currentQuestion].question;
    answersElement.innerHTML = '';

    questions[currentQuestion].answers.forEach((answer, index) => {
        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'answer';
        radio.value = index;
        radio.id = `answer-${index}`;

        const label = document.createElement('label');
        label.htmlFor = `answer-${index}`;
        label.innerText = answer;

        label.addEventListener('click', () => {
            if (!answered) {
                markAnswer(index);
            }
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
    answered = true; // Set the answered flag

    // Style the selected answer
    const labels = answersElement.querySelectorAll('label');
    labels.forEach((label, index) => {
        if (index == selectedIndex) {
            label.classList.add('selected'); // Add a class to style the selected label
        }
    });

    // Disable further clicks
    disableAnswers();
}

function disableAnswers() {
    const labels = answersElement.querySelectorAll('label');
    labels.forEach(label => {
        label.style.pointerEvents = 'none'; // Disable click events
    });
}

function checkAnswer() {
    if (!answered) {
        alert("Please select an answer.");
        return false;
    }

    const selectedAnswer = document.querySelector('input[name="answer"]:checked');
    if (!selectedAnswer) return false;

    const answerIndex = parseInt(selectedAnswer.value);

    // Apply correct/incorrect styling
    const labels = answersElement.querySelectorAll('label');
    labels.forEach((label, index) => {
        if (index == questions[currentQuestion].correctAnswer) {
            label.classList.add('correct-answer');
        } else if (index == answerIndex) {
            label.classList.add('incorrect-answer');
        }
    });

    if (answerIndex == questions[currentQuestion].correctAnswer) {
        score++;
    }

    // Delay for a short time before loading the next question
    setTimeout(() => {
        nextQuestion();
    }, 1500);

    return true;
}

function nextQuestion() {
    // Remove correct/incorrect styling
    const labels = answersElement.querySelectorAll('label');
    labels.forEach(label => {
        label.classList.remove('correct-answer', 'incorrect-answer', 'selected');
        label.style.pointerEvents = 'auto'; // Re-enable click events
    });

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
    // currentQuestion = 0;
    // score = 0;
    // resultElement.innerText = "";
    // restartBtn.style.display = "none";
    // submitBtn.style.display = "block";
    // progressBar.style.display = "block";
    // loadQuestion();
    window.location.reload();
});


function updateProgressBar() {
    const progress = ((currentQuestion + 1) / questions.length) * 100; // Proper dynamic progress
    progressBar.style.width = `${progress}%`;
}

// Event listener to check the answer
submitBtn.addEventListener('click', checkAnswer);

// Load the first question when the quiz starts
loadQuestion();

