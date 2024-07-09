// Function to shuffle an array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Function to load JSON file
async function loadJSON(file) {
  try {
    const response = await fetch(file);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error loading JSON:", error);
    return null;
  }
}

// Function to generate the board with letters from words
function generateBoard(size, letters) {
  const board = document.getElementById('board');
  board.innerHTML = '';
  board.style.gridTemplateColumns = `repeat(${size}, 1fr)`; // Set the number of columns dynamically

  letters.forEach(letter => {
    const div = document.createElement('div');
    div.classList.add('letter');
    div.textContent = letter;
    div.addEventListener('click', () => selectCell(div)); // Call selectCell() when the cell is clicked
    board.appendChild(div);
  });

  console.log("Board generated successfully with letters:", letters.join(', '));
}

function getRandomLetters(count, words) {
  const randomLetters = [];
  const totalWords = words.length;

  while (randomLetters.length < count) {
    const randomWord = words[Math.floor(Math.random() * totalWords)];
    const randomLetter = randomWord[Math.floor(Math.random() * randomWord.length)];
    randomLetters.push(randomLetter);
  }

  return randomLetters;
}

// Main function to start the game
document.getElementById('start').addEventListener('click', async function() {
  const size = parseInt(document.getElementById('board-size').value);
  const timer = parseInt(document.getElementById('timer').value);
  const language = document.getElementById('language').value;

  if (isNaN(size) || size < 2 || size > 10) {
    alert('Por favor ingrese un tamaño de tablero válido entre 2 y 10.');
    return;
  }

  if (isNaN(timer) || timer < 30 || timer > 300) {
    alert('Por favor ingrese un tiempo válido entre 30 y 300 segundos.');
    return;
  }

  let wordsFile;
  if (language === 'en') {
    wordsFile = 'english-dictionary/palabrasIngles.json';
  } else if (language === 'es') {
    wordsFile = 'español-diccionario/palabrasEspanol.json';
  } else {
    alert('Idioma no compatible.');
    return;
  }

  const data = await loadJSON(wordsFile);
  if (data && Array.isArray(data)) {
    const letters = getRandomLetters(size * size, data);
    generateBoard(size, letters);

    startTimer(timer);
  } else {
    alert('Error loading words from JSON.');
  }
});

// Function to start the timer
function startTimer(seconds) {
  let timer = seconds;
  const timerElement = document.getElementById('timer-display');
  const countdown = setInterval(() => {
    if (timer === 0) {
      clearInterval(countdown);
      alert('¡El tiempo ha terminado!');
    } else {
      timer--;
      timerElement.textContent = `Tiempo restante: ${timer} segundos`;
    }
  }, 1000);

  console.log("Timer started for", seconds, "seconds.");
}

let selectedCells = [];
let foundWords = [];

// Function to update the current word in the DOM
function updateCurrentWord() {
  const currentWordElement = document.getElementById('current-word');
  const currentWord = selectedCells.map(cell => cell.textContent).join('');
  currentWordElement.textContent = currentWord;
}

// Function to deselect all cells
function deselectAllCells() {
  selectedCells.forEach(cell => cell.classList.remove('selected'));
  selectedCells = [];
  updateCurrentWord();
}

// Function to select a cell on the board
function selectCell(cell) {
  if (cell.classList.contains('selected')) {
    cell.classList.remove('selected');
    const index = selectedCells.indexOf(cell);
    if (index !== -1) {
      selectedCells.splice(index, 1);
    }
  } else {
    if (isValidSelection(cell)) {
      cell.classList.add('selected');
      selectedCells.push(cell);
      updateCurrentWord();
    } else {
      alert('¡Solo puedes seleccionar celdas adyacentes!');
    }
  }

  const currentWord = selectedCells.map(cell => cell.textContent).join('');
  if (isValidWord(currentWord)) {
    updateCurrentWord();
    deselectAllCells(); // Deselect all cells after finding a valid word
  }
}

// Function to check if the cell selection is valid
function isValidSelection(cell) {
  const index = Array.from(cell.parentNode.children).indexOf(cell);
  const size = parseInt(document.getElementById('board-size').value);
  const row = Math.floor(index / size);
  const col = index % size;

  if (selectedCells.length === 0) {
    return true; // Allow selection if no cells are previously selected
  } else {
    const lastCell = selectedCells[selectedCells.length - 1];
    const lastIndex = Array.from(lastCell.parentNode.children).indexOf(lastCell);
    const lastRow = Math.floor(lastIndex / size);
    const lastCol = lastIndex % size;

    // Check if the selected cell is adjacent to the last selected cell
    return Math.abs(row - lastRow) <= 1 && Math.abs(col - lastCol) <= 1;
  }
}

// Function to update the list of found words and their scores
function updateWordList(word) {
  const score = calculateScore(word);
  foundWords.push({ word, score });

  const tableBody = document.querySelector('#words-table tbody');
  const newRow = document.createElement('tr');
  newRow.innerHTML = `<td>${word}</td><td>${score}</td>`;
  tableBody.appendChild(newRow);
}

// Function to calculate the score of a word
function calculateScore(word) {
  const length = word.length;
  if (length === 3 || length === 4) return 1;
  if (length === 5) return 2;
  if (length === 6) return 3;
  if (length === 7) return 5;
  if (length >= 8) return 11;
}

// Function to check if a word is valid
function isValidWord(word) {
  const length = word.length;
  const isValid = length >= 3 && length <= 16 && !foundWords.some(entry => entry.word === word);
  if (isValid) {
    updateWordList(word);
  }
  return isValid;
}

// Initialize accordions and timer display on DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
  var accordions = document.getElementsByClassName('accordion');
  for (var i = 0; i < accordions.length; i++) {
    accordions[i].addEventListener('click', function() {
      this.classList.toggle('active');
      var panel = this.nextElementSibling;
      if (panel.style.maxHeight) {
        panel.style.maxHeight = null;
      } else {
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  }

  const controls = document.getElementById('controls');
  const timerDisplay = document.createElement('div');
  timerDisplay.id = 'timer-display';
  timerDisplay.textContent = 'Tiempo restante: 60 segundos';
  controls.appendChild(timerDisplay);

  console.log("Page loaded and accordions initialized.");
});

