const introView = document.getElementById("intro");
const dashboardView = document.getElementById("dashboard");
const passcodeFeedback = document.getElementById("passcode-feedback");
const passcodeDots = Array.from(document.querySelectorAll("[data-passcode-dot]"));
const keypadButtons = Array.from(document.querySelectorAll("[data-keypad-value]"));
const keypadDeleteButton = document.getElementById("keypad-delete");
const foodRoundEl = document.getElementById("food-round");
const foodMatchupLabelEl = document.getElementById("food-matchup-label");
const foodHelperTextEl = document.getElementById("food-helper-text");
const foodChoiceAButton = document.getElementById("food-choice-a");
const foodChoiceBButton = document.getElementById("food-choice-b");
const foodTournamentEl = document.getElementById("food-tournament");
const foodWinnerCardEl = document.getElementById("food-winner-card");
const foodWinnerNameEl = document.getElementById("food-winner-name");
const foodResetButton = document.getElementById("food-reset-button");
const triviaListEl = document.getElementById("trivia-list");
const triviaScoreEl = document.getElementById("trivia-score");

const introPasscode = "030126";

const triviaQuestions = [
  {
    question: "When is our anniversary?",
    options: ["March 1st", "April 1st", "March 2nd"],
    correct: "March 1st"
  },
  {
    question: "Who loves the other person more?",
    options: ["Jimmy", "Xenia"],
    correct: "Jimmy"
  },
  {
    question: "How many times have we kissed?",
    options: ["100", "10000", "infinite"],
    correct: "infinite"
  }
];

// Fill in your 16 restaurant names below.
const foodRestaurants = [
  "Chipotle",
  "Cava",
  "Panda Express",
  "Starbucks",
  "Falafel",
  "Northwest",
  "Eastern Gourmet",
  "Subway",
  "Jumbo Jumbo",
  "Shake Shack/Five Guys",
  "Poke/Spot Mini",
  "Legends Halal",
  "Canes",
  "Pho/Ramen",
  "Thai/Viet",
  "Maryland Tandoor"
];

let answeredTrivia = 0;
let triviaScore = 0;
let foodCurrentRound = [];
let foodNextRound = [];
let foodMatchIndex = 0;
let enteredPasscode = "";

function unlockDashboard() {
  introView.classList.remove("active");
  dashboardView.classList.add("active");
}

function handlePasscodeUnlock() {
  if (enteredPasscode === introPasscode) {
    passcodeFeedback.textContent = "";
    unlockDashboard();
    return;
  }

  passcodeFeedback.textContent = "Wrong passcode. Try again, pretty girl.";
  enteredPasscode = "";
  updatePasscodeDots();
}

function updatePasscodeDots() {
  passcodeDots.forEach((dot, index) => {
    dot.classList.toggle("filled", index < enteredPasscode.length);
  });
}

function handleKeypadPress(value) {
  if (enteredPasscode.length >= introPasscode.length) {
    return;
  }

  enteredPasscode += value;
  passcodeFeedback.textContent = "";
  updatePasscodeDots();

  if (enteredPasscode.length === introPasscode.length) {
    handlePasscodeUnlock();
  }
}

function handleKeypadDelete() {
  if (!enteredPasscode.length) {
    return;
  }

  enteredPasscode = enteredPasscode.slice(0, -1);
  passcodeFeedback.textContent = "";
  updatePasscodeDots();
}

function switchTab(target) {
  document.querySelectorAll(".tab-button").forEach((button) => {
    button.classList.toggle("active", button.dataset.target === target);
  });

  document.querySelectorAll(".tab-panel").forEach((panel) => {
    panel.classList.toggle("active", panel.dataset.tab === target);
  });
}

function renderTrivia() {
  triviaListEl.innerHTML = "";

  triviaQuestions.forEach((item, index) => {
    const card = document.createElement("article");
    card.className = "trivia-card";

    const title = document.createElement("h4");
    title.textContent = `${index + 1}. ${item.question}`;

    const optionsWrap = document.createElement("div");
    optionsWrap.className = "trivia-options";

    const feedback = document.createElement("div");
    feedback.className = "trivia-feedback";

    item.options.forEach((option) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "trivia-option";
      button.textContent = option;

      button.addEventListener("click", () => {
        if (card.dataset.answered === "true") {
          return;
        }

        card.dataset.answered = "true";
        answeredTrivia += 1;

        if (option === item.correct) {
          triviaScore += 1;
          button.classList.add("correct");
          feedback.textContent = "Correct!!!";
        } else {
          button.classList.add("wrong");
          feedback.textContent = 'Wrong!!!';
          Array.from(optionsWrap.children).forEach((choiceButton) => {
            if (choiceButton.textContent === item.correct) {
              choiceButton.classList.add("correct");
            }
          });
        }

        Array.from(optionsWrap.children).forEach((choiceButton) => {
          choiceButton.disabled = true;
        });

        updateTriviaScore();
      });

      optionsWrap.appendChild(button);
    });

    card.appendChild(title);
    card.appendChild(optionsWrap);
    card.appendChild(feedback);
    triviaListEl.appendChild(card);
  });
}

function updateTriviaScore() {
  triviaScoreEl.textContent = `${triviaScore} / ${triviaQuestions.length}`;

  if (answeredTrivia === triviaQuestions.length) {
    triviaScoreEl.textContent = `${triviaScore} / ${triviaQuestions.length} complete`;
  }
}

function startFoodTournament() {
  foodCurrentRound = [...foodRestaurants];
  foodNextRound = [];
  foodMatchIndex = 0;
  renderFoodTournament();
}

function getRoundLabel(size) {
  if (size === 16) {
    return "Round of 16";
  }

  if (size === 8) {
    return "Quarterfinals";
  }

  if (size === 4) {
    return "Semifinals";
  }

  if (size === 2) {
    return "Final";
  }

  return `Round of ${size}`;
}

function renderFoodTournament() {
  if (foodCurrentRound.length <= 1) {
    const winner = foodCurrentRound[0] || "";

    foodRoundEl.textContent = "Winner";
    foodWinnerNameEl.textContent = winner;
    foodTournamentEl.classList.add("hidden");
    foodWinnerCardEl.classList.remove("hidden");
    return;
  }

  const currentChoiceA = foodCurrentRound[foodMatchIndex] || "";
  const currentChoiceB = foodCurrentRound[foodMatchIndex + 1] || "";
  const totalMatches = foodCurrentRound.length / 2;
  const currentMatchNumber = foodMatchIndex / 2 + 1;

  foodRoundEl.textContent = getRoundLabel(foodCurrentRound.length);
  foodMatchupLabelEl.textContent = `Match ${currentMatchNumber} of ${totalMatches}`;
  foodHelperTextEl.textContent = "Tap the restaurant you want to keep.";
  foodChoiceAButton.textContent = currentChoiceA;
  foodChoiceBButton.textContent = currentChoiceB;
  foodTournamentEl.classList.remove("hidden");
  foodWinnerCardEl.classList.add("hidden");
}

function chooseFoodWinner(choiceIndex) {
  const selectedRestaurant = foodCurrentRound[choiceIndex];
  foodNextRound.push(selectedRestaurant);
  foodMatchIndex += 2;

  if (foodMatchIndex >= foodCurrentRound.length) {
    foodCurrentRound = [...foodNextRound];
    foodNextRound = [];
    foodMatchIndex = 0;
  }

  renderFoodTournament();
}

function createHeartBurst(x, y, amount = 12) {
  const colors = ["#ea7eae", "#c8a7ff", "#9edfff", "#ff9dc2"];

  for (let index = 0; index < amount; index += 1) {
    const heart = document.createElement("div");
    heart.className = "heart-burst";
    heart.textContent = Math.random() > 0.5 ? "♡" : "♥";
    heart.style.setProperty("--x", `${x + (Math.random() * 90 - 45)}px`);
    heart.style.setProperty("--y", `${y + (Math.random() * 50 - 25)}px`);
    heart.style.setProperty("--color", colors[index % colors.length]);
    document.body.appendChild(heart);

    setTimeout(() => {
      heart.remove();
    }, 1400);
  }
}

document.querySelectorAll(".tab-button").forEach((button) => {
  button.addEventListener("click", () => {
    switchTab(button.dataset.target);
  });
});

foodChoiceAButton.addEventListener("click", () => chooseFoodWinner(foodMatchIndex));
foodChoiceBButton.addEventListener("click", () => chooseFoodWinner(foodMatchIndex + 1));
foodResetButton.addEventListener("click", startFoodTournament);
keypadButtons.forEach((button) => {
  button.addEventListener("click", () => {
    handleKeypadPress(button.dataset.keypadValue);
  });
});
keypadDeleteButton.addEventListener("click", handleKeypadDelete);

renderTrivia();
updateTriviaScore();
startFoodTournament();
updatePasscodeDots();
