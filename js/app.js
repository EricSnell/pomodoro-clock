(() => {
  'use strict'

  const [settings] = Array.from(document.getElementsByClassName('settings'));
  const [timerDisplay] = Array.from(document.getElementsByClassName('timer'));
  const breakDisplay = document.getElementById('break-display');
  const sessionDisplay = document.getElementById('session-display');
  const [timerBtn] = Array.from(document.getElementsByClassName('timer-btn'));
  const progressBar = document.getElementById('progress');

  let timer;

  let state = {
    breakLength: 5,
    sessionLength: 25,
    currentCount: null,
    paused: true,
    break: false
  }

  init();



  function init() {
    settings.addEventListener('click', adjustTimer);
    timerBtn.addEventListener('click', handleButton);
    updateDisplay();
  }

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
          updateState({ sessionLength: update, currentCount: null })
          break;
        default:
          break;
      }
      updateDisplay();
    }
  }

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

  function togglePaused() {
    const toggle = !state.paused;
    updateState({ paused: toggle });
  }

  function runTimer() {
    timer = setInterval(() => {
      if (state.currentCount > 0) {
        countdown();
      } else {
        playSound();
        updateState({ break: !state.break })
        toggleTimer();
      }
    }, 1000);
  }

  function playSound() {
    const mp3 = 'http://newt.phys.unsw.edu.au/music/bellplates/sounds/bellplate-corner3.mp3';
    const sound = new Audio(mp3);
    sound.play();
  }

  function toggleTimer() {
    const time = state.break ? state.breakLength * 60 : state.sessionLength * 60;
    const display = state.break ? `${state.breakLength}:00` : `${state.sessionLength}:00`;
    updateState({ currentCount: time });
    updateCounterDisplay(display);
  }

  function updateProgressBar() {
    if (!state.break) {
      const progress = (state.currentCount / (state.sessionLength * 60)) * 100;
      progressBar.style.top = `${progress}%`;
    } else {
      const progress = 100 - ((state.currentCount / (state.breakLength * 60)) * 100);
      progressBar.style.top = `${progress}%`;
    }
  }

  function stopTimer() {
    clearInterval(timer);
  }

  function countdown() {
    const date = new Date(null, null);
    const decreaseCount = state.currentCount - 1;
    updateState({ currentCount: decreaseCount });
    date.setSeconds(state.currentCount);
    const hms = toHMS(date)
    updateCounterDisplay(hms);
    updateProgressBar();
  }

  function toHMS(time) {
    return `${time.getHours() > 0 ? time.getHours() + ':' : ''}${time.getMinutes() > 0 ? time.getMinutes() + ':' : '00:'}${time.getSeconds() > 0 ? time.getSeconds() : '00'}`;
  }

  function updateState(newState = {}) {
    state = Object.assign({}, state, newState);
  }

  function updateDisplay() {
    breakDisplay.textContent = state.breakLength;
    sessionDisplay.textContent = state.sessionLength;
    timerDisplay.textContent = state.sessionLength;
  }

  function updateCounterDisplay(time) {
    timerDisplay.textContent = time;
  }

})()