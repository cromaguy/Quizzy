let currentQuestion = 0;
let score = 0;
let answered = false;
let selectedAnswers = new Array(10).fill(null); // Store selected answers
let scoredQuestions = new Set(); // Track which questions have been scored
let timerInterval = null;
let timeLeft = 20; // Default time per question
let maxTimePerQuestion = 20; // Default value
let timerActive = true; // Track if timer is active
let questionStats = []; // Track stats for each question
let maxStreak = 0;
let currentStreak = 0;

// Theme and sound settings
let isDarkMode = false;
let soundEnabled = true;

const questions = [
    {
        question: "Who is replacing Justin Trudeau as leader of the Liberal party in Canada?",
        answers: ["Mark Carney", "François-Philippe Champagne", "Chrystia Freeland", "Melanie Joly"],
        correctAnswer: 1,
        hint: "This person has served as Deputy Prime Minister."
    },
    {
        question: "Which country will host the FIFA World Cup in 2026?",
        answers: ["Germany", "India", "Australia", "United States, Canada, and Mexico"],
        correctAnswer: 3,
        hint: "This will be the first tournament hosted by three nations."
    },
    {
        question: "What is the capital of Guatemala?",
        answers: ["Antigua", "Quetzaltenango", "Guatemala City", "Escuintla"],
        correctAnswer: 2,
        hint: "The capital shares its name with the country."
    },
    {
        question: "Which planet is known as the Red Planet?",
        answers: ["Mars", "Venus", "Jupiter", "Saturn"],
        correctAnswer: 0,
        hint: "Named after the Roman god of war."
    },
    {
        question: "What is the chemical symbol for Gold?",
        answers: ["Ag", "Au", "Go", "Gd"],
        correctAnswer: 1,
        hint: "It comes from the Latin word 'Aurum'."
    },
    {
        question: "Who painted the Mona Lisa?",
        answers: ["Michelangelo", "Raphael", "Leonardo da Vinci", "Caravaggio"],
        correctAnswer: 2,
        hint: "He was also a brilliant inventor and polymath from Italy."
    },
    {
        question: "What is the largest planet in our solar system?",
        answers: ["Saturn", "Earth", "Uranus", "Jupiter"],
        correctAnswer: 3,
        hint: "Named after the king of the Roman gods."
    },
    {
        question: "Which country is known as the Land of the Rising Sun?",
        answers: ["China", "South Korea", "Thailand", "Japan"],
        correctAnswer: 3,
        hint: "The name of this country literally means 'sun-origin'."
    },
    {
        question: "What is the smallest prime number?",
        answers: ["2", "1", "3", "5"],
        correctAnswer: 0,
        hint: "It's the only even prime number."
    },
    {
        question: "Which element has the chemical symbol 'O'?",
        answers: ["Gold", "Silver", "Oxygen", "Osmium"],
        correctAnswer: 2,
        hint: "This element is essential for human respiration."
    }
];

// Get all DOM elements
const questionElement = document.getElementById('question');
const answersElement = document.getElementById('answers');
const submitBtn = document.getElementById('submit-btn');
const resultElement = document.getElementById('result');
const progressBar = document.getElementById('progress-bar');
const prevBtn = document.getElementById("prev-btn");
const startScreen = document.getElementById("start-screen");
const startBtn = document.getElementById("start-btn");
const quizContainer = document.getElementById("quiz-container");
const resultsScreen = document.getElementById("results-screen");
const reviewScreen = document.getElementById("review-screen");
const restartBtn = document.getElementById("restart-btn");
const reviewBtn = document.getElementById("review-btn");
const backToResultsBtn = document.getElementById("back-to-results");
const shareBtn = document.getElementById("share-btn");
const timerDisplay = document.getElementById("timer");
const timerContainer = document.getElementById("timer-container");
const questionNumberDisplay = document.getElementById("question-number");
const hintBtn = document.getElementById("hint-btn");
const hintBox = document.getElementById("hint-box");
const themeToggle = document.getElementById("theme-icon");
const soundToggle = document.getElementById("sound-icon");
const finalScoreDisplay = document.getElementById("final-score");
const avgTimeDisplay = document.getElementById("avg-time");
const streakDisplay = document.getElementById("streak");
const accuracyDisplay = document.getElementById("accuracy");
const resultFeedback = document.getElementById("result-feedback");

// Difficulty buttons
const difficultyBtns = document.querySelectorAll('.difficulty-btn');
difficultyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        difficultyBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});

