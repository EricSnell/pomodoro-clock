export default function PomodoroCLock() {
  'use strict';

  // Caching timer elements
  const settings = document.querySelector('.settings');
  const timerDisplay = document.querySelector('.timer__button');
  const timerBtn = document.querySelector('.timer__button');
  const breakDisplay = document.querySelector('#break-display-js');
  const sessionDisplay = document.querySelector('#session-display-js');
  const progressBar = document.querySelector('#progress');

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
    if (state.paused && e.target.tagName === 'BUTTON') {
      const target = e.target.id;
      const timer = target.includes('break') ? 'breakLength' : 'sessionLength';
      const newCount = updateCount(target, state[timer]);
      updateState({ [timer]: newCount, currentCount: null });
    }
    updateDisplay();
  }

  function updateCount(btn, currentCount) {
    if (btn.includes('increase')) return increase(currentCount);
    else if (btn.includes('decrease')) return decrease(currentCount);
  }

  function increase(num) {
    return num + 1;
  }

  function decrease(num) {
    return num > 1 ? num - 1 : 1;
  }

  // Pauses/Unpauses timer
  function handleButton(e) {
    e.stopPropagation();
    togglePaused();
    if (state.paused) {
      updateCounterDisplay('&#9646;&#9646;');
      // pause animation setting animation-play-state property to paused
      stopTimer();
    } else {
      if (!state.currentCount) {
        updateState({ currentCount: state.sessionLength * 60 });
      }
      // start animation setting animation-play-state property to running
      //runProgressAnimation();
      updateCounterDisplay(state.currentCount);
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

  function runProgressAnimation() {
    /* spinner 1
    * animation: progress *DURATION* linear forwards
    *
    * spinner 2 (second duration acts as delay)
    * animation: progress *DURATION* linear *DURATION* forwards
    */
  }

  // Counts down the timer and updates the view
  function countdown() {
    const date = new Date(null, null); // Null values sets the hours and minutes to 0
    const decreaseCount = state.currentCount - 1;
    updateState({ currentCount: decreaseCount });
    date.setSeconds(state.currentCount);
    const hms = toHMS(date);
    updateCounterDisplay(hms);
    //updateProgressBar();
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
    timerDisplay.innerHTML = time;
  }
}
