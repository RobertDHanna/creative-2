const QuestionManager = {
  init: questions => {
    QuestionManager.questions = questions;
    QuestionManager.currentQuestion = 0;
  },
  currentQuestion: 0,
  questions: [],
  getNextQuestion: () => {
    QuestionManager.currentQuestion += 1;
    if (QuestionManager.currentQuestion >= QuestionManager.questions.length) {
      return null;
    }
    return QuestionManager.questions[QuestionManager.currentQuestion];
  }
};

const startTimer = () => {
  const timerInterval = setInterval(() => {
    //tick
    console.log("tick");
    clearInterval(timerInterval);
  }, 1);
};

const getTriviaQuestions = async (category, difficulty) => {
  const response = await fetch(
    `https://opentdb.com/api.php?amount=10&category=${category}&difficulty=${difficulty}`
  ).then(response => response.json());
  console.log({ response });
  QuestionManager.init(response.results);
  handleNextQuestion();
};

const handleNextQuestion = () => {
  console.log(QuestionManager);
  const next = QuestionManager.getNextQuestion();
  if (next === null) {
    console.log("LAST QUESTION");
    return;
  }
  const questionHTML = buildQuestion(next);
  mountQuestion(questionHTML);
};
getTriviaQuestions(9, "medium");

const buildQuestion = question => {
  const buttons = shuffle([
    { text: question.correct_answer, isCorrect: true },
    ...question.incorrect_answers.map(text => {
      return { text, isCorrect: false };
    })
  ]);
  return `
    <div class="container response-container">
        <div class="level-data">
            <span class="stats">0 Correct</span>
            <span class="timer">Time remaining: 0.00</span>
        </div>
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
        <h2 class="subtitle">
            ${question.question}
        </h2>
        ${buttons.map(button => buildButton(button)).join("")}
    </div>
  `;
};
const buildButton = button => {
  return `
    <a class="button is-medium is-primary is-fullwidth is-rounded question-button ${
      button.isCorrect ? "is-correct" : ""
    }">
        ${button.text}
    </a>
    `;
};
const mountQuestion = question => {
  document.querySelector("#question-mount").innerHTML = question;
};
const handleClick = e => {
  console.log("click: ", e);
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
