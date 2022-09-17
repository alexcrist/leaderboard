// HTML elements =======================================================

const formElement = $('form');
const nameInputElement = $('#name-input');
const scoreInputElement = $('#score-input');
const scoresElement = $('.scores');

// Helpers =============================================================

const renderScores = (scores) => {
  scoresElement.html('');
  for (const { name, score } of scores) {
    scoresElement.append(`
      <div class="score-container">
        <div class="name">
          ${name}
        </div>
        <div class="score">
          ${score}
        </div>
      </div>
    `);
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
    fetch(`/addScore?name=${name}&score=${score}`);
  } else {
    alert('Invalid inputs.');
  }
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
});