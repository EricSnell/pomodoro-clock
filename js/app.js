(() => {
  'use strict'

  const [settings] = Array.from(document.getElementsByClassName('settings'));
  const [timer] = Array.from(document.getElementsByClassName('timer'));
  const breakDisplay = document.getElementById('break-display');
  const sessionDisplay = document.getElementById('session-display');
  const [timerBtn] = Array.from(document.getElementsByClassName('timer-btn'));

  let state = {
    breakLength: 5,
    sessionLength: 25,
    currentCount: null,
    paused: true
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
          updateState({ sessionLength: newState });
          break;
        case 'session-decrease':
          newState = state.sessionLength > 0 ? state.sessionLength - 1 : 0;
          updateState({ sessionLength: newState })
          break;
        default:
          break;
      }

      updateDisplay();
    }
  });



  timerBtn.addEventListener('click', (e) => {
    const newState = !state.paused;
    updateState({ paused: newState });
  });


  function countdown() {
    let start = this.sessionLength;
    console.log(start);
  }

  function updateState(newState = {}) {
    state = Object.assign({}, state, newState);
    console.log(state);
  }

  function updateDisplay() {
    breakDisplay.textContent = state.breakLength;
    sessionDisplay.textContent = state.sessionLength;
    timer.textContent = state.sessionLength;
  }

})()