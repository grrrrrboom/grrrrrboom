const textElement = document.getElementById("text");
const inputElement = document.getElementById("input");
const statsElement = document.getElementById("stats");
const resetButton = document.getElementById("reset");
const progressBar = document.getElementById("progress");
const time60Button = document.getElementById("time60");
const time90Button = document.getElementById("time90");
const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");

const words = [
  Ecco le parole senza maiuscole:

"quota", "bravo", "fiore", "campo", "mare", "arido", "isola", "sfera", "burro", "gatto", "ladro", "urgen", "viaggio",
"indio", "sogno", "dente", "zaino", "pioggia", "libertà", "oltre", "gioco", "piano", "amico", "reale", "nuvola", "strada",
"bicicletta", "dardo", "tempo", "lento", "esame", "amore", "orso", "telefono", "cane", "montagna", "vento", "pista", "tigre",
"curiosità", "attore", "bagliore", "ciclo", "città", "erano", "hotel", "mento", "rango", "tenda", "nuova", "canto", "notte",
"albero", "vasto", "festa", "danza", "brava", "cena", "giorno", "libro".

Vuoi che faccia ulteriori modifiche?

];

let currentWords = [];
let currentIndex = 0;
let correctWords = 0;
let startTime = null;
let timerInterval = null;
let timeLimit = 60; // default 60 secondi

function generateWords(n = 30) {
  for (let i = 0; i < n; i++) {
    const word = words[Math.floor(Math.random() * words.length)];
    currentWords.push(word);
  }
}

function renderText() {
  textElement.innerHTML = currentWords.map((word, index) => {
    if (index < currentIndex) {
      return `<span style="color: black;">${word}</span>`;
    }
    if (index === currentIndex) {
      return `<span id="current-word" style="font-weight: bold;">${word}</span>`;
    }
    return `<span style="color: #888;">${word}</span>`;
  }).join(" ");
  updateProgress();
}

function updateStats() {
  const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
  const remaining = timeLimit - elapsedSeconds;
  const wpm = Math.round((correctWords / elapsedSeconds) * 60) || 0;
  
  statsElement.textContent = `Tempo rimasto: ${remaining}s | Parole corrette: ${correctWords} | WPM: ${wpm}`;

  if (remaining <= 0) {
    clearInterval(timerInterval);
    inputElement.disabled = true;
    statsElement.textContent += " - Fine del test!";
    inputElement.value = "";
  }
}

function startTimer() {
  if (timerInterval) return;
  startTime = Date.now();
  timerInterval = setInterval(updateStats, 1000);
}

function updateProgress() {
  const percentage = ((currentIndex / currentWords.length) * 100).toFixed(1);
  progressBar.style.width = `${percentage}%`;
}

function resetTest() {
  clearInterval(timerInterval);
  currentWords = [];
  currentIndex = 0;
  correctWords = 0;
  startTime = null;
  timerInterval = null;
  inputElement.disabled = false;
  inputElement.value = "";
  statsElement.textContent = "Tempo: 0s | Parole corrette: 0 | WPM: 0";
  generateWords(40);
  renderText();
}

inputElement.addEventListener("keydown", (e) => {
  if (!startTime) startTimer();

  const currentWord = currentWords[currentIndex];
  const typedWord = inputElement.value.trim();

  const currentWordSpan = document.getElementById("current-word");
  if (typedWord && currentWord.startsWith(typedWord)) {
    currentWordSpan.classList.remove("incorrect");
    currentWordSpan.classList.add("correct");
  } else {
    currentWordSpan.classList.remove("correct");
    if (typedWord) currentWordSpan.classList.add("incorrect");
    else currentWordSpan.classList.remove("incorrect");
  }

  if (e.key === " ") {
    e.preventDefault();

    if (typedWord === currentWord) {
      correctWords++;
    }

    currentIndex++;
    inputElement.value = "";

    if (currentIndex + 10 > currentWords.length) {
      generateWords(30);
    }

    renderText();
  }
});

// Pulsanti per scegliere la durata
time60Button.addEventListener("click", () => startTest(60));
time90Button.addEventListener("click", () => startTest(90));

function startTest(selectedTime) {
  timeLimit = selectedTime;
  startScreen.style.display = "none";
  gameScreen.style.display = "block";

  resetTest();
}

resetButton.addEventListener("click", () => {
  window.location.reload(); // Reset totale (anche il timer)
});

// Avvio
generateWords(40);
renderText();
//hgfgg
