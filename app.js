const grid = document.getElementById('pin-grid');
const modal = document.getElementById('upload-modal');

let pins = JSON.parse(localStorage.getItem('pins')) || [];
let savedPins = JSON.parse(localStorage.getItem('savedPins')) || [];
let profile = JSON.parse(localStorage.getItem('profile')) || {
  name: "Pengguna",
  bio: "",
  avatar: ""
};

/* ================= RENDER ================= */
function render(data) {
  grid.innerHTML = '';

  if (data.length === 0) {
    grid.innerHTML = '<p class="opacity-60">Tidak ada pin</p>';
    return;
  }

  data.forEach(pin => {
    const el = document.createElement('div');
    el.className = 'pin';

    el.innerHTML = `
      <div class="pin-media">
        ${
          pin.type === 'image'
            ? `<img src="${pin.src}" alt="">`
            : `<video src="${pin.src}" muted></video>`
        }
      </div>

      <div class="pin-overlay">
       <button class="save-btn ${savedPins.find(p => p.id === pin.id) ? 'saved' : ''}">
       ${savedPins.find(p => p.id === pin.id) ? 'Tersimpan' : 'Simpan'}
        </button>

        <div class="overlay-actions">
          <button class="icon-btn">🔗</button>
          <button class="icon-btn">⋯</button>
        </div>
      </div>

      <div class="pin-info">
        <div class="pin-title">${pin.title}</div>
        <div class="pin-author">${pin.author || 'Anda'}</div>
      </div>
    `;

    /* SAVE */
    el.querySelector('.save-btn').onclick = (e) => {
      e.stopPropagation();
      savePin(pin);
    };

    /* VIDEO AUTOPLAY ON HOVER */
    const video = el.querySelector('video');
    if (video) {
      el.onmouseenter = () => video.play();
      el.onmouseleave = () => video.pause();
    }

    grid.appendChild(el);
  });
}

function savePin(pin) {
  const exists = savedPins.find(p => p.id === pin.id);

  if (exists) {
    savedPins = savedPins.filter(p => p.id !== pin.id);
    alert('Pin dihapus dari Tersimpan');
  } else {
    savedPins.push(pin);
    alert('Pin disimpan');
  }

  console.log('Saved pins:', savedPins);
}

/* ================= SAVE ================= */
function toggleSave(pin) {
  const exists = savedPins.find(p => p.id === pin.id);
  if (!exists) {
    savedPins.push(pin);
    alert('Disimpan');
  }
}

/* ================= NAV ================= */
document.getElementById('btn-home').onclick = () => render(pins);

document.getElementById('btn-saved').onclick = () => {
  if (savedPins.length === 0) {
    grid.innerHTML = '<p>Belum ada pin tersimpan</p>';
  } else {
    render(savedPins);
  }
};

document.getElementById('btn-create').onclick = () => {
  modal.classList.remove('hidden');
};

document.getElementById('close-modal').onclick = () => {
  modal.classList.add('hidden');
};

/* ================= UPLOAD ================= */
document.getElementById('upload-btn').onclick = () => {
  const title = document.getElementById('pin-title').value;
  const file = document.getElementById('pin-file').files[0];

  if (!file || !title) {
    alert('Lengkapi data');
    return;
  }

  const type = file.type.startsWith('video') ? 'video' : 'image';

  pins.unshift({
    id: Date.now(),
    title,
    type,
    src: URL.createObjectURL(file)
  });

  modal.classList.add('hidden');
  render(pins);
};

function saveToStorage() {
  localStorage.setItem('pins', JSON.stringify(pins));
  localStorage.setItem('savedPins', JSON.stringify(savedPins));
  localStorage.setItem('profile', JSON.stringify(profile));
}

/* ================= SEARCH ================= */
document.getElementById('search').addEventListener('input', e => {
  const q = e.target.value.toLowerCase();
  render(pins.filter(p => p.title.toLowerCase().includes(q)));
});

document.getElementById('btn-profile').onclick = () => {
  grid.innerHTML = `
    <div class="max-w-xl mx-auto bg-white p-6 rounded-2xl shadow">
      <h2 class="text-xl font-bold mb-4">Profil Saya</h2>

      <input id="profile-name" class="input border rounded" value="${profile.name}" placeholder="Nama">
      <textarea id="profile-bio" class="input border rounded" placeholder="Bio">${profile.bio}</textarea>

      <button id="save-profile" class="btn-primary mt-3">Simpan Profil</button>
    </div>
  `;

  document.getElementById('save-profile').onclick = () => {
    profile.name = document.getElementById('profile-name').value;
    profile.bio = document.getElementById('profile-bio').value;

    saveToStorage();
    alert('Profil diperbarui');
  };
};