export default function PomodoroCLock() {
  'use strict';

  // Caching timer elements
  const settings = document.querySelector('.settings');
  const timerDisplay = document.querySelector('.timer__button');
  const timerBtn = document.querySelector('.timer__button');
  const breakDisplay = document.querySelector('#break-display-js');
  const sessionDisplay = document.querySelector('#session-display-js');
  const spinner1 = document.querySelector('.timer__progress--1');
  const spinner2 = document.querySelector('.timer__progress--2');

  // Variable to store setTimeout method (allows us to clear method later)
  let timer;

  // States of timer
  let state = {
    breakLength: 0.1,
    sessionLength: 0.1,
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
      stopTimer();
      pauseAnimation([spinner1, spinner2]);
    } else {
      if (!state.currentCount) {
        updateState({ currentCount: state.sessionLength * 60 });
      }
      updateCounterDisplay(formatTime(state.currentCount));
      runTimer();
      runTimerAnimation(state.currentCount);
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
        runTimerAnimation(state.currentCount);
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

  function runTimerAnimation(timer) {
    const color = state.break ? '#69ff69' : '#fc6c6c';
    //const timer = state.break ? state.breakLength : state.sessionLength;
    const duration = `${timer / 2}s`;
    resetAnimation([spinner1, spinner2]);
    setAnimation(spinner1, { color, duration });
    spinner1.addEventListener('animationend', () => {
      spinner2.style.zIndex = '5';
      setAnimation(spinner2, { color, duration });
    });
  }

  function setAnimation(elm, props) {
    elm.style.background = props.color;
    elm.style.animation = `progress ${props.duration} linear forwards running`;
  }

  function resetAnimation(elms) {
    spinner2.style.zIndex = '1';
    spinner2.style.background = '#888';
    elms.forEach(elm => {
      elm.style.animation = 'none';
      void elm.offsetWidth;
    });
  }

  function pauseAnimation(elms) {
    console.log('toggling..', 'paused?', state.paused);
    const toggle = state.paused ? 'paused' : 'running';
    elms.forEach(elm => (elm.style.animationPlayState = toggle));
  }

  // Counts down the timer and updates the view
  function countdown() {
    const decreaseCount = state.currentCount - 1;
    updateState({ currentCount: decreaseCount });
    const hms = formatTime(state.currentCount);
    updateCounterDisplay(hms);
  }

  function formatTime(seconds) {
    const date = new Date(null, null); // Null values sets the hours and minutes to 0
    date.setSeconds(seconds);
    const hms = toHMS(date);
    return hms;
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
