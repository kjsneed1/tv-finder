const showSelect = document.getElementById("show-select");

function fillDropdown(results) {
    showSelect.innerHTML = "";

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
    const url = "https://api.themoviedb.org/3/tv/popular";

    const options = {
        method: "GET",
        headers: {
            accept: "application/json",
            Authorization: `Bearer ${TMDB_TOKEN}`,
        },
    };

    try {
        const res = await fetch(url, options);

        if (!res.ok) {
            throw new Error(`Request failed with status ${res.status}`);
        }

        const data = await res.json();
        fillDropdown(data.results);
    } catch (error) {
        console.error(error);
    }
}

loadPopularShows();