// Time buttons
const timeBtns = document.querySelectorAll('.time-btn');
timeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        timeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        maxTimePerQuestion = parseInt(btn.dataset.time);
        timerActive = maxTimePerQuestion > 0;
    });
});

// Theme toggle functionality
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    isDarkMode = document.body.classList.contains('dark-mode');

    // Update theme icon
    if (isDarkMode) {
        themeToggle.textContent = '☀️';
    } else {
        themeToggle.textContent = '🌙';
    }

    // Play sound effect
    if (soundEnabled) {
        playSound('switch');
    }
});

// Sound toggle functionality
soundToggle.addEventListener('click', () => {
    soundEnabled = !soundEnabled;

    // Update sound icon
    if (soundEnabled) {
        soundToggle.textContent = '🔊';
    } else {
        soundToggle.textContent = '🔇';
    }

    // Play sound effect if turning sound on
    if (soundEnabled) {
        playSound('switch');
    }
});

// Sound effects function
function playSound(type) {
    if (!soundEnabled) return;

    // Sound effects could be implemented here
    // For example: new Audio('correct.mp3').play();
    console.log(`Playing sound: ${type}`);
}

// Start Quiz - Hide Start Screen & Show Quiz
startBtn.addEventListener("click", () => {
    startScreen.style.opacity = "0"; // Smooth fade-out

    // Reset quiz state
    currentQuestion = 0;
    score = 0;
    answered = false;
    selectedAnswers = new Array(10).fill(null);
    scoredQuestions = new Set();
    questionStats = [];
    maxStreak = 0;
    currentStreak = 0;

    // Get selected time
    const activeTimeBtn = document.querySelector('.time-btn.active');
    maxTimePerQuestion = parseInt(activeTimeBtn.dataset.time);
    timerActive = maxTimePerQuestion > 0;
    timeLeft = maxTimePerQuestion;

    setTimeout(() => {
        startScreen.style.display = "none";
        quizContainer.style.display = "block";
        loadQuestion(); // Load the first question only after showing the quiz
    }, 500);

    playSound('start');
});

function loadQuestion() {
    // Reset timer if active
    if (timerActive) {
        clearInterval(timerInterval);
        timeLeft = maxTimePerQuestion;
        timerDisplay.textContent = timeLeft;
        startTimer();
    } else {
        timerContainer.style.display = 'none';
    }

    answered = selectedAnswers[currentQuestion] !== null; // If already answered
    questionElement.innerText = questions[currentQuestion].question;
    answersElement.innerHTML = '';

    // Update question number display
    questionNumberDisplay.textContent = `Question ${currentQuestion + 1}/${questions.length}`;

    // Create answer options
    questions[currentQuestion].answers.forEach((answer, index) => {
        const answerContainer = document.createElement('div');
        answerContainer.className = 'answer-container';

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

        // Apply styling if question was already answered
        if (answered) {
            if (index === questions[currentQuestion].correctAnswer) {
                label.classList.add('correct-answer');
            } else if (index === selectedAnswers[currentQuestion]) {
                label.classList.add('incorrect-answer');
            }
        }

        radio.addEventListener('change', () => {
            markAnswer(index);
        });

        answersElement.appendChild(radio);
        answersElement.appendChild(label);
    });

    // Update button states
    prevBtn.style.display = currentQuestion > 0 ? "inline-block" : "none";
    submitBtn.textContent = currentQuestion === questions.length - 1 ? "Finish" : "Next";

    // Hide hint box
    hintBox.style.display = 'none';

    // Reset result message
    resultElement.style.display = 'none';

    updateProgressBar();
}

// Timer functionality
function startTimer() {
    if (!timerActive) return;

    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft;

        if (timeLeft <= 5) {
            timerDisplay.style.color = '#F44336'; // Red color for urgency
        } else {
            timerDisplay.style.color = ''; // Reset color
        }

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            // Auto-submit when time runs out
            checkAnswer(true);
        }
    }, 1000);
}

// Go to Previous Question
prevBtn.addEventListener("click", () => {
    if (currentQuestion > 0) {
        currentQuestion--;
        loadQuestion();
    }

    playSound('click');
});

function markAnswer(selectedIndex) {
    answered = true;
    selectedAnswers[currentQuestion] = selectedIndex;
}

// Show hint
hintBtn.addEventListener("click", () => {
    hintBox.textContent = questions[currentQuestion].hint;
    hintBox.style.display = hintBox.style.display === 'none' ? 'block' : 'none';

    playSound('click');
});

// Validate answer before proceeding
// Fix for the checkAnswer function to properly update score
function checkAnswer(timeExpired = false) {
    if (!answered && !timeExpired) {
        alert("Please select an answer.");
        return false;
    }

    clearInterval(timerInterval); // Stop the timer

    const selectedAnswer = selectedAnswers[currentQuestion];
    const correctAnswer = questions[currentQuestion].correctAnswer;

    // Record stats for this question
    const timeSpent = maxTimePerQuestion - timeLeft;

    // If time expired and no answer selected, mark as incorrect
    if (timeExpired && selectedAnswer === null) {
        selectedAnswers[currentQuestion] = -1; // Special value for time expired
    }

    // Track if answer is correct
    const isCorrect = selectedAnswer === correctAnswer;

    // Update streak counter
    if (isCorrect) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
        playSound('correct');
    } else {
        currentStreak = 0;
        playSound('incorrect');
    }

    // Save question stats
    questionStats.push({
        questionIndex: currentQuestion,
        timeSpent: timeSpent,
        correct: isCorrect,
        selectedAnswer: selectedAnswer
    });

    // Apply correct/incorrect styling
    const labels = answersElement.querySelectorAll('label');
    labels.forEach((label, index) => {
        if (index === correctAnswer) {
            label.classList.add('correct-answer');
        } else if (index === selectedAnswer) {
            label.classList.add('incorrect-answer');
        }
    });

    // Fix: Score only if first time answering this question AND if the answer is correct
    if (!scoredQuestions.has(currentQuestion)) {
        if (isCorrect) {
            score++;
        }
        scoredQuestions.add(currentQuestion);
    }

    // Show feedback
    resultElement.innerHTML = '';
    let icon = document.createElement("span");
    icon.classList.add("icon");

    if (isCorrect) {
        icon.innerHTML = "✓";
        icon.classList.add("correct-icon");
        resultElement.innerText = "Correct!";
    } else if (timeExpired) {
        icon.innerHTML = "⏱️";
        icon.classList.add("incorrect-icon");
        resultElement.innerText = "Time's up!";
    } else {
        icon.innerHTML = "✗";
        icon.classList.add("incorrect-icon");
        resultElement.innerText = "Incorrect!";
    }

    resultElement.appendChild(icon);
    resultElement.style.display = 'flex';

    // Disable answer selection after answering
    const radioButtons = answersElement.querySelectorAll('input[type="radio"]');
    radioButtons.forEach(radio => {
        radio.disabled = true;
    });

    // Auto proceed after delay
    setTimeout(() => {
        nextQuestion();
    }, 1500);

    return true;
}

function nextQuestion() {
    currentQuestion++;

    if (currentQuestion >= questions.length) {
        displayResults();
    } else {
        loadQuestion();
    }
}

// Display Result Screen with detailed stats
// Fix for the displayResults function to show the correct score
function displayResults() {
    quizContainer.style.display = 'none';
    resultsScreen.style.display = 'block';

    // Calculate stats
    const attemptedQuestions = questionStats.length;
    const correctAnswers = questionStats.filter(q => q.correct).length;
    const accuracy = attemptedQuestions > 0 ? (correctAnswers / attemptedQuestions) * 100 : 0;
    const totalTimeSpent = questionStats.reduce((sum, q) => sum + q.timeSpent, 0);
    const avgTime = attemptedQuestions > 0 ? Math.round(totalTimeSpent / attemptedQuestions) : 0;

    // Fix: Update final score display with the actual score
    finalScoreDisplay.textContent = score;
    avgTimeDisplay.textContent = `${avgTime}s`;
    streakDisplay.textContent = maxStreak;
    accuracyDisplay.textContent = `${Math.round(accuracy)}%`;

    // Generate feedback message
    let feedback = "";
    if (score >= 9) {
        feedback = "Outstanding! You're a quiz master! 🏆";
        playSound('excellent');
    } else if (score >= 7) {
        feedback = "Great job! Your knowledge is impressive! 🌟";
        playSound('great');
    } else if (score >= 5) {
        feedback = "Good effort! Keep learning and improving! 📚";
        playSound('good');
    } else if (score >= 3) {
        feedback = "Not bad! You're making progress. Keep it up! 👍";
        playSound('okay');
    } else {
        feedback = "You can do better! Try again to improve your score. 💪";
        playSound('try-again');
    }

    resultFeedback.textContent = feedback;

    // Show confetti for good scores
    if (score >= 7) {
        showConfetti();
    }
}
// Review Answers
reviewBtn.addEventListener("click", () => {
    resultsScreen.style.display = 'none';
    reviewScreen.style.display = 'block';

    // Create review items for each question
    const reviewContainer = document.getElementById("review-container");
    reviewContainer.innerHTML = '';

    questions.forEach((q, index) => {
        const reviewItem = document.createElement('div');
        reviewItem.className = 'review-item';

        // Question number and text
        const questionText = document.createElement('div');
        questionText.className = 'review-question';
        questionText.innerText = `Question ${index + 1}: ${q.question}`;
        reviewItem.appendChild(questionText);

        // Options
        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'review-options';

        q.answers.forEach((answer, ansIndex) => {
            const option = document.createElement('div');
            option.className = 'review-option';

            // Mark correct answer
            if (ansIndex === q.correctAnswer) {
                option.classList.add('review-correct');
                option.innerHTML = `<span>✓</span> ${answer}`;
            }
            // Mark selected incorrect answer
            else if (ansIndex === selectedAnswers[index] && selectedAnswers[index] !== q.correctAnswer) {
                option.classList.add('review-incorrect');
                option.innerHTML = `<span>✗</span> ${answer}`;
            }
            // Regular option
            else {
                option.innerText = answer;
            }

            // Highlight selected answer
            if (ansIndex === selectedAnswers[index]) {
                option.classList.add('review-selected');
            }

            optionsContainer.appendChild(option);
        });

        reviewItem.appendChild(optionsContainer);

        // Question stats
        const questionStat = questionStats.find(stat => stat.questionIndex === index);
        if (questionStat) {
            const statInfo = document.createElement('div');
            statInfo.className = 'review-stats';
            statInfo.innerHTML = `<small>Time taken: ${questionStat.timeSpent}s | ${questionStat.correct ? 'Correct' : 'Incorrect'}</small>`;
            reviewItem.appendChild(statInfo);
        }

        reviewContainer.appendChild(reviewItem);
    });

    playSound('click');
});

// Back to Results
backToResultsBtn.addEventListener("click", () => {
    reviewScreen.style.display = 'none';
    resultsScreen.style.display = 'block';

    playSound('click');
});

// Restart Quiz
restartBtn.addEventListener("click", () => {
    resultsScreen.style.display = 'none';
    startScreen.style.display = 'block';
    startScreen.style.opacity = '1';

    // Reset quiz state
    currentQuestion = 0;
    score = 0;
    answered = false;
    selectedAnswers = new Array(10).fill(null);
    scoredQuestions = new Set();

    playSound('click');
});

// Share Results
shareBtn.addEventListener("click", () => {
    // Create shareable text
    const shareText = `I scored ${score}/10 on Quizzy 2.0! My accuracy was ${document.getElementById('accuracy').textContent} with a max streak of ${maxStreak}. Can you beat my score?`;

    // Check if Web Share API is available
    if (navigator.share) {
        navigator.share({
            title: 'My Quiz Results',
            text: shareText,
        })
            .catch(error => console.log('Error sharing:', error));
    } else {
        // Fallback: Copy to clipboard
        navigator.clipboard.writeText(shareText)
            .then(() => {
                alert('Result copied to clipboard! Share it with your friends.');
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
            });
    }

    playSound('share');
});

// Submit Answer / Next Question
submitBtn.addEventListener("click", () => {
    // If not answered, check the answer first
    if (!answered) {
        if (checkAnswer()) {
            // Will automatically go to next question after delay
        }
    } else {
        // If already answered, go to next question immediately
        nextQuestion();
    }

    playSound('click');
});

// Update progress bar
function updateProgressBar() {
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    progressBar.style.width = `${progress}%`;
}

// Confetti celebration
function showConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Simple confetti particles
    const particles = [];
    const particleCount = 100;
    const gravity = 0.3;
    const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4CAF50'];

    // Create particles
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            size: Math.random() * 10 + 5,
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.random() * 360,
            speed: Math.random() * 3 + 2,
            velocity: Math.random() * 2 - 1,
            rotationSpeed: Math.random() * 0.5 - 0.25
        });
    }

    // Update and draw particles
    function animateConfetti() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let stillActive = false;

        particles.forEach(p => {
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation * Math.PI / 180);

            ctx.fillStyle = p.color;
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);

            ctx.restore();

            p.y += p.speed;
            p.x += p.velocity;
            p.rotation += p.rotationSpeed;

            if (p.y < canvas.height) stillActive = true;
        });

        if (stillActive) {
            requestAnimationFrame(animateConfetti);
        } else {
            // Clear canvas when all confetti has fallen
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    animateConfetti();
}

// Load the first question when the page is loaded
document.addEventListener('DOMContentLoaded', () => {
    startScreen.style.opacity = "1";
});