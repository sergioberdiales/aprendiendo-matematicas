const practiceTypeElement = document.querySelector("#practice-type");
const practiceQuestionElement = document.querySelector("#practice-question");
const practiceVisualElement = document.querySelector("#practice-visual");
const practiceOptionsElement = document.querySelector("#practice-options");
const practiceFeedbackElement = document.querySelector("#practice-feedback");
const practiceTrackerElement = document.querySelector("#practice-tracker");
const practiceNextButton = document.querySelector("#practice-next");
const practiceRestartButton = document.querySelector("#practice-restart");

const roundElement = document.querySelector("#round");
const scoreElement = document.querySelector("#score");
const streakElement = document.querySelector("#streak");
const questionElement = document.querySelector("#question");
const optionsElement = document.querySelector("#options");
const feedbackElement = document.querySelector("#feedback");
const gameHintElement = document.querySelector("#game-hint");
const nextButton = document.querySelector("#next-button");
const restartButton = document.querySelector("#restart-button");

const practiceCards = [
  {
    type: "Amplificación con sentido",
    question: "¿Cuál es una fracción equivalente a 3/4 si duplicas las partes del todo y también las partes que tomas?",
    visual: fractionMarkup(3, 4, "lg"),
    options: [
      {
        label: "6/8",
        correct: true,
        feedback:
          "Sí. Al dividir cada cuarto en dos partes, pasas a octavos y las 3 partes tomadas se convierten en 6."
      },
      {
        label: "3/8",
        correct: false,
        feedback:
          "No. Aquí cambió el denominador, pero el numerador no creció en la misma proporción."
      },
      {
        label: "5/8",
        correct: false,
        feedback:
          "No. Aunque el denominador sea 8, la parte tomada no corresponde a la misma cantidad."
      }
    ]
  },
  {
    type: "Simplificación con sentido",
    question: "¿Qué fracción expresa la misma cantidad que 12/20 pero con números más pequeños?",
    visual: fractionMarkup(12, 20, "lg"),
    options: [
      {
        label: "3/5",
        correct: true,
        feedback:
          "Sí. Dividir 12 y 20 entre 4 no cambia el valor: solo lo escribe de una forma más simple."
      },
      {
        label: "4/6",
        correct: false,
        feedback:
          "No. Esa fracción no sale de dividir numerador y denominador de 12/20 por el mismo número."
      },
      {
        label: "2/4",
        correct: false,
        feedback:
          "No. 2/4 es 1/2, y 12/20 representa 3/5."
      }
    ]
  },
  {
    type: "Detección de error",
    question: "¿Qué cambio NO conserva la misma cantidad?",
    visual:
      '<div class="support-text">Busca el caso en el que no se cambia arriba y abajo en la misma proporción.</div>',
    options: [
      {
        label: "2/3 → 4/6",
        correct: false,
        feedback:
          "Ese cambio sí conserva la cantidad: numerador y denominador se multiplican por 2."
      },
      {
        label: "2/3 → 2/6",
        correct: true,
        feedback:
          "Correcto. Solo cambió el denominador. La forma de dividir cambió, pero las partes tomadas no se ajustaron."
      },
      {
        label: "2/3 → 6/9",
        correct: false,
        feedback:
          "Ese cambio sí conserva la cantidad: arriba y abajo se multiplican por 3."
      }
    ]
  },
  {
    type: "Equivalencia con apoyo visual",
    question: "La barra muestra la mitad del total. ¿Qué fracción representa esa misma cantidad?",
    visual:
      '<div class="bar bar-4"><span class="bar-piece filled"></span><span class="bar-piece filled"></span><span class="bar-piece"></span><span class="bar-piece"></span></div>',
    options: [
      {
        label: "2/4",
        correct: true,
        feedback:
          "Sí. Dos de cuatro partes ocupan la mitad del rectángulo."
      },
      {
        label: "3/4",
        correct: false,
        feedback:
          "No. Tres de cuatro partes ocupan más de la mitad."
      },
      {
        label: "4/6",
        correct: false,
        feedback:
          "No. 4/6 equivale a 2/3, y eso es más que 1/2."
      }
    ]
  },
  {
    type: "Pequeña justificación",
    question: "¿Qué explicación describe mejor por qué 6/8 y 3/4 sí son equivalentes?",
    visual:
      `<div class="equality-row">${fractionMarkup(6, 8)}<span class="equals">=</span>${fractionMarkup(3, 4)}</div>`,
    options: [
      {
        label: "Porque 8 es mayor que 4 y 6 es mayor que 3.",
        correct: false,
        feedback:
          "No basta con que los números sean mayores. Hay que conservar la misma proporción."
      },
      {
        label: "Porque 6 y 8 pueden dividirse entre 2 y quedan 3 y 4, así que la cantidad es la misma escrita de forma más simple.",
        correct: true,
        feedback:
          "Exacto. Al reagrupar las partes de dos en dos, la cantidad representada no cambia."
      },
      {
        label: "Porque al restar 2 arriba y 4 abajo también se obtiene 3/4.",
        correct: false,
        feedback:
          "No. Simplificar no es restar. Se divide numerador y denominador por el mismo número."
      }
    ]
  }
];

const challengePool = [
  { numerator: 1, denominator: 2 },
  { numerator: 2, denominator: 3 },
  { numerator: 3, denominator: 4 },
  { numerator: 2, denominator: 5 },
  { numerator: 3, denominator: 5 },
  { numerator: 4, denominator: 7 },
  { numerator: 5, denominator: 6 },
  { numerator: 3, denominator: 8 }
];

const maxRounds = 6;

const practiceState = {
  index: 0,
  answered: false
};

const gameState = {
  round: 1,
  score: 0,
  streak: 0,
  answered: false
};

function fractionMarkup(numerator, denominator, size = "") {
  const sizeClass = size ? ` fraction--${size}` : "";
  return `
    <span class="fraction${sizeClass}" aria-label="${numerator} partido por ${denominator}">
      <span class="fraction__top">${numerator}</span>
      <span class="fraction__bottom">${denominator}</span>
    </span>
  `;
}

function formatFraction(numerator, denominator) {
  return `${numerator}/${denominator}`;
}

function areEquivalent(a, b) {
  return a.numerator * b.denominator === b.numerator * a.denominator;
}

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function renderPracticeTracker() {
  practiceTrackerElement.innerHTML = "";

  practiceCards.forEach((_, index) => {
    const dot = document.createElement("span");
    dot.className = "practice-dot";

    if (index < practiceState.index) {
      dot.classList.add("done");
    } else if (index === practiceState.index) {
      dot.classList.add("active");
    }

    practiceTrackerElement.appendChild(dot);
  });
}

function handlePracticeAnswer(button, option) {
  if (practiceState.answered) {
    return;
  }

  practiceState.answered = true;

  const allButtons = [...document.querySelectorAll(".practice-option")];
  allButtons.forEach((item) => {
    item.disabled = true;
    if (item.dataset.correct === "true") {
      item.classList.add("correct");
    }
  });

  if (option.correct) {
    button.classList.add("correct");
  } else {
    button.classList.add("wrong");
  }

  practiceFeedbackElement.textContent = option.feedback;
  practiceNextButton.disabled = false;
  practiceNextButton.textContent =
    practiceState.index === practiceCards.length - 1
      ? "Ver de nuevo"
      : "Siguiente bloque";
}

function renderPractice() {
  const card = practiceCards[practiceState.index];
  practiceState.answered = false;
  practiceNextButton.disabled = true;
  practiceFeedbackElement.textContent = "";

  practiceTypeElement.textContent = card.type;
  practiceQuestionElement.textContent = card.question;
  practiceVisualElement.innerHTML = card.visual;
  practiceOptionsElement.innerHTML = "";

  shuffle(card.options).forEach((option) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "practice-option";
    button.textContent = option.label;
    button.dataset.correct = option.correct ? "true" : "false";
    button.addEventListener("click", () => handlePracticeAnswer(button, option));
    practiceOptionsElement.appendChild(button);
  });

  renderPracticeTracker();
}

function nextPractice() {
  practiceState.index =
    practiceState.index === practiceCards.length - 1 ? 0 : practiceState.index + 1;
  renderPractice();
}

function resetPractice() {
  practiceState.index = 0;
  renderPractice();
}

function buildWrongOptions(challenge, factor) {
  return [
    {
      numerator: challenge.numerator * factor,
      denominator: challenge.denominator,
      reason:
        "No conserva la cantidad: cambió el numerador, pero el denominador no cambió igual."
    },
    {
      numerator: challenge.numerator,
      denominator: challenge.denominator * factor,
      reason:
        "No conserva la cantidad: el todo se dividió en más partes, pero las partes tomadas no aumentaron en la misma proporción."
    }
  ];
}

function setScoreboard() {
  roundElement.textContent = String(gameState.round);
  scoreElement.textContent = String(gameState.score);
  streakElement.textContent = String(gameState.streak);
}

function renderChallengeFraction(numerator, denominator) {
  questionElement.innerHTML = fractionMarkup(numerator, denominator, "lg");
}

function endGame() {
  renderChallengeFraction(1, 1);
  optionsElement.innerHTML = "";
  gameHintElement.textContent =
    "Has completado la misión. Puedes empezar otra con ejemplos nuevos.";
  feedbackElement.textContent =
    gameState.score >= 42
      ? "Muy bien. Has detectado las equivalencias pensando en la cantidad, no solo en los números."
      : "Buen trabajo. Repetir con otros ejemplos ayuda a fijar la idea de misma cantidad.";
  nextButton.disabled = true;
}

function handleGameAnswer(button, option, challenge, factor) {
  if (gameState.answered) {
    return;
  }

  gameState.answered = true;
  const allButtons = [...document.querySelectorAll(".option-button")];
  allButtons.forEach((item) => {
    item.disabled = true;
    if (item.dataset.correct === "true") {
      item.classList.add("correct");
    }
  });

  if (option.correct) {
    gameState.score += 10 + gameState.streak * 2;
    gameState.streak += 1;
    button.classList.add("correct");
    feedbackElement.textContent =
      `${formatFraction(challenge.numerator, challenge.denominator)} y ` +
      `${option.label} representan la misma cantidad porque arriba y abajo se han multiplicado por ${factor}.`;
  } else {
    gameState.streak = 0;
    gameState.score = Math.max(0, gameState.score - 2);
    button.classList.add("wrong");
    feedbackElement.textContent = option.reason;
  }

  if (gameState.round === maxRounds) {
    nextButton.textContent = "Ver resultado";
  }

  nextButton.disabled = false;
  setScoreboard();
}

function renderRound() {
  if (gameState.round > maxRounds) {
    endGame();
    return;
  }

  gameState.answered = false;
  nextButton.disabled = true;
  feedbackElement.textContent = "";

  const challenge = randomItem(challengePool);
  const factor = Math.floor(Math.random() * 3) + 2;
  const correct = {
    numerator: challenge.numerator * factor,
    denominator: challenge.denominator * factor,
    correct: true,
    label: formatFraction(
      challenge.numerator * factor,
      challenge.denominator * factor
    ),
    reason: ""
  };

  const wrongOptions = buildWrongOptions(challenge, factor).map((item) => ({
    ...item,
    correct: false,
    label: formatFraction(item.numerator, item.denominator)
  }));

  const options = shuffle([correct, ...wrongOptions]);

  renderChallengeFraction(challenge.numerator, challenge.denominator);
  gameHintElement.textContent =
    "Pista: si el todo se divide en más partes, también deben aumentar las partes que se toman.";
  optionsElement.innerHTML = "";

  options.forEach((option) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "option-button";
    button.textContent = option.label;
    button.dataset.correct = option.correct ? "true" : "false";
    button.addEventListener("click", () =>
      handleGameAnswer(button, option, challenge, factor)
    );
    optionsElement.appendChild(button);
  });

  setScoreboard();
}

function resetGame() {
  gameState.round = 1;
  gameState.score = 0;
  gameState.streak = 0;
  gameState.answered = false;
  nextButton.textContent = "Siguiente reto";
  renderRound();
}

practiceNextButton.addEventListener("click", nextPractice);
practiceRestartButton.addEventListener("click", resetPractice);

nextButton.addEventListener("click", () => {
  gameState.round += 1;
  renderRound();
});

restartButton.addEventListener("click", resetGame);

renderPractice();
resetGame();
