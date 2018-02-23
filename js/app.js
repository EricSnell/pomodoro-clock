(() => {
  'use strict'

  const [settings] = Array.from(document.getElementsByClassName('settings'));
  const breakDisplay = document.getElementById('break-display');
  const sessionDisplay = document.getElementById('session-display');

  let state = {
    breakLength: 5,
    sessionLength: 25
  }

  settings.addEventListener('click', (e) => {
    const target = e.target.id;
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
  })





  function updateState(newState = {}) {
    state = Object.assign({}, state, newState);
    console.log(state);
  }

})()