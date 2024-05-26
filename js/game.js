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

  // Shuffle the letters to randomize their positions
  shuffleArray(letters);

  console.log(`Generating board with size ${size}x${size} and ${letters.length} letters.`);

  for (let i = 0; i < size * size; i++) {
    const letter = letters[i] || generateRandomLetter(); // Use a random letter if we run out of provided letters
    const div = document.createElement('div');
    div.classList.add('letter');
    div.textContent = letter;
    div.addEventListener('click', function() {
      selectCell(this); // Call selectCell() when the cell is clicked
    });
    board.appendChild(div);
  }

  console.log("Board generated successfully.");
}

// Function to generate a random letter
function generateRandomLetter() {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  return alphabet[Math.floor(Math.random() * alphabet.length)];
}

// Event listener for Start Game button
document.getElementById('start').addEventListener('click', async function() {
  const size = parseInt(document.getElementById('board-size').value);
  const timer = parseInt(document.getElementById('timer').value);

  if (isNaN(timer) || timer < 30 || timer > 300) {
    alert('Por favor ingrese un tiempo válido entre 30 y 300 segundos.');
    return;
  }

  // Load words from JSON
  const data = await loadJSON('english-dictionary/palabras.json');
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
