export default function PomodoroCLock() {
  'use strict';

  // Caching timer elements
  const [settings] = Array.from(document.getElementsByClassName('settings'));
  const [timerDisplay] = Array.from(document.getElementsByClassName('timer'));
  const [timerBtn] = Array.from(document.getElementsByClassName('timer-btn'));
  const breakDisplay = document.getElementById('break-display');
  const sessionDisplay = document.getElementById('session-display');
  const progressBar = document.getElementById('progress');

  // Variable to store setTimeout method (allows us to clear method later)
  let timer;

  // States of timer
  let state = {
    breakLength: 5,
    sessionLength: 25,
    currentCount: null,
    paused: true,
    break: false
  };

  init();

  // Adds event listeners and updates display with initial state
  function init() {
    settings.addEventListener('click', adjustTimer);
    timerBtn.addEventListener('click', handleButton);
    updateDisplay();
  }

  // Handles break and session timer adjustments (only when timer not running)
  function adjustTimer(e) {
    const target = e.target.id;
    if (state.paused) {
      let update;
      switch (target) {
        case 'break-increase':
          update = state.breakLength + 1;
          updateState({ breakLength: update, currentCount: null });
          break;
        case 'break-decrease':
          update = state.breakLength > 1 ? state.breakLength - 1 : 1;
          updateState({ breakLength: update, currentCount: null });
          break;
        case 'session-increase':
          update = state.sessionLength + 1;
          updateState({ sessionLength: update, currentCount: null });
          break;
        case 'session-decrease':
          update = state.sessionLength > 1 ? state.sessionLength - 1 : 1;
          updateState({ sessionLength: update, currentCount: null });
          break;
        default:
          break;
      }
      updateDisplay();
    }
  }

  // Pauses/Unpauses timer
  function handleButton(e) {
    e.stopPropagation();
    togglePaused();
    if (state.paused) {
      stopTimer();
    } else {
      if (!state.currentCount) {
        updateState({ currentCount: state.sessionLength * 60 });
      }
      runTimer();
    }
  }

  // Toggles paused state
  function togglePaused() {
    const toggle = !state.paused;
    updateState({ paused: toggle });
  }

  // Executes the timer countdown, assigning a setInterval to "timer" variable
  // toggling between session and break
  function runTimer() {
    timer = setInterval(() => {
      if (state.currentCount > 0) {
        countdown();
      } else {
        playSound();
        updateState({ break: !state.break });
        toggleTimer();
      }
    }, 1000);
  }

  // Clears the setInterval method that runs the timer
  function stopTimer() {
    clearInterval(timer);
  }

  function playSound() {
    const mp3 =
      'http://newt.phys.unsw.edu.au/music/bellplates/sounds/bellplate-corner3.mp3';
    const sound = new Audio(mp3);
    sound.play();
  }

  // Toggles between break and session timers
  function toggleTimer() {
    const time = state.break
      ? state.breakLength * 60
      : state.sessionLength * 60;
    const display = state.break
      ? `${state.breakLength}:00`
      : `${state.sessionLength}:00`;
    updateState({ currentCount: time });
    updateCounterDisplay(display);
  }

  // Updates the position of the progress bar relative to the current count of the timer
  function updateProgressBar() {
    if (!state.break) {
      const progress = (state.currentCount / (state.sessionLength * 60)) * 100;
      progressBar.style.top = `${progress}%`;
    } else {
      const progress =
        100 - (state.currentCount / (state.breakLength * 60)) * 100;
      progressBar.style.top = `${progress}%`;
    }
  }

  // Counts down the timer and updates the view
  function countdown() {
    const date = new Date(null, null); // Null values sets the hours and minutes to 0
    const decreaseCount = state.currentCount - 1;
    updateState({ currentCount: decreaseCount });
    date.setSeconds(state.currentCount);
    const hms = toHMS(date);
    updateCounterDisplay(hms);
    updateProgressBar();
  }

  // Returns the time in HH:MM:SS format
  function toHMS(time) {
    const hours = time.getHours() > 0 ? `${time.getHours()}:` : '';
    const minutes = time.getMinutes() > 0 ? `${time.getMinutes()}:` : '';
    const seconds =
      time.getSeconds() >= 0 && time.getSeconds() <= 9
        ? `0${time.getSeconds()}`
        : time.getSeconds();
    return `${hours}${minutes}${seconds}`;
  }

  // Helper function to update the state of the app
  function updateState(newState = {}) {
    state = Object.assign({}, state, newState);
  }

  // Updates the display of the timer and session/break lengths
  function updateDisplay() {
    breakDisplay.textContent = state.breakLength;
    sessionDisplay.textContent = state.sessionLength;
    timerDisplay.textContent = state.sessionLength;
  }

  // Updates the display of the timer
  function updateCounterDisplay(time) {
    timerDisplay.textContent = time;
  }
}
