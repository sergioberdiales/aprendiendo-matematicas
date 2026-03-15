const baseFraction = { numerator: 9, denominator: 15 };

const multiplierInput = document.querySelector("#multiplier");
const multiplierValue = document.querySelector("#multiplier-value");
const baseFractionElement = document.querySelector("#base-fraction");
const equivalentFractionElement = document.querySelector("#equivalent-fraction");
const labExplanation = document.querySelector("#lab-explanation");

const roundElement = document.querySelector("#round");
const scoreElement = document.querySelector("#score");
const streakElement = document.querySelector("#streak");
const questionElement = document.querySelector("#question");
const optionsElement = document.querySelector("#options");
const feedbackElement = document.querySelector("#feedback");
const gameHintElement = document.querySelector("#game-hint");
const nextButton = document.querySelector("#next-button");
const restartButton = document.querySelector("#restart-button");

const pool = [
  { numerator: 1, denominator: 2 },
  { numerator: 2, denominator: 3 },
  { numerator: 3, denominator: 4 },
  { numerator: 2, denominator: 5 },
  { numerator: 3, denominator: 5 },
  { numerator: 6, denominator: 8 },
  { numerator: 4, denominator: 7 },
  { numerator: 5, denominator: 6 },
  { numerator: 3, denominator: 8 },
  { numerator: 4, denominator: 9 }
];

const maxRounds = 8;

const state = {
  round: 1,
  score: 0,
  streak: 0,
  currentAnswer: "",
  answered: false
};

function formatFraction(numerator, denominator) {
  return `${numerator}/${denominator}`;
}

function updateLab() {
  const multiplier = Number(multiplierInput.value);
  const nextNumerator = baseFraction.numerator * multiplier;
  const nextDenominator = baseFraction.denominator * multiplier;

  multiplierValue.textContent = String(multiplier);
  baseFractionElement.textContent = formatFraction(
    baseFraction.numerator,
    baseFraction.denominator
  );
  equivalentFractionElement.textContent = formatFraction(
    nextNumerator,
    nextDenominator
  );
  labExplanation.textContent =
    `Hemos multiplicado numerador y denominador por ${multiplier}. ` +
    `Por eso ${formatFraction(baseFraction.numerator, baseFraction.denominator)} ` +
    `y ${formatFraction(nextNumerator, nextDenominator)} valen lo mismo.`;
}

function areEquivalent(a, b) {
  return a.numerator * b.denominator === b.numerator * a.denominator;
}

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function buildWrongOption(correctFraction, usedLabels) {
  let candidate = randomItem(pool);

  while (
    areEquivalent(candidate, correctFraction) ||
    usedLabels.has(formatFraction(candidate.numerator, candidate.denominator))
  ) {
    candidate = randomItem(pool);
  }

  return candidate;
}

function setScoreboard() {
  roundElement.textContent = String(state.round);
  scoreElement.textContent = String(state.score);
  streakElement.textContent = String(state.streak);
}

function endGame() {
  questionElement.textContent = "Servicio completo";
  optionsElement.innerHTML = "";
  gameHintElement.textContent = "Has terminado la ronda de práctica.";
  feedbackElement.textContent =
    `Has terminado con ${state.score} puntos. ` +
    (state.score >= 60
      ? "Has servido todas las porciones casi sin fallar."
      : "Repite una vez más y verás que cada vez lo detectas antes.");
  nextButton.disabled = true;
}

function handleAnswer(button, isCorrect) {
  if (state.answered) {
    return;
  }

  state.answered = true;
  const allButtons = [...document.querySelectorAll(".option-button")];
  allButtons.forEach((item) => {
    item.disabled = true;
    if (item.dataset.correct === "true") {
      item.classList.add("correct");
    }
  });

  if (isCorrect) {
    state.score += 10 + state.streak * 2;
    state.streak += 1;
    button.classList.add("correct");
    feedbackElement.textContent =
      "Muy bien. Cambian los números, pero no la cantidad.";
  } else {
    state.streak = 0;
    state.score = Math.max(0, state.score - 4);
    button.classList.add("wrong");
    feedbackElement.textContent =
      "Casi. Revisa si numerador y denominador se multiplican o dividen por el mismo número.";
  }

  setScoreboard();

  if (state.round === maxRounds) {
    nextButton.textContent = "Ver resultado";
  }

  nextButton.disabled = false;
}

function renderRound() {
  if (state.round > maxRounds) {
    endGame();
    return;
  }

  state.answered = false;
  nextButton.disabled = true;
  feedbackElement.textContent = "";

  const challenge = randomItem(pool);
  const factor = Math.floor(Math.random() * 3) + 2;
  const correct = {
    numerator: challenge.numerator * factor,
    denominator: challenge.denominator * factor
  };
  const usedLabels = new Set([
    formatFraction(correct.numerator, correct.denominator)
  ]);
  const wrongOne = buildWrongOption(correct, usedLabels);
  usedLabels.add(formatFraction(wrongOne.numerator, wrongOne.denominator));
  const wrongTwo = buildWrongOption(correct, usedLabels);

  const options = shuffle([
    correct,
    wrongOne,
    wrongTwo
  ]).map((item) => ({
    label: formatFraction(item.numerator, item.denominator),
    correct: areEquivalent(item, challenge)
  }));

  state.currentAnswer = formatFraction(correct.numerator, correct.denominator);
  questionElement.textContent = formatFraction(
    challenge.numerator,
    challenge.denominator
  );
  gameHintElement.textContent =
    Math.random() > 0.5
      ? "Pista: si multiplicas arriba por 3, abajo también debe ir por 3."
      : "Pista: también puedes pensar en la misma porción de pizza con más cortes.";
  optionsElement.innerHTML = "";

  options.forEach((option) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "option-button";
    button.textContent = option.label;
    button.dataset.correct = option.correct ? "true" : "false";
    button.addEventListener("click", () => handleAnswer(button, option.correct));
    optionsElement.appendChild(button);
  });

  setScoreboard();
}

function resetGame() {
  state.round = 1;
  state.score = 0;
  state.streak = 0;
  state.currentAnswer = "";
  state.answered = false;
  nextButton.textContent = "Siguiente reto";
  renderRound();
}

multiplierInput.addEventListener("input", updateLab);

nextButton.addEventListener("click", () => {
  state.round += 1;
  renderRound();
});

restartButton.addEventListener("click", resetGame);

updateLab();
resetGame();
