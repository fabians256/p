import { renderHome, renderSaved } from "./ui.js";
import { state } from "./state.js";

export function navigate(view) {
  state.currentView = view;

  if (view === "home") renderHome();
  if (view === "saved") renderSaved();
}