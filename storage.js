import { state } from "./state.js";

const KEY = "pinspire_app";

export function loadState() {
  const data = JSON.parse(localStorage.getItem(KEY));
  if (data) {
    Object.assign(state, data);
  }
}

export function saveState() {
  localStorage.setItem(KEY, JSON.stringify(state));
}