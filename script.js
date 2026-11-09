const showSelect = document.getElementById("show-select");
const showDetails = document.getElementById("show-details");

const requestOptions = {
    method: "GET",
    headers: {
        accept: "application/json",
        Authorization: `Bearer ${TMDB_TOKEN}`,
    },
};

function fillDropdown(results) {
    showSelect.innerHTML = "";
    showSelect.disabled = false;

    const defaultText = document.createElement("option");
    defaultText.textContent = "Select a show";
    defaultText.value = "";
    showSelect.appendChild(defaultText);

    for (let r of results) {
        const newRow = document.createElement("option");
        newRow.value = r.id;
        newRow.textContent = r.name;
        showSelect.appendChild(newRow);
    }
}

async function loadPopularShows() {
    showSelect.innerHTML = "<option>Loading show list...</option>";
    showSelect.disabled = true;

    const url = "https://api.themoviedb.org/3/tv/popular";

    try {
        const res = await fetch(url, requestOptions);

        if (!res.ok) {
            if (res.status === 401) {
                throw new Error(
                    "Auth token rejected! Please update auth information.",
                );
            } else {
                throw new Error(`Request failed with status ${res.status}`);
            }
        }

        const data = await res.json();
        fillDropdown(data.results);
    } catch (error) {
        showDetails.innerHTML = `<p class="error">${error}</p>`;
        console.error(error);
    }
}

loadPopularShows();

function displayDetails(show) {
    showDetails.innerHTML = "";

    const name = document.createElement("h1");
    name.textContent = show.name;

    let image;
    if (show.poster_path) {
        image = document.createElement("img");
        image.src = `https://image.tmdb.org/t/p/w500${show.poster_path}`;
    } else {
        image = document.createElement("div");
        image.textContent = "No poster available.";
    }

    const overview = document.createElement("p");
    overview.textContent = show.overview;

    const genres = document.createElement("h2");
    for (let g in show.genres) {
        genres.textContent += show.genres[g].name;

        if (g < show.genres.length - 1) {
            genres.textContent += ", ";
        }
    }

    const seasons = document.createElement("p");
    seasons.textContent = `Seasons: ${show.number_of_seasons}`;

    const episodes = document.createElement("p");
    episodes.textContent = `Episodes: ${show.number_of_episodes}`;

    const status = document.createElement("p");
    status.textContent = `Status: ${show.status}`;

    showDetails.append(
        name,
        genres,
        image,
        overview,
        seasons,
        episodes,
        status,
    );
}

async function loadShowDetails(id) {
    const url = `https://api.themoviedb.org/3/tv/${id}`;

    showDetails.innerHTML = "Loading details...";

    try {
        const res = await fetch(url, requestOptions);

        if (!res.ok) {
            if (res.status === 401) {
                throw new Error(
                    "Auth token rejected! Please update auth information.",
                );
            } else {
                throw new Error(`Request failed with status ${res.status}`);
            }
        }

        const show = await res.json();
        displayDetails(show);
    } catch (error) {
        showDetails.innerHTML = `<p class="error">${error}</p>`;
        console.error(error);
    }
}

showSelect.addEventListener("change", function () {
    const id = showSelect.value;

    if (id === "") {
        return;
    }

    loadShowDetails(id);
});
