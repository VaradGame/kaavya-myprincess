import './style.css'
import confetti from 'canvas-confetti'

// Quiz Questions Data
const quizQuestions = [
    {
        question: "When did we first talk?",
        answers: ["November 11", "November 10", "November 12", "November 15"],
        correct: 0
    },
    {
        question: "When did we first speak on a call?",
        answers: ["May 4", "May 5", "May 6", "May 7"],
        correct: 1
    },
    {
        question: "When did we hold hands for the first time?",
        answers: ["April 26", "April 27", "April 28", "April 25"],
        correct: 1
    },
    {
        question: "When was our first hug?",
        answers: ["April 12", "April 13", "April 14", "April 15"],
        correct: 1
    },
    {
        question: "When did you first get feelings for me?",
        answers: ["August 25", "August 26", "August 27", "August 24"],
        correct: 1
    },
    {
        question: "When was our first kiss?",
        answers: ["August 10", "August 11", "August 12", "August 9"],
        correct: 1
    },
    {
        question: "When did we start dating?",
        answers: ["May 5", "May 6", "May 7", "May 8"],
        correct: 1
    }
];

let currentQuestion = 0;
let wrongAnswerCount = 0;
let noButtonAttempts = 0;

// DOM Elements
const openingScreen = document.getElementById('opening-screen');
const welcomeScreen = document.getElementById('welcome-screen');
const quizScreen = document.getElementById('quiz-screen');
const valentineScreen = document.getElementById('valentine-screen');

const wrongOverlays = [
    document.getElementById('wrong-overlay-1'),
    document.getElementById('wrong-overlay-2'),
    document.getElementById('wrong-overlay-3')
];

const celebrationOverlay = document.getElementById('celebration-overlay');

const transitionPhase = document.getElementById('transition-phase');
const questionPhase = document.getElementById('question-phase');
const messagePhase = document.getElementById('message-phase');

const beginBtn = document.getElementById('begin-btn');
const startQuizBtn = document.getElementById('start-quiz-btn');
const questionTitle = document.getElementById('question-title');
const progressText = document.getElementById('progress-text');
const optionsContainer = document.getElementById('options-container');
const progressLine = document.getElementById('progress-line');
const questionContainer = document.querySelector('.question-container');

const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');

// Initialize - hide all phases
transitionPhase.style.display = 'none';
questionPhase.style.display = 'none';
messagePhase.style.display = 'none';

// Begin Journey
beginBtn.addEventListener('click', () => {
    fadeTransition(openingScreen, welcomeScreen);
});

// Start Quiz
startQuizBtn.addEventListener('click', () => {
    fadeTransition(welcomeScreen, quizScreen);
    loadQuestion();
});

// Fade Transition Helper
function fadeTransition(fromScreen, toScreen) {
    fromScreen.style.transition = 'opacity 0.8s ease-out';
    fromScreen.style.opacity = '0';

    setTimeout(() => {
        fromScreen.classList.remove('active');
        fromScreen.style.opacity = '1';
        toScreen.classList.add('active');
        toScreen.style.opacity = '0';

        setTimeout(() => {
            toScreen.style.transition = 'opacity 0.8s ease-in';
            toScreen.style.opacity = '1';
        }, 50);
    }, 800);
}

// Load Question with smooth fade
function loadQuestion() {
    const question = quizQuestions[currentQuestion];

    // Fade out
    questionContainer.style.opacity = '0';

    setTimeout(() => {
        progressText.textContent = `Question ${currentQuestion + 1} of ${quizQuestions.length}`;
        questionTitle.textContent = question.question;

        // Update progress
        const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;
        progressLine.style.width = `${progress}%`;

        // Clear previous options
        optionsContainer.innerHTML = '';

        // Create option buttons
        question.answers.forEach((answer, index) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.textContent = answer;
            btn.addEventListener('click', (e) => checkAnswer(index, e.target));
            optionsContainer.appendChild(btn);
        });

        // Fade in
        setTimeout(() => {
            questionContainer.style.opacity = '1';
        }, 50);
    }, 500);
}

// Check Answer
function checkAnswer(selectedIndex, buttonElement) {
    const question = quizQuestions[currentQuestion];

    if (selectedIndex === question.correct) {
        // Correct answer - MASSIVE confetti from button!
        fireConfettiFromButton(buttonElement);

        currentQuestion++;

        if (currentQuestion < quizQuestions.length) {
            // More questions - smooth transition
            setTimeout(() => {
                loadQuestion();
            }, 1200);
        } else {
            // Quiz complete - fade to Valentine screen with transitions
            setTimeout(() => {
                fadeToValentineScreen();
            }, 1500);
        }
    } else {
        // Wrong answer
        showWrongAnswer();
    }
}

// Fire MASSIVE Confetti from Button
function fireConfettiFromButton(buttonElement) {
    const rect = buttonElement.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    // MASSIVE confetti burst from button position
    confetti({
        particleCount: 100,
        spread: 90,
        origin: { x, y },
        colors: ['#FF6B9D', '#FFB3C6', '#FF85C1', '#FFC9D9', '#FFD700'],
        shapes: ['circle', 'square'],
        scalar: 1.5,
        gravity: 1.2
    });

    // Second burst for extra effect
    setTimeout(() => {
        confetti({
            particleCount: 60,
            spread: 120,
            origin: { x, y },
            colors: ['#FF6B9D', '#FFB3C6', '#FF85C1'],
            shapes: ['circle'],
            scalar: 1.2,
            gravity: 1
        });
    }, 150);

    // Third burst
    setTimeout(() => {
        confetti({
            particleCount: 40,
            spread: 80,
            origin: { x, y },
            colors: ['#FFD700', '#FF1493', '#FFB3C6'],
            shapes: ['circle'],
            scalar: 1,
            gravity: 0.8
        });
    }, 300);
}

// Show Wrong Answer (cycles through 3 overlays)
function showWrongAnswer() {
    const overlayIndex = wrongAnswerCount % 3;
    const overlay = wrongOverlays[overlayIndex];

    overlay.classList.add('active');
    wrongAnswerCount++;

    setTimeout(() => {
        overlay.classList.remove('active');
    }, 4000);
}

// Fade to Valentine Screen
function fadeToValentineScreen() {
    // Fade out quiz screen
    quizScreen.style.transition = 'opacity 1s ease-out';
    quizScreen.style.opacity = '0';

    setTimeout(() => {
        quizScreen.classList.remove('active');
        quizScreen.style.opacity = '1';

        // Show Valentine screen and start transition phase
        valentineScreen.classList.add('active');
        startTransitionSequence();
    }, 1000);
}

// Transition Sequence
function startTransitionSequence() {
    // Show transition phase
    transitionPhase.style.display = 'flex';
    transitionPhase.classList.add('active');

    const line1 = document.getElementById('line-1');
    const line2 = document.getElementById('line-2');
    const hint = document.getElementById('hint');

    // Line 1: "And now..."
    setTimeout(() => {
        line1.classList.add('show');
    }, 500);

    // Line 2: "For the final question..."
    setTimeout(() => {
        line2.classList.add('show');
    }, 3500);

    // Hint: "(Psst... there's only one right answer)"
    setTimeout(() => {
        hint.classList.add('show');
    }, 7000);

    // After all text, fade to question phase
    setTimeout(() => {
        transitionPhase.classList.remove('active');
        transitionPhase.style.display = 'none';

        questionPhase.style.display = 'flex';
        questionPhase.classList.add('active');
    }, 10000);
}

// Valentine's Question - No Button Runs Away
noBtn.addEventListener('mouseenter', () => {
    moveNoButton();
    growYesButton();
});

noBtn.addEventListener('click', (e) => {
    e.preventDefault();
    moveNoButton();
    growYesButton();
});

function moveNoButton() {
    noButtonAttempts++;

    const maxX = window.innerWidth - noBtn.offsetWidth - 100;
    const maxY = window.innerHeight - noBtn.offsetHeight - 100;

    const randomX = Math.max(50, Math.random() * maxX);
    const randomY = Math.max(50, Math.random() * maxY);

    noBtn.style.position = 'fixed';
    noBtn.style.left = randomX + 'px';
    noBtn.style.top = randomY + 'px';
    noBtn.style.transform = `scale(${Math.max(0.3, 1 - noButtonAttempts * 0.15)})`;
    noBtn.style.transition = 'all 0.3s ease';
}

function growYesButton() {
    const newScale = 1 + noButtonAttempts * 0.2;
    yesBtn.style.transform = `scale(${Math.min(newScale, 2)})`;
    yesBtn.style.transition = 'transform 0.4s ease';
}

// Yes Button - EPIC Celebration!
yesBtn.addEventListener('click', () => {
    showCelebration();
});

function showCelebration() {
    // Show celebration overlay with GIF
    celebrationOverlay.classList.add('active');

    // CONTINUOUS confetti WHILE the GIF is visible for 3 seconds!
    const duration = 3000;
    const animationEnd = Date.now() + duration;

    const colors = ['#FF6B9D', '#FFB3C6', '#FF85C1', '#FFC9D9', '#FFD700', '#FF1493'];

    // Big burst from center IMMEDIATELY when GIF appears
    confetti({
        particleCount: 150,
        spread: 180,
        origin: { y: 0.5 },
        colors: colors,
        shapes: ['circle', 'square'],
        scalar: 1.8,
        zIndex: 10001
    });

    // Continuous confetti from both sides WHILE GIF is showing
    (function frame() {
        // Left side confetti
        confetti({
            particleCount: 8,
            angle: 60,
            spread: 55,
            origin: { x: 0, y: 0.6 },
            colors: colors,
            scalar: 1.2,
            zIndex: 10001
        });
        // Right side confetti
        confetti({
            particleCount: 8,
            angle: 120,
            spread: 55,
            origin: { x: 1, y: 0.6 },
            colors: colors,
            scalar: 1.2,
            zIndex: 10001
        });

        // Keep firing confetti WHILE GIF is visible
        if (Date.now() < animationEnd) {
            requestAnimationFrame(frame);
        }
    }());

    // Another big burst halfway through (while GIF still visible)
    setTimeout(() => {
        confetti({
            particleCount: 120,
            spread: 160,
            origin: { y: 0.4 },
            colors: colors,
            shapes: ['circle'],
            scalar: 1.5,
            zIndex: 10001
        });
    }, 1500);

    // After 3 seconds, THEN fade to message (confetti stops automatically)
    setTimeout(() => {
        fadeToMessage();
    }, 3000);
}

function fadeToMessage() {
    // Fade out celebration
    celebrationOverlay.style.transition = 'opacity 1s ease-out';
    celebrationOverlay.style.opacity = '0';

    setTimeout(() => {
        celebrationOverlay.classList.remove('active');
        celebrationOverlay.style.opacity = '1';

        // Fade out question phase
        questionPhase.classList.remove('active');
        questionPhase.style.display = 'none';

        // Show message phase
        messagePhase.style.display = 'flex';
        messagePhase.classList.add('active');

        // Create timeline photos
        createTimeline();
    }, 1000);
}

// Create Timeline - Load all images from img folder
function createTimeline() {
    const timeline = document.getElementById('timeline');

    // Get all image files from img directory
    const imageFiles = [
        'IMG-20250916-WA0090.jpg',
        'IMG-20250916-WA0094.jpg',
        'IMG-20251021-WA0073.jpg',
        'IMG-20251021-WA0074.jpg',
        'IMG-20251021-WA0076.jpg',
        'IMG-20251223-WA0009.jpg',
        'IMG-20251225-WA0024.jpg',
        'IMG-20251225-WA0026.jpg',
        'IMG-20251225-WA0031.jpg',
        'IMG-20251225-WA0037.jpg'
    ];

    imageFiles.forEach((imageName, index) => {
        const item = document.createElement('div');
        item.className = 'timeline-item';

        const frame = document.createElement('div');
        frame.className = 'timeline-photo-frame';

        const img = document.createElement('img');
        img.className = 'timeline-photo';
        img.src = `/img/${imageName}`;
        img.alt = `Memory ${index + 1}`;

        frame.appendChild(img);
        item.appendChild(frame);
        timeline.appendChild(item);
    });
}

// Initialize
console.log('💖 Valentine Proposal Website Loaded with Professional Confetti!');
