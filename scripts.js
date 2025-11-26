// Load all tracks from JSON and display top 10

async function loadTracks() {
    try {
        const res = await fetch("tracks.json");
        const data = await res.json();

        const tracks = data.tracks;

        // Filter only English top 10
        const top10 = tracks.filter(t => t.category === "english").slice(0, 10);

        const grid = document.getElementById("topSongsGrid");
        grid.innerHTML = "";

        top10.forEach(track => {
            const card = document.createElement("div");
            card.classList.add("song-card");
            card.dataset.id = track.id;

            card.innerHTML = `
                <div class="cover" style="background-image: url('${track.cover}')"></div>
                <h3 class="song-title">${track.title}</h3>
                <p class="song-artist">${track.artist}</p>
            `;

            // future: click event to play music
            card.addEventListener("click", () => {
                console.log("Selected track:", track.title);
            });

            grid.appendChild(card);
        });

    } catch (error) {
        console.error("Error loading tracks:", error);
    }
}

loadTracks();
