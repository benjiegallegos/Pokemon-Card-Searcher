// Light mode & Dark mode
document.addEventListener("DOMContentLoaded", function () {
    const themeToggle = document.getElementById("theme-toggle");
    const body = document.body;

    // Load saved theme from localStorage
    if (localStorage.getItem("theme") === "dark") {
        body.classList.add("bg-dark", "text-white");
    }

    themeToggle.addEventListener("click", function () {
        body.classList.toggle("bg-dark");
        body.classList.toggle("text-white");

        // Save theme preference
        if (body.classList.contains("bg-dark")) {
            localStorage.setItem("theme", "dark");
        } else {
            localStorage.setItem("theme", "light");
        }
    });
});


// Define colors for Pokémon types
const typeColors = {
    bug: "#A8B820",
    dragon: "#7038F8",
    electric: "#F8D030",
    fighting: "#C03028",
    fire: "#F08030",
    flying: "#A890F0",
    ghost: "#705898",
    grass: "#78C850",
    ground: "#E0C068",
    ice: "#98D8D8",
    normal: "#A8A878",
    poison: "#A040A0",
    psychic: "#F85888",
    rock: "#B8A038",
    water: "#6890F0",
};

// Fetch and filter Pokémon
function searchPokemon() {
    const searchQuery = document.getElementById("pokemon-search").value.toLowerCase();
    const selectedTypes = Array.from(document.querySelectorAll('input[name="type"]:checked'))
                              .map(checkbox => checkbox.value.toLowerCase());
    const pokemonList = document.getElementById("pokemon-list");

    // Clear previous results
    pokemonList.innerHTML = "";

    fetch("https://pokeapi.co/api/v2/pokemon?limit=151")
        .then(response => response.json())
        .then(data => {
            data.results.forEach(pokemon => {
                fetch(pokemon.url)
                    .then(response => response.json())
                    .then(pokeData => {
                        const nameMatch = searchQuery ? pokeData.name.startsWith(searchQuery) : true;

                        const typeMatch = selectedTypes.length > 0 
                            ? pokeData.types.some(type => selectedTypes.includes(type.type.name.toLowerCase())) 
                            : true;

                        if (nameMatch && typeMatch) {
                            let listItem = document.createElement("div");
                            listItem.classList.add("pokemon-card");

                            // Get the primary type color
                            const primaryType = pokeData.types[0].type.name.toLowerCase();
                            const bgColor = typeColors[primaryType] || "#ccc"; // Default gray if type not found

                            listItem.innerHTML = `
                            <div class="card p-3 shadow-lg" style="background: linear-gradient(135deg, ${bgColor}, #ffffff);">
                                <img src="${pokeData.sprites.front_default}" class="card-img-top" alt="${pokeData.name}">
                                <div class="card-body text-center">
                                    <h5 class="card-title">${pokeData.name.toUpperCase()}</h5>
                                    <p class="card-text"><strong>ID:</strong> ${pokeData.id}</p>
                                    <p class="card-text"><strong>Type:</strong> ${pokeData.types.map(type => type.type.name).join(", ")}</p>
                                    <p class="card-text"><strong>Abilities:</strong> ${pokeData.abilities.map(ability => ability.ability.name).join(", ")}</p>
                                    <p class="card-text"><strong>Base Experience:</strong> ${pokeData.base_experience}</p>
                                    <p class="card-text stat-line"><strong>Height & Weight:</strong>&nbsp;${pokeData.height / 10}m&nbsp;|&nbsp;${pokeData.weight / 10}kg</p>
                                    <p class="card-text stat-line"><strong>HP & Attack:</strong>&nbsp;${pokeData.stats[0].base_stat}&nbsp;|&nbsp;${pokeData.stats[1].base_stat}</p>
                                    <p class="card-text stat-line"><strong>Defense & Speed:</strong>&nbsp;${pokeData.stats[2].base_stat}&nbsp;|&nbsp;${pokeData.stats[5].base_stat}</p>
                                </div>
                            </div>
                            `;

                            pokemonList.appendChild(listItem);
                        }
                    })
                    .catch(error => console.error("Error fetching Pokémon details:", error));
            });

            setTimeout(() => {
                if (pokemonList.innerHTML === "") {
                    pokemonList.innerHTML = `<p class="text-danger">No Pokémon found!</p>`;
                }
            }, 1000);
        })
        .catch(error => {
            console.error("Error fetching Pokémon list:", error);
            pokemonList.innerHTML = `<p class="text-danger">Error loading Pokémon data!</p>`;
        });
}
