const numberInput = document.getElementById("numberInput");
const guessButton = document.getElementById("guessButton");
const playAgainButton = document.getElementById("playAgainButton");
const messageDisplay = document.getElementById("message");
const attemptsDisplay = document.getElementById("attempts");

let randomNumber;
let attempts;
const maxAttempts = 7;

function initializeGame() {
  randomNumber = Math.floor(Math.random() * 100) + 1;
  attempts = 0;
  messageDisplay.textContent = "";
  attemptsDisplay.textContent = "Attempts: 0 / " + maxAttempts;
  numberInput.value = "";
  numberInput.disabled = false;
  guessButton.disabled = false;
  guessButton.classList.remove("hidden");
  playAgainButton.classList.add("hidden");
}

function handleGuess() {
  const guess = parseInt(numberInput.value);

  if (isNaN(guess) || guess < 1 || guess > 100) {
    messageDisplay.textContent =
      "Please enter a valid number between 1 and 100.";
    messageDisplay.style.color = "#dc2626";
    return;
  }

  attempts++;
  attemptsDisplay.textContent = `Attempts: ${attempts} / ${maxAttempts}`;

  if (guess === randomNumber) {
    messageDisplay.textContent = `Treasure Found!`;
    messageDisplay.style.color = "#16a34a";
    endGame(true);
  } else if (guess < randomNumber) {
    messageDisplay.textContent = "Too Far Behind.";
    messageDisplay.style.color = "#ca8a04";
  } else {
    messageDisplay.textContent = "Too Far Ahead.";
    messageDisplay.style.color = "#ca8a04";
  }

  if (attempts >= maxAttempts && guess !== randomNumber) {
    messageDisplay.textContent = `❌ Game Over! The number was ${randomNumber}.`;
    messageDisplay.style.color = "#dc2626";
    endGame(false);
  }
}

function endGame(won) {
  numberInput.disabled = true;
  guessButton.disabled = true;
  guessButton.classList.add("hidden");
  playAgainButton.classList.remove("hidden");
}

guessButton.addEventListener("click", handleGuess);
playAgainButton.addEventListener("click", initializeGame);

numberInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    if (!numberInput.disabled) {
      handleGuess();
    }
  }
});
window.onload = initializeGame;
