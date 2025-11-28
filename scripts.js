let allTracks = [];
let currentIndex = 0;

const audio = new Audio();

// Player elements
const playerCover = document.getElementById("player-cover");
const playerTitle = document.getElementById("player-title");
const playerArtist = document.getElementById("player-artist");
const playPauseBtn = document.getElementById("playPauseBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const seekBar = document.getElementById("seekBar");
const volumeBar = document.getElementById("volumeBar");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");

volumeBar.value = 0.6;
audio.volume = 0.6;

async function loadTracks() {
    const res = await fetch("tracks.json");
    const data = await res.json();
    allTracks = data.tracks;

    const top10 = allTracks.filter(t => t.category === "english").slice(0, 10);
    const grid = document.getElementById("topSongsGrid");

    grid.innerHTML = "";

    top10.forEach((track, idx) => {
        const card = document.createElement("div");
        card.classList.add("song-card");

        card.innerHTML = `
            <div class="cover" style="background-image: url('${track.cover}')"></div>
            <h3 class="song-title">${track.title}</h3>
            <p class="song-artist">${track.artist}</p>
        `;

        card.addEventListener("click", () => {
            playSong(idx);
        });

        grid.appendChild(card);
    });
}

function playSong(index) {
    currentIndex = index;
    const track = allTracks.filter(t => t.category === "english")[index];

    if (!track) return;

    audio.src = track.audioSrc;
    audio.play();

    playerCover.src = track.cover;
    playerTitle.textContent = track.title;
    playerArtist.textContent = track.artist;

    playPauseBtn.textContent = "⏸";
}

playPauseBtn.addEventListener("click", () => {
    if (audio.paused) {
        audio.play();
        playPauseBtn.textContent = "⏸";
    } else {
        audio.pause();
        playPauseBtn.textContent = "▶";
    }
});

// Next / Prev

nextBtn.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % 10;
    playSong(currentIndex);
});

prevBtn.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + 10) % 10;
    playSong(currentIndex);
});

// Progress Bar

audio.addEventListener("timeupdate", () => {
    seekBar.value = (audio.currentTime / audio.duration) * 100;

    currentTimeEl.textContent = formatTime(audio.currentTime);
    durationEl.textContent = formatTime(audio.duration);
});

// Seek

seekBar.addEventListener("input", () => {
    audio.currentTime = (seekBar.value / 100) * audio.duration;
});

// Volume

volumeBar.addEventListener("input", () => {
    audio.volume = volumeBar.value;
});

// Format time helper
function formatTime(sec) {
    if (isNaN(sec)) return "0:00";
    let m = Math.floor(sec / 60);
    let s = Math.floor(sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
}

loadTracks();

// ------------------------------
// Animation Helpers
// ------------------------------
function fadeInElement(el) {
    el.classList.add("fade-in");
    setTimeout(() => el.classList.remove("fade-in"), 400);
}

function showPage(idToShow, idToHide) {
    const showEl = document.getElementById(idToShow);
    const hideEl = document.getElementById(idToHide);

    hideEl.classList.add("hidden");
    showEl.classList.remove("hidden");

    showEl.classList.add("page-enter");

    requestAnimationFrame(() => {
        showEl.classList.add("page-enter-active");
    });

    setTimeout(() => {
        showEl.classList.remove("page-enter", "page-enter-active");
    }, 450);
}

// ------------------------------
// Navigation
// ------------------------------
document.getElementById("navHome").addEventListener("click", () => {
    showPage("homePage", "bollywoodPage");
});

document.getElementById("navBollywood").addEventListener("click", () => {
    showPage("bollywoodPage", "homePage");
});

// ------------------------------
// Load ALL tracks (English + Bollywood)
// ------------------------------
async function loadTracks() {
    const res = await fetch("tracks.json");
    const data = await res.json();
    allTracks = data.tracks;

    loadTop10();
    loadBollywood();
}

// ------------------------------
// Load English Top 10
// ------------------------------
function loadTop10() {
    const top10 = allTracks.filter(t => t.category === "english").slice(0, 10);
    const grid = document.getElementById("topSongsGrid");

    grid.innerHTML = "";

    top10.forEach((track, index) => {
        const card = document.createElement("div");
        card.classList.add("song-card", "fade-in");

        card.innerHTML = `
            <div class="cover" style="background-image: url('${track.cover}')"></div>
            <h3 class="song-title">${track.title}</h3>
            <p class="song-artist">${track.artist}</p>
        `;

        card.addEventListener("click", () => {
            playSong(index);
        });

        grid.appendChild(card);
    });
}

// ------------------------------
// Load Bollywood 20 Songs
// ------------------------------
function loadBollywood() {
    const bolly = allTracks.filter(t => t.category === "bollywood");
    const grid = document.getElementById("bollywoodGrid");

    grid.innerHTML = "";

    bolly.forEach((track, index) => {
        const card = document.createElement("div");
        card.classList.add("song-card", "fade-in");

        card.innerHTML = `
            <div class="cover" style="background-image: url('${track.cover}')"></div>
            <h3 class="song-title">${track.title}</h3>
            <p class="song-artist">${track.artist}</p>
        `;

        card.addEventListener("click", () => {
            const realIndex = allTracks.indexOf(track);
            playSong(realIndex);
        });

        grid.appendChild(card);
    });
}

// ------------------------------
// Enhance player animation
// ------------------------------
function animatePlayer() {
    playerCover.classList.add("fade-in");
    playerTitle.classList.add("fade-in");
    playerArtist.classList.add("fade-in");

    setTimeout(() => {
        playerCover.classList.remove("fade-in");
        playerTitle.classList.remove("fade-in");
        playerArtist.classList.remove("fade-in");
    }, 400);
}

// Modify playSong()
const originalPlaySong = playSong;
playSong = function (index) {
    originalPlaySong(index);
    animatePlayer();
};

loadTracks();
