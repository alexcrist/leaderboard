// Options =============================================================

const SECONDS_BEFORE_HIDING_SCORE_INPUTS = 5;

// HTML elements =======================================================

const formElement = $('form');
const nameInputElement = $('#name-input');
const scoreInputElement = $('#score-input');
const scoresElement = $('.scores');

// Helpers =============================================================

const renderScores = (scores) => {
  scoresElement.html('');
  for (const { name, score } of scores) {
    const scoreContainer = $(`
      <div class="score-container">
        <div class="name">
          ${name}
        </div>
        <div class="score">
          ${score}
        </div>
      </div>
    `);
    scoreContainer.on('click', () => {
      const result = window.confirm(`Delete this score of ${name} with ${score} points?`);
      if (result) {
        removeScore(name, score);
      }
    });
    scoresElement.append(scoreContainer);
  }
};

const areInputsValid = (name, score) => {
  return (
    name.length > 0 &&
    score.length > 0 &&
    !isNaN(Number(score))
  );
};

const addScore = () => {
  const name = nameInputElement.val();
  const score = scoreInputElement.val();
  if (areInputsValid(name, score)) {
    fetch(`/addScore?name=${name}&score=${Number(score)}`);
  } else {
    alert('Invalid name or score.');
  }
};

const removeScore = (name, score) => {
  fetch(`/removeScore?name=${name}&score=${score}`);
};

const showError = (message) => {
  $('body').html(`
    <div class="error">
      Error: ${message}
    </div>
  `);
};

const refreshPage = () => {
  setTimeout(() => window.location.reload(), 3000);
};

// Web socket ==========================================================

const socket = io();
socket.on("connect_error", () => {
  console.log('bad');
  showError('could not connect to leaderboard server. Retrying...');
  refreshPage();
});
socket.on('disconnect', () => refreshPage());
socket.on('scores', (data) => renderScores(data));

// Event handlers ======================================================

formElement.on('submit', (event) => {
  event.preventDefault();
  addScore();
  formElement.trigger('reset');
});

// Hide score inputs ===================================================

let secondsInactive = 0;

setInterval(() => {
  secondsInactive++;
  if (secondsInactive > SECONDS_BEFORE_HIDING_SCORE_INPUTS) {
    formElement.css('bottom', '-100px');
  }
}, 1000);

document.addEventListener('mousemove', () => {
  secondsInactive = 0;
  formElement.css('bottom', '0');
});

document.addEventListener('keydown', () => {
  secondsInactive = 0;
  formElement.css('bottom', '0');
});