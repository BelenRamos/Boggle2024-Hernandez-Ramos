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
function generateBoard(size, words) {
  const board = document.getElementById('board');
  board.innerHTML = '';
  board.style.gridTemplateColumns = `repeat(${size}, 1fr)`; // Set the number of columns dynamically

  // Define min and max segment sizes (adjust according to your preference)
  const minSegmentSize = Math.floor(words.length * 0.1);
  const maxSegmentSize = Math.floor(words.length * 0.3);

  const letters = getRandomLetters(size * size, words, minSegmentSize, maxSegmentSize);

  console.log(`Generating board with size ${size}x${size} and ${letters.length} letters.`);

  // Initialize an empty array to store the cells
  const cells = [];

  // Create cells for each letter
  letters.forEach(letter => {
    const div = document.createElement('div');
    div.classList.add('letter');
    div.textContent = letter;
    div.addEventListener('click', function() {
      selectCell(this); // Call selectCell() when the cell is clicked
    });
    cells.push(div); // Add the cell to the array
  });

  // Append the cells to the board
  cells.forEach(cell => {
    board.appendChild(cell);
  });

  console.log("Board generated successfully.");

  console.log("Random letters:", letters.join(', ')); // Print random letters for debugging
}

function getRandomLetters(count, words, minSegmentSize, maxSegmentSize) {
  const randomLetters = [];
  const totalWords = words.length;

  // Generate random start index for the segment
  const initSegmento = Math.floor(Math.random() * totalWords);
  
  // Calculate the maximum end index for the segment
  const maxEndIndex = Math.min(initSegmento + Math.floor(Math.random() * (maxSegmentSize - minSegmentSize)), totalWords);

  // Calculate the final end index for the segment
  const finSegmento = Math.min(initSegmento + maxEndIndex, totalWords);

  // Select random words within the segment
  for (let i = initSegmento; i < finSegmento; i++) {
    const randomWord = words[i];
    console.log("Random word:", randomWord); // Print random word for debugging
    const randomLetter = randomWord[Math.floor(Math.random() * randomWord.length)];
    randomLetters.push(randomLetter);
  }

  // Fill remaining count with letters from random words in the remainder of the list
  const remainingCount = count - randomLetters.length;
  if (remainingCount > 0) {
    for (let i = 0; i < remainingCount; i++) {
      const randomWord = words[Math.floor(Math.random() * totalWords)];
      console.log("Random word:", randomWord); // Print random word for debugging
      const randomLetter = randomWord[Math.floor(Math.random() * randomWord.length)];
      randomLetters.push(randomLetter);
    }
  }

  return randomLetters;
}


//Funcion principal
// Event listener for Start Game button
document.getElementById('start').addEventListener('click', async function() {
  const size = parseInt(document.getElementById('board-size').value);
  const timer = parseInt(document.getElementById('timer').value);
  const language = document.getElementById('language').value;

  if (isNaN(timer) || timer < 30 || timer > 300) {
    alert('Por favor ingrese un tiempo válido entre 30 y 300 segundos.');
    return;
  }

  let wordsFile; //Depende si de español o de ingles
  if (language === 'en') {
    wordsFile = 'english-dictionary/palabras.json';
  } else if (language === 'es') {
    wordsFile = 'español-diccionario/palabrasEsp.json';
  } else {
    alert('Idioma no compatible.');
    return;
  }

  // Load words from JSON
  const data = await loadJSON(wordsFile);
  if (data && Array.isArray(data)) {
    const words = data;

    // Extract letters from words
    let letters = [];
    words.forEach(word => {
      if (word.length <= size) {
        letters = letters.concat(word.split(''));
      }
    });

    // If not enough letters, take smaller parts of longer words
    if (letters.length < size * size) {
      words.forEach(word => {
        if (letters.length >= size * size) return;
        if (word.length > size) {
          letters = letters.concat(word.slice(0, size).split(''));
        }
      });
    }

    // Limit letters to the required number
    letters = letters.slice(0, size * size);

    console.log("Letters to be used for board:", letters);

    // Generate the board
    generateBoard(size, letters);

    // Start the timer
    startTimer(timer);
  } else {
    alert('Error loading words from JSON.');
  }
});

// Function to generate a random letter
function generateRandomLetter() {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  return alphabet[Math.floor(Math.random() * alphabet.length)];
}

// Function to start the timer
function startTimer(seconds) {
  let timer = seconds;
  const timerElement = document.getElementById('timer-display');
  const countdown = setInterval(function() {
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

// Function to update the current word in the DOM
function updateCurrentWord() {
  const currentWordElement = document.getElementById('current-word');
  const currentWord = selectedCells.map(cell => cell.textContent).join('');
  currentWordElement.textContent = currentWord;
}

let selectedCells = []; // Stores the cells selected by the user

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
      updateCurrentWord(); // Update the current word in the DOM
    } else {
      alert('¡Solo puedes seleccionar celdas adyacentes!');
    }
  }

  // Check if the current selection forms a valid word
  const currentWord = selectedCells.map(cell => cell.textContent).join('');
  if (isValidWord(currentWord)) {
    updateCurrentWord(); // Update the current word in the DOM
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
    if (Math.abs(row - lastRow) <= 1 && Math.abs(col - lastCol) <= 1) {
      return true;
    } else {
      return false;
    }
  }
}

// Initialize accordions
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

  // Create an element to display the timer
  const controls = document.getElementById('controls');
  const timerDisplay = document.createElement('div');
  timerDisplay.id = 'timer-display';
  timerDisplay.textContent = 'Tiempo restante: 60 segundos';
  controls.appendChild(timerDisplay);

  console.log("Page loaded and accordions initialized.");
});

// Array to store found words
let foundWords = [];

// Function to update the list of found words and their scores
function updateWordList(word) {
  const score = calculateScore(word);
  foundWords.push({ word, score });

  // Update the HTML table displaying found words
  const tableBody = document.querySelector('#words-table tbody');
  const newRow = document.createElement('tr');
  newRow.innerHTML = `<td>${word}</td><td>${score}</td>`;
  tableBody.appendChild(newRow);
}

// Function to calculate the score of a word
function calculateScore(word) {
  const length = word.length;
  if (length === 3 || length === 4) {
    return 1;
  } else if (length === 5) {
    return 2;
  } else if (length === 6) {
    return 3;
  } else if (length === 7) {
    return 5;
  } else if (length >= 8) {
    return 11;
  }
}

// Modify the function that checks if a word is valid to add scoring logic
function isValidWord(word) {
  const length = word.length;
  const isValid = length >= 3 && length <= 16 && !foundWords.some(entry => entry.word === word);
  if (isValid) {
    updateWordList(word); // Add the word to the list if it's valid
  }
  return isValid;
}


// Update the function that checks if the selection is valid to update score
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
    if (Math.abs(row - lastRow) <= 1 && Math.abs(col - lastCol) <= 1) {
      return true;
    } else {
      return false;
    }
  }
}

// Update the selectCell function to handle scoring
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
      updateCurrentWord(); // Update the current word in the DOM
    } else {
      alert('¡Solo puedes seleccionar celdas adyacentes!');
    }
  }

  // Check if the current selection forms a valid word
  const currentWord = selectedCells.map(cell => cell.textContent).join('');
  if (isValidWord(currentWord)) {
    updateCurrentWord(); // Update the current word in the DOM
  }
}

// Update the startTimer function to clear selected cells and update the word list
function startTimer(seconds) {
  selectedCells = [];
  foundWords = []; // Clear found words
  document.getElementById('words-table').querySelector('tbody').innerHTML = ''; // Clear word list
  let timer = seconds;
  const timerElement = document.getElementById('timer-display');
  const countdown = setInterval(function() {
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




/* // Function to shuffle an array
 function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  } 


// Function to generate a random letter
function generateRandomLetter() {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  return alphabet[Math.floor(Math.random() * alphabet.length)];
}

// Función para generar el tablero
function generateBoard(size) {
  const board = document.getElementById('board');
  board.innerHTML = '';
  board.style.gridTemplateColumns = `repeat(${size}, 1fr)`; // Establecer la cantidad de columnas dinámicamente
  for (let i = 0; i < size * size; i++) {
    const letter = generateRandomLetter();
    const div = document.createElement('div');
    div.classList.add('letter');
    div.textContent = letter;
    div.addEventListener('click', function() {
      selectCell(this); // Llama a la función selectCell() cuando se haga clic en la celda
    });
    board.appendChild(div);
  }
}

// Event listener for Start Game button
document.getElementById('start').addEventListener('click', function() {
  const language = document.getElementById('language').value;
  const size = parseInt(document.getElementById('board-size').value);
  const timer = parseInt(document.getElementById('timer').value);

  if (isNaN(timer) || timer < 30 || timer > 300) {
    alert('Por favor ingrese un tiempo válido entre 30 y 300 segundos.');
    return;
  }

  // Generate the board
  generateBoard(size);

  // Start the timer
  startTimer(timer);
});

// Función para iniciar el temporizador
function startTimer(seconds) {
  let timer = seconds;
  const timerElement = document.getElementById('timer-display');
  const countdown = setInterval(function() {
    if (timer === 0) {
      clearInterval(countdown);
      // Aquí puedes agregar lógica para cuando se acabe el tiempo
      alert('¡El tiempo ha terminado!');
    } else {
      timer--;
      // Actualizar el contador de tiempo en tu interfaz de usuario
      timerElement.textContent = `Tiempo restante: ${timer} segundos`;
    }
  }, 1000);
}

// Función para actualizar la palabra actual en el DOM
function updateCurrentWord() {
  const currentWordElement = document.getElementById('current-word');
  const currentWord = selectedCells.map(cell => cell.textContent).join('');
  currentWordElement.textContent = currentWord;
}

let selectedCells = []; // Almacena las celdas seleccionadas por el usuario

// Función para seleccionar una celda del tablero
function selectCell(cell) {
  // Verificar si la celda ya está seleccionada
  if (cell.classList.contains('selected')) {
    cell.classList.remove('selected');
    const index = selectedCells.indexOf(cell);
    if (index !== -1) {
      selectedCells.splice(index, 1);
    }
  } else {
    // Verificar si la celda seleccionada es adyacente a las celdas previamente seleccionadas
    if (isValidSelection(cell)) {
      cell.classList.add('selected');
      selectedCells.push(cell);
      updateCurrentWord(); // Actualizar la palabra actual en el DOM
    } else {
      alert('¡Solo puedes seleccionar celdas adyacentes!');
    }
  }
}

// Función para verificar si la selección es válida
function isValidSelection(cell) {
  // Obtener la posición de la celda seleccionada
  const index = Array.from(cell.parentNode.children).indexOf(cell);
  const size = parseInt(document.getElementById('board-size').value);
  const row = Math.floor(index / size);
  const col = index % size;

  // Verificar si la celda seleccionada es adyacente a las celdas previamente seleccionadas
  if (selectedCells.length === 0) {
    return true; // Permitir la selección si no hay celdas seleccionadas previamente
  } else {
    const lastCell = selectedCells[selectedCells.length - 1];
    const lastIndex = Array.from(lastCell.parentNode.children).indexOf(lastCell);
    const lastRow = Math.floor(lastIndex / size);
    const lastCol = lastIndex % size;

    // Verificar si la celda seleccionada es adyacente a la última celda seleccionada
    if (Math.abs(row - lastRow) <= 1 && Math.abs(col - lastCol) <= 1) {
      return true;
    } else {
      return false;
    }
  }
}

// Inicializar acordeones
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

  // Crear un elemento para mostrar el temporizador
  const controls = document.getElementById('controls');
  const timerDisplay = document.createElement('div');
  timerDisplay.id = 'timer-display';
  timerDisplay.textContent = 'Tiempo restante: 60 segundos';
  controls.appendChild(timerDisplay);
}); */
