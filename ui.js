import { state } from "./state.js";
import { saveState } from "./storage.js";

const grid = document.getElementById("pin-grid");

export function renderHome() {
  renderPins(state.pins);
}

export function renderSaved() {
  renderPins(state.savedPins);
}

function renderPins(data) {
  grid.innerHTML = "";

  if (!data.length) {
    grid.innerHTML = `<p class="opacity-60">Tidak ada pin</p>`;
    return;
  }

  data.forEach(pin => {
    const el = document.createElement("div");
    el.className = "pin";

    const isSaved = state.savedPins.find(p => p.id === pin.id);

    el.innerHTML = `
      <div class="pin-media">
        ${
          pin.type === "image"
            ? `<img src="${pin.src}" />`
            : `<video src="${pin.src}" muted></video>`
        }
      </div>

      <div class="pin-overlay">
        <button class="save-btn ${isSaved ? "saved" : ""}">
          ${isSaved ? "Tersimpan" : "Simpan"}
        </button>
      </div>

      <div class="pin-info">
        <div class="pin-title">${pin.title}</div>
        <div class="pin-author">Anda</div>
      </div>
    `;

    el.querySelector(".save-btn").onclick = (e) => {
      e.stopPropagation();
      toggleSave(pin);
    };

    grid.appendChild(el);
  });
}

function toggleSave(pin) {
  const exists = state.savedPins.find(p => p.id === pin.id);

  if (exists) {
    state.savedPins = state.savedPins.filter(p => p.id !== pin.id);
  } else {
    state.savedPins.push(pin);
  }

  saveState();
  renderHome();
}