const formElement = $('form');
const nameInputElement = $('#name-input');
const scoreInputElement = $('#score-input');
const scoresElement = $('.scores');

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

// Web socket ==========================================================

const socket = io();
socket.on('scores', (data) => renderScores(data));

// Event handlers ======================================================

formElement.on('submit', (event) => {
  event.preventDefault();
  addScore();
});