// ---- GLOBAL STATE ----
let tracks = [];
let currentTrackIndex = 0;
let isPlaying = false;
let isRepeat = false;

const audio = document.getElementById("audioPlayer");

// DOM refs
const playlistEnglish = document.getElementById("playlistEnglish");
const playlistBollywood = document.getElementById("playlistBollywood");
const topSongsGrid = document.getElementById("topSongsGrid");
const bollywoodGrid = document.getElementById("bollywoodGrid");
const libraryGrid = document.getElementById("libraryGrid");
const searchResults = document.getElementById("searchResults");

const npTitle = document.getElementById("npTitle");
const npArtist = document.getElementById("npArtist");
const npCover = document.getElementById("npCover");

const playBtn = document.getElementById("playPauseBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const shuffleBtn = document.getElementById("shuffleBtn");
const repeatBtn = document.getElementById("repeatBtn");

const progressRange = document.getElementById("progressRange");
const currentTimeEl = document.getElementById("currentTime");
const totalTimeEl = document.getElementById("totalTime");
const volumeRange = document.getElementById("volumeRange");

const searchInput = document.getElementById("searchInput");

const homeSection = document.getElementById("homeSection");
const bollywoodSection = document.getElementById("bollywoodSection");
const searchSection = document.getElementById("searchSection");
const librarySection = document.getElementById("librarySection");
const navButtons = document.querySelectorAll(".nav-btn");

// ---- HELPERS ----
function formatTime(seconds) {
    const s = Math.floor(seconds || 0);
    const m = Math.floor(s / 60);
    const r = String(s % 60).padStart(2, "0");
    return `${m}:${r}`;
}

function setCover(el, cover) {
    if (cover) {
        el.style.backgroundImage = `url('${cover}')`;
    } else {
        el.style.backgroundImage = "";
        el.style.backgroundColor = "#333";
    }
}

function getEnglishTracks() {
    return tracks.filter((t) => t.category === "english");
}

function getBollywoodTracks() {
    return tracks.filter((t) => t.category === "bollywood");
}

// ---- RENDER SIDEBAR PLAYLISTS ----
function renderSidebarPlaylists() {
    playlistEnglish.innerHTML = "";
    playlistBollywood.innerHTML = "";

    getEnglishTracks().forEach((track) => {
        const btn = document.createElement("button");
        btn.textContent = `${track.id}. ${track.title} • ${track.artist}`;
        btn.addEventListener("click", () => loadTrackById(track.id, true));
        playlistEnglish.appendChild(btn);
    });

    getBollywoodTracks().forEach((track, index) => {
        const btn = document.createElement("button");
        btn.textContent = `${index + 1}. ${track.title} • ${track.artist}`;
        btn.addEventListener("click", () => loadTrackById(track.id, true));
        playlistBollywood.appendChild(btn);
    });
}

// ---- RENDER MAIN GRIDS ----
function renderTopSongs() {
    topSongsGrid.innerHTML = "";
    getEnglishTracks().forEach((track) => {
        const card = document.createElement("div");
        card.className = "album-card";
        card.innerHTML = `
      <div class="album-img"></div>
      <div class="album-title">${track.title}</div>
      <div class="album-subtitle">${track.artist}</div>
    `;
        const img = card.querySelector(".album-img");
        setCover(img, track.cover);
        card.addEventListener("click", () => loadTrackById(track.id, true));
        topSongsGrid.appendChild(card);
    });
}

function renderBollywood() {
    bollywoodGrid.innerHTML = "";
    getBollywoodTracks().forEach((track) => {
        const card = document.createElement("div");
        card.className = "album-card";
        card.innerHTML = `
      <div class="album-img"></div>
      <div class="album-title">${track.title}</div>
      <div class="album-subtitle">${track.artist}</div>
    `;
        const img = card.querySelector(".album-img");
        setCover(img, track.cover);
        card.addEventListener("click", () => loadTrackById(track.id, true));
        bollywoodGrid.appendChild(card);
    });
}

function renderLibrary() {
    libraryGrid.innerHTML = "";
    tracks.forEach((track) => {
        const card = document.createElement("div");
        card.className = "album-card";
        card.innerHTML = `
      <div class="album-img"></div>
      <div class="album-title">${track.album}</div>
      <div class="album-subtitle">
        ${track.artist} • ${track.category === "bollywood" ? "Bollywood" : "Global"}
      </div>
    `;
        const img = card.querySelector(".album-img");
        setCover(img, track.cover);
        card.addEventListener("click", () => loadTrackById(track.id, true));
        libraryGrid.appendChild(card);
    });
}

function renderSearchResults(query) {
    searchResults.innerHTML = "";
    const q = query.trim().toLowerCase();
    if (!q) return;

    const matches = tracks.filter(
        (t) =>
            t.title.toLowerCase().includes(q) ||
            t.artist.toLowerCase().includes(q) ||
            t.album.toLowerCase().includes(q)
    );

    matches.forEach((track) => {
        const item = document.createElement("div");
        item.className = "search-result";
        item.innerHTML = `
      <div class="search-cover"></div>
      <div style="flex:1;min-width:0;">
        <div style="font-weight:600;font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
          ${track.title}
        </div>
        <div style="font-size:12px;color:#b3b3b3;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
          ${track.artist} • ${track.album}
        </div>
      </div>
    `;
        const coverEl = item.querySelector(".search-cover");
        setCover(coverEl, track.cover);
        item.addEventListener("click", () => loadTrackById(track.id, true));
        searchResults.appendChild(item);
    });
}

// ---- AUDIO CONTROL ----
function loadTrack(index, autoplay = false) {
    if (!tracks.length) return;

    if (index < 0) index = tracks.length - 1;
    if (index >= tracks.length) index = 0;

    currentTrackIndex = index;
    const track = tracks[currentTrackIndex];

    npTitle.textContent = track.title;
    npArtist.textContent = `${track.artist} • ${track.album}`;
    setCover(npCover, track.cover);

    audio.src = track.audioSrc;
    audio.currentTime = 0;

    progressRange.value = 0;
    progressRange.max = track.duration || 100;
    currentTimeEl.textContent = "0:00";
    totalTimeEl.textContent = formatTime(track.duration);

    if (autoplay) {
        playAudio();
    }
}

function loadTrackById(id, autoplay = false) {
    const idx = tracks.findIndex((t) => t.id === id);
    if (idx !== -1) loadTrack(idx, autoplay);
}

function playAudio() {
    audio
        .play()
        .then(() => {
            isPlaying = true;
            playBtn.textContent = "❚❚";
            playBtn.classList.add("playing");
        })
        .catch((err) => console.error("Playback error:", err));
}

function pauseAudio() {
    audio.pause();
    isPlaying = false;
    playBtn.textContent = "▶";
    playBtn.classList.remove("playing");
}

// ---- EVENT LISTENERS ----
playBtn.addEventListener("click", () => {
    if (!tracks.length) return;
    if (audio.paused) playAudio();
    else pauseAudio();
});

prevBtn.addEventListener("click", () => {
    loadTrack(currentTrackIndex - 1, true);
});

nextBtn.addEventListener("click", () => {
    loadTrack(currentTrackIndex + 1, true);
});

shuffleBtn.addEventListener("click", () => {
    if (!tracks.length) return;
    const randomIndex = Math.floor(Math.random() * tracks.length);
    loadTrack(randomIndex, true);
});

repeatBtn.addEventListener("click", () => {
    isRepeat = !isRepeat;
    repeatBtn.style.color = isRepeat ? "#fff" : "#b3b3b3";
});

audio.addEventListener("ended", () => {
    if (isRepeat) loadTrack(currentTrackIndex, true);
    else loadTrack(currentTrackIndex + 1, true);
});

progressRange.addEventListener("input", () => {
    const value = Number(progressRange.value);
    audio.currentTime = value;
    currentTimeEl.textContent = formatTime(value);
});

audio.addEventListener("timeupdate", () => {
    progressRange.value = Math.floor(audio.currentTime);
    currentTimeEl.textContent = formatTime(audio.currentTime);
});

audio.addEventListener("loadedmetadata", () => {
    if (!isNaN(audio.duration)) {
        progressRange.max = Math.floor(audio.duration);
        totalTimeEl.textContent = formatTime(audio.duration);
    }
});

volumeRange.addEventListener("input", () => {
    audio.volume = volumeRange.value / 100;
});

// SEARCH + NAV

searchInput.addEventListener("input", (e) => {
    const value = e.target.value;
    renderSearchResults(value);
    if (value.trim()) switchView("search");
    else switchView("home");
});

function switchView(view) {
    homeSection.classList.add("hidden");
    bollywoodSection.classList.add("hidden");
    searchSection.classList.add("hidden");
    librarySection.classList.add("hidden");

    if (view === "home") homeSection.classList.remove("hidden");
    if (view === "bollywood") bollywoodSection.classList.remove("hidden");
    if (view === "search") searchSection.classList.remove("hidden");
    if (view === "library") librarySection.classList.remove("hidden");

    navButtons.forEach((btn) => {
        const v = btn.getAttribute("data-view");
        btn.classList.toggle("active", v === view);
    });
}

navButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
        const view = btn.getAttribute("data-view");
        switchView(view);
    });
});

// ---- INIT ----
async function init() {
    try {
        const res = await fetch("tracks.json");
        const data = await res.json();
        tracks = data.tracks || [];

        if (!tracks.length) {
            npTitle.textContent = "No tracks found";
            npArtist.textContent = "Check tracks.json";
            return;
        }

        renderSidebarPlaylists();
        renderTopSongs();
        renderBollywood();
        renderLibrary();
        loadTrack(0, false);

        audio.volume = volumeRange.value / 100;
    } catch (err) {
        console.error("Failed to load tracks.json:", err);
        npTitle.textContent = "Error loading tracks.json";
        npArtist.textContent = "Open console for details";
    }
}

init();
