const startGame = () => {
  console.log("click");
  toggleMainBannerVisibility(false);
  toggleLoadingVisibility(true);
  toggleGameSectionVisibility(true);

  const difficulty = document.querySelector("#select-difficulty").value;
  const topic = document.querySelector("#select-topic").value;
  getTriviaQuestions(topic, difficulty);
};
const toggleLoadingVisibility = visible => {
  document
    .querySelector(".loading-container")
    .classList.remove(visible ? "hide" : "show");
  document
    .querySelector(".loading-container")
    .classList.add(visible ? "show" : "hide");
};
const toggleMainBannerVisibility = visible => {
  document
    .querySelector(".main-banner")
    .classList.remove(visible ? "hide" : "show");
  document
    .querySelector(".main-banner")
    .classList.add(visible ? "show" : "hide");
};
const toggleGameSectionVisibility = visible => {
  document
    .querySelector(".game-section")
    .classList.remove(visible ? "hide" : "show");
  document
    .querySelector(".game-section")
    .classList.add(visible ? "show" : "hide");
};
const toggleResultsSectionVisibility = visible => {
  document
    .querySelector(".results-section")
    .classList.remove(visible ? "hide" : "show");
  document
    .querySelector(".results-section")
    .classList.add(visible ? "show" : "hide");
};
const tryAgain = () => {
  toggleResultsSectionVisibility(false);
  toggleMainBannerVisibility(true);
};
document.querySelector(".start-game-btn").addEventListener("click", startGame);
document.querySelector(".try-again-btn").addEventListener("click", tryAgain);
const QuestionManager = {
  init: (questions, targetTimer) => {
    console.log("init called");
    QuestionManager.questions = questions;
    QuestionManager.currentQuestion = 0;
    QuestionManager.points = 0;
    QuestionManager.currTimer = 0;
    QuestionManager.targetTimer = targetTimer;
  },
  currentQuestion: 0,
  points: 0,
  currTimer: 0,
  targetTimer: 0,
  questions: [],
  getNextQuestion: () => {
    QuestionManager.currentQuestion += 1;
    if (QuestionManager.currentQuestion >= QuestionManager.questions.length) {
      return null;
    }
    return QuestionManager.questions[QuestionManager.currentQuestion];
  },
  changePointsBy: num => {
    console.log(`changePointsBy called with ${num}`);
    QuestionManager.points += num;
    if (QuestionManager.points < 0) {
      QuestionManager.points = 0;
    }
    return QuestionManager.points;
  },
  changeTimerBy: seconds => {
    QuestionManager.currTimer += seconds;
    return QuestionManager.currTimer;
  }
};

const startTimer = () => {
  const timerInterval = setInterval(() => {
    const timerNode = document.querySelector("#timer-text");
    const newTime = QuestionManager.changeTimerBy(1);
    if (newTime >= QuestionManager.targetTimer) {
      clearInterval(timerInterval);
      handleOutOfTime();
    }
    timerNode.textContent = QuestionManager.targetTimer - newTime;
  }, 1000);
};

const getTriviaQuestions = async (category, difficulty) => {
  const response = await fetch(
    `https://opentdb.com/api.php?amount=10&category=${category}&difficulty=${difficulty}`
  ).then(response => response.json());
  console.log({ response });
  QuestionManager.init(response.results, 60);
  startTimer();
  handleNextQuestion();
  toggleLoadingVisibility(false);
};

const handleNextQuestion = () => {
  console.log(QuestionManager);
  const next = QuestionManager.getNextQuestion();
  if (next === null) {
    handleOutOfTime();
    return;
  }
  const questionHTML = buildQuestion(next);
  unMountQuestion();
  mountQuestion(questionHTML);
};

const buildQuestion = question => {
  const buttons = shuffle([
    { text: question.correct_answer, isCorrect: true },
    ...question.incorrect_answers.map(text => {
      return { text, isCorrect: false };
    })
  ]);
  return `
    <div class="container response-container">
        <hr />
        <nav class="level is-mobile">
            <div class="level-item has-text-centered">
            <div>
                <p class="heading">Category</p>
                <p class="title">${question.category}</p>
            </div>
            </div>
            <div class="level-item has-text-centered">
            <div>
                <p class="heading">Difficulty</p>
                <p class="title">${question.difficulty}</p>
            </div>
            </div>
        </nav>
        <hr />
        <div class="level-data">
            <span class="stats"><i class="fas fa-star ${getPointsClass(
              QuestionManager.points
            )}"></i> <span id="points">${
    QuestionManager.points
  } / 10</span></span>
            <span class="timer"><i class="far fa-clock"></i> <span id="timer-text">${QuestionManager.targetTimer -
              QuestionManager.currTimer}</span></span>
        </div>
        <h2 class="subtitle">
            ${question.question}
        </h2>
        ${buttons.map(button => buildButton(button)).join("")}
    </div>
  `;
};
const buildButton = button => {
  return `
    <a class="button is-medium is-light is-fullwidth is-rounded question-button ${
      button.isCorrect ? "is-correct" : ""
    }">
        ${button.text}
    </a>
    `;
};
const mountQuestion = question => {
  document.querySelector("#question-mount").innerHTML = question;
  bindQuestionHandlers();
};
const unMountQuestion = () => {
  unBindQuestionHandlers();
  const questionNode = document.querySelector("#question-mount");
  while (questionNode.firstChild) {
    questionNode.removeChild(questionNode.firstChild);
  }
};
const handleClick = e => {
  unBindQuestionHandlers();
  const node = e.target;
  const isCorrect = node.className.includes("is-correct");
  node.classList.remove("is-light");
  if (isCorrect) {
    changePointsBy(1);
    node.classList.add("is-primary");
  } else {
    // changePointsBy(-1);
    const correctNode = document.querySelector(".is-correct");
    correctNode.classList.add("is-primary");
    node.classList.add("is-danger");
  }
  setTimeout(() => {
    handleNextQuestion();
  }, 500);
  console.log("click: ", e);
};

const changePointsBy = points => {
  const newPoints = QuestionManager.changePointsBy(points);
  const pointsNode = document.querySelector("#points");
  pointsNode.textContent = `${newPoints} / 10`;
  const starNode = document.querySelector(".fa-star");
  starNode.classList.remove("no-points", "positive-points", "negative-points");
  starNode.classList.add(getPointsClass(newPoints));
};

const getPointsClass = pointsNum => {
  if (pointsNum > 0) {
    return "positive-points";
  } else if (pointsNum === 0) {
    return "no-points";
  } else {
    return "negative-points";
  }
};

const bindQuestionHandlers = () => {
  Array.from(document.querySelectorAll(".question-button")).map(button => {
    button.addEventListener("click", handleClick);
  });
};

const unBindQuestionHandlers = () => {
  Array.from(document.querySelectorAll(".question-button")).map(button => {
    button.removeEventListener("click", handleClick);
  });
};

const handleOutOfTime = () => {
  unBindQuestionHandlers();
  unMountQuestion();

  const resultsTitleNode = document.querySelector(".results-title");
  const resultsSubTitleNode = document.querySelector(".results-subtitle");
  resultsTitleNode.innerHTML = `You Got <span class="points-color">${
    QuestionManager.points
  }</span> Question${QuestionManager.points === 1 ? "" : "s"} Correct`;
  resultsSubTitleNode.textContent = getPointsFeedbackText(
    QuestionManager.points
  );
  toggleGameSectionVisibility(false);
  toggleResultsSectionVisibility(true);
};

const getPointsFeedbackText = points => {
  if (points === 0) {
    return "Yikes..";
  } else if (points < 2) {
    return "You might want to try an easier difficulty.";
  } else if (points < 5) {
    return "Not bad!";
  } else if (points < 10) {
    return "Great job!";
  } else {
    return "Pefect score! Amazing.";
  }
};
/**
 * Randomly shuffle an array
 * https://stackoverflow.com/a/2450976/1293256
 * @param  {Array} array The array to shuffle
 * @return {String}      The first item in the shuffled array
 */
var shuffle = function(array) {
  var currentIndex = array.length;
  var temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};
