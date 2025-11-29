// SEARCH NAVIGATION
document.getElementById("navSearch").addEventListener("click", () => {
    showPage("searchPage", "homePage");
    document.getElementById("bollywoodPage").classList.add("hidden");
});

// SEARCH BAR LOGIC
const searchInput = document.getElementById("searchInput");
const searchGrid = document.getElementById("searchGrid");

searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim().toLowerCase();

    // If empty → stay on Home
    if (query.length === 0) {
        showPage("homePage", "searchPage");
        return;
    }

    // Switch to search page
    showPage("searchPage", "homePage");
    document.getElementById("bollywoodPage").classList.add("hidden");

    const results = allTracks.filter(track =>
        track.title.toLowerCase().includes(query) ||
        track.artist.toLowerCase().includes(query)
    );

    displaySearchResults(results);
});

function displaySearchResults(results) {
    searchGrid.innerHTML = "";

    if (results.length === 0) {
        searchGrid.innerHTML = `<p style="opacity:0.6">No results found.</p>`;
        return;
    }

    results.forEach(track => {
        const card = document.createElement("div");
        card.classList.add("song-card", "fade-in");

        card.innerHTML = `
            <div class="cover" style="background-image: url('${track.cover}')"></div>
            <h3 class="song-title">${track.title}</h3>
            <p class="song-artist">${track.artist}</p>
        `;

        card.addEventListener("click", () => {
            const index = allTracks.indexOf(track);
            playSong(index);
        });

        searchGrid.appendChild(card);
    });
}
