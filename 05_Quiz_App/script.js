document.addEventListener("DOMContentLoaded", () => {
  // Enhanced questions with categories and difficulty levels
  const questions = [
    {
      question: "What is the capital of France?",
      choices: ["Paris", "London", "Berlin", "Madrid"],
      answer: "Paris",
      explanation: "Paris has been France's capital since 508 CE.",
      category: "Geography",
      difficulty: "Easy",
    },
    {
      question: "Which planet is known as the Red Planet?",
      choices: ["Mars", "Venus", "Jupiter", "Saturn"],
      answer: "Mars",
      explanation: "Mars appears red due to iron oxide (rust) on its surface.",
      category: "Science",
      difficulty: "Easy",
    },
    {
      question: "Who wrote 'Hamlet'?",
      choices: [
        "Charles Dickens",
        "Jane Austen",
        "William Shakespeare",
        "Mark Twain",
      ],
      answer: "William Shakespeare",
      explanation: "Shakespeare wrote Hamlet around 1600-1601.",
      category: "Literature",
      difficulty: "Medium",
    },
    {
      question: "Which gas do plants use for photosynthesis?",
      choices: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Helium"],
      answer: "Carbon Dioxide",
      explanation:
        "Plants convert CO₂ and water into glucose and oxygen during photosynthesis.",
      category: "Science",
      difficulty: "Medium",
    },
  ];

  // DOM Elements
  const elements = {
    welcomeScreen: document.getElementById("welcome-screen"),
    questionContainer: document.getElementById("question-container"),
    resultContainer: document.getElementById("result-container"),
    progressContainer: document.getElementById("progress-container"),
    questionText: document.getElementById("question-text"),
    questionCategory: document.getElementById("question-category"),
    choicesList: document.getElementById("choices-list"),
    nextBtn: document.getElementById("next-btn"),
    scoreDisplay: document.getElementById("score"),
    scorePercentage: document.getElementById("score-percentage"),
    restartBtn: document.getElementById("restart-btn"),
    startBtn: document.getElementById("start-btn"),
    feedback: document.getElementById("feedback"),
    currentQuestionNum: document.getElementById("current-question"),
    totalQuestions: document.getElementById("total-questions"),
    welcomeTotalQuestions: document.getElementById("welcome-total-questions"),
    progressFill: document.getElementById("progress-fill"),
    resultIcon: document.getElementById("result-icon"),
  };

  // Game State
  let state = {
    currentQuestionIndex: 0,
    score: 0,
    answered: false,
  };

  // Initialize the quiz
  function init() {
    updateTotalQuestions();
    setupEventListeners();
  }

  function updateTotalQuestions() {
    const total = questions.length;
    elements.totalQuestions.textContent = total;
    elements.welcomeTotalQuestions.textContent = total;
  }

  function setupEventListeners() {
    elements.startBtn.addEventListener("click", startQuiz);
    elements.nextBtn.addEventListener("click", nextQuestion);
    elements.restartBtn.addEventListener("click", restartQuiz);
  }

  function startQuiz() {
    state = {
      currentQuestionIndex: 0,
      score: 0,
      answered: false,
    };

    elements.welcomeScreen.classList.add("hidden");
    elements.questionContainer.classList.remove("hidden");
    elements.progressContainer.classList.remove("hidden");
    elements.startBtn.classList.add("hidden");
    showQuestion();
    updateProgress();
  }

  function showQuestion() {
    state.answered = false;
    elements.nextBtn.classList.add("hidden");
    elements.feedback.textContent = "";
    elements.feedback.style.opacity = "0";

    const currentQuestion = questions[state.currentQuestionIndex];
    elements.questionText.textContent = currentQuestion.question;
    elements.questionCategory.textContent = currentQuestion.category;

    // Create and display choices
    elements.choicesList.innerHTML = "";
    currentQuestion.choices.forEach((choice, index) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <span class="choice-letter">${String.fromCharCode(65 + index)}</span>
        <span class="choice-text">${choice}</span>
      `;
      li.addEventListener("click", () => handleChoiceSelection(choice, li));
      elements.choicesList.appendChild(li);
    });

    updateProgress();
  }

  function handleChoiceSelection(choice, li) {
    if (state.answered) return;

    state.answered = true;
    const currentQuestion = questions[state.currentQuestionIndex];

    const allChoices = elements.choicesList.querySelectorAll("li");
    allChoices.forEach((choice) => choice.classList.add("disabled"));

    if (choice === currentQuestion.answer) {
      li.classList.add("correct");
      state.score++;
      showFeedback("Correct! " + currentQuestion.explanation, "correct");
    } else {
      li.classList.add("wrong");
      // Highlight correct answer
      allChoices.forEach((choiceEl) => {
        if (
          choiceEl.querySelector(".choice-text").textContent ===
          currentQuestion.answer
        ) {
          choiceEl.classList.add("correct");
        }
      });
      showFeedback("Incorrect. " + currentQuestion.explanation, "wrong");
    }

    elements.nextBtn.classList.remove("hidden");
  }

  function showFeedback(message, type) {
    elements.feedback.textContent = message;
    elements.feedback.className = `feedback-message ${type}`;
    elements.feedback.style.opacity = "1";
  }

  function nextQuestion() {
    state.currentQuestionIndex++;

    if (state.currentQuestionIndex < questions.length) {
      showQuestion();
    } else {
      showResult();
    }
  }

  function updateProgress() {
    const progress =
      ((state.currentQuestionIndex + 1) / questions.length) * 100;
    elements.progressFill.style.width = `${progress}%`;
    elements.currentQuestionNum.textContent = state.currentQuestionIndex + 1;
  }

  function showResult() {
    elements.questionContainer.classList.add("hidden");
    elements.progressContainer.classList.add("hidden");
    elements.resultContainer.classList.remove("hidden");

    const percentage = (state.score / questions.length) * 100;
    elements.scoreDisplay.textContent = `${state.score} out of ${questions.length}`;
    elements.scorePercentage.textContent = `${percentage.toFixed(1)}%`;

    // Update result icon based on score
    if (percentage >= 80) {
      elements.resultIcon.className = "fas fa-trophy";
      elements.resultIcon.style.color = "#FFD700";
    } else if (percentage >= 50) {
      elements.resultIcon.className = "fas fa-medal";
      elements.resultIcon.style.color = "#C0C0C0";
    } else {
      elements.resultIcon.className = "fas fa-award";
      elements.resultIcon.style.color = "#CD7F32";
    }
  }

  function restartQuiz() {
    elements.resultContainer.classList.add("hidden");
    startQuiz();
  }

  // Initialize the quiz
  init();
});
