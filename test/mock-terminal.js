'use strict';

function createMockTerminal() {

  let lines = [];
  let linePos = 0;
  let eventListeners = {};

  function term(str) {
    if (linePos < 1) {
      throw new Error('Should not write to pos < 1');
    }
    lines[linePos - 1] = (lines[linePos - 1] || '') + str;
    return term;
  }

  term.moveTo = (col, row) => {
    if (row < 1) {
      throw new Error('Should not move to row < 1');
    }
    linePos = row;
  };

  term.eraseLine = () => {
    lines[linePos - 1] = '';
  };

  const controlFncs = ['fullscreen', 'grabInput', 'clear', 'hideCursor'];
  controlFncs.forEach((funcName) => {
    term[funcName] = sinon.spy();
  });

  term.on = (evt, listener) => {
    let listeners = eventListeners[evt];
    if (!listeners) {
      listeners = [];
      eventListeners[evt] = listeners;
    }
    listeners.push(listener);
  };

  term.emit = (evt, ...args) => {
    let listeners = eventListeners[evt] || [];
    listeners.forEach((fnc) => fnc(...args));
  };

  term.getRendered = () => {
    return lines;
  };

  term.getCursorPos = () => linePos;

  term.reset = () => {
    linePos = 0;
    lines = [];
    controlFncs.forEach((fnc) => {
      term[fnc].reset();
    });
  };

  term.height = 50;

  return term;

}

module.exports = {
  create: createMockTerminal
};
