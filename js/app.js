(() => {
  'use strict'

  const [settings] = Array.from(document.getElementsByClassName('settings'));
  const [timerDisplay] = Array.from(document.getElementsByClassName('timer'));
  const breakDisplay = document.getElementById('break-display');
  const sessionDisplay = document.getElementById('session-display');
  const [timerBtn] = Array.from(document.getElementsByClassName('timer-btn'));
  let timer;

  let state = {
    breakLength: 1,
    sessionLength: 3,
    currentCount: null, // use seconds -- sessionlength * 60
    paused: true,
    break: false
  }

  updateDisplay();

  settings.addEventListener('click', (e) => {
    const target = e.target.id;
    if (state.paused) {
      let newState;
      switch (target) {
        case 'break-increase':
          newState = state.breakLength + 1;
          updateState({ breakLength: newState });
          break;
        case 'break-decrease':
          newState = state.breakLength > 0 ? state.breakLength - 1 : 0;
          updateState({ breakLength: newState });
          break;
        case 'session-increase':
          newState = state.sessionLength + 1;
          updateState({ sessionLength: newState, currentCount: null });
          break;
        case 'session-decrease':
          newState = state.sessionLength > 0 ? state.sessionLength - 1 : 0;
          updateState({ sessionLength: newState, currentCount: null })
          break;
        default:
          break;
      }

      updateDisplay();
    }
  });



  timerBtn.addEventListener('click', (e) => {
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
  });

  function togglePaused() {
    const toggle = !state.paused;
    updateState({ paused: toggle });
  }

  function runTimer() {
    timer = setInterval(() => {
      if (state.currentCount > 0) {
        countdown();
      } else {
        toggleTimer();
      }
    }, 1000);
  }

  function toggleTimer() {
    updateState({ break: !state.break })
    const time = state.break ? state.breakLength * 60 : state.sessionLength * 60;
    updateState({ currentCount: time });
  }


  function stopTimer() {
    clearInterval(timer);
  }

  function countdown() {
    const date = new Date(null);
    const decreaseCount = state.currentCount - 1;
    updateState({ currentCount: decreaseCount });
    date.setSeconds(state.currentCount);
    const hhmmss = date.toISOString().substr(11, 8);
    updateCounterDisplay(hhmmss);
  }

  function updateState(newState = {}) {
    state = Object.assign({}, state, newState);
    console.log(state);
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