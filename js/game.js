document.addEventListener('DOMContentLoaded', () => {
  // Variables globales
  let playerName = "";
  let boardSize = 4;
  let timerDuration = 60;
  let timerInterval;
  let currentWord = "";

  const playerForm = document.getElementById('player-form');
  const playerInput = document.getElementById('player-name');
  const startButton = document.getElementById('start');
  const timerInput = document.getElementById('timer');
  const boardElement = document.getElementById('board');
  const currentWordElement = document.getElementById('current-word');
  const wordsTableBody = document.getElementById('words-table').querySelector('tbody');
  const modalMessageElement = document.getElementById('modal-message');
  const messageModal = new bootstrap.Modal(document.getElementById('message-modal'));

  // Event listeners
  playerForm.addEventListener('submit', handlePlayerFormSubmit);
  startButton.addEventListener('click', startGame);
  timerInput.addEventListener('change', updateTimer);

  // Functions
  function handlePlayerFormSubmit(event) {
    event.preventDefault();
    playerName = playerInput.value.trim();
    if (playerName.length >= 3) {
      showMessage(`Bienvenido, ${playerName}!`);
    } else {
      showMessage("El nombre debe tener al menos 3 caracteres.");
    }
  }

  function updateTimer() {
    timerDuration = parseInt(timerInput.value);
  }

  function startGame() {
    clearBoard();
    generateBoard(boardSize);
    startTimer(timerDuration);
  }

  function clearBoard() {
    boardElement.innerHTML = '';
    currentWord = '';
    currentWordElement.textContent = '';
  }

  function generateBoard(size) {
    boardElement.style.gridTemplateColumns = `repeat(${size}, 50px)`;
    for (let i = 0; i < size * size; i++) {
      const letterElement = document.createElement('div');
      letterElement.classList.add('letter');
      letterElement.textContent = generateRandomLetter();
      letterElement.addEventListener('click', () => handleLetterClick(letterElement));
      boardElement.appendChild(letterElement);
    }
  }

  function generateRandomLetter() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return letters.charAt(Math.floor(Math.random() * letters.length));
  }

  function handleLetterClick(letterElement) {
    if (letterElement.classList.contains('selectable') || currentWord === '') {
      letterElement.classList.add('selected');
      currentWord += letterElement.textContent;
      currentWordElement.textContent = currentWord;
    }
  }

  function startTimer(duration) {
    let timeRemaining = duration;
    updateTimerDisplay(timeRemaining);
    timerInterval = setInterval(() => {
      timeRemaining--;
      updateTimerDisplay(timeRemaining);
      if (timeRemaining <= 0) {
        clearInterval(timerInterval);
        endGame();
      }
    }, 1000);
  }

  function updateTimerDisplay(time) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    document.getElementById('timer-display').textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  function endGame() {
    showMessage("Tiempo terminado! Gracias por jugar.");
  }

  function showMessage(message) {
    modalMessageElement.textContent = message;
    messageModal.show();
  }
});

