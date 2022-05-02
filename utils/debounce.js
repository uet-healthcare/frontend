const timeoutID = {};

export function debounce(key, onExecute, time) {
  clearTimeout(timeoutID[key]);
  timeoutID[key] = setTimeout(onExecute, time);
}
