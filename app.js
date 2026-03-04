import { loadState, saveState } from "./storage.js";
import { state } from "./state.js";
import { navigate } from "./router.js";

loadState();
navigate("home");

document.getElementById("btn-home").onclick = () => navigate("home");
document.getElementById("btn-saved").onclick = () => navigate("saved");

document.getElementById("upload-btn").onclick = () => {
  const title = document.getElementById("pin-title").value;
  const file = document.getElementById("pin-file").files[0];

  if (!file || !title) return;

  const type = file.type.startsWith("video") ? "video" : "image";

  state.pins.unshift({
    id: Date.now(),
    title,
    type,
    src: URL.createObjectURL(file)
  });

  saveState();
  navigate("home");
};