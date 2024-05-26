// Function to shuffle an array
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
});
