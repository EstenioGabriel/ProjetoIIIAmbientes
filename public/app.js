let pokemonList = [];
let pokemonTypeList = [];
let minimumPokemonPerPage = 1;
let maximumPokemonPerPage = 20;
let searchPokemon = '';
let searchTypePokemon = '';

const API = 'https://pokeapi.co/api/v2/pokemon';
const API2 = 'https://pokeapi.co/api/v2/type';

async function loadingPokemonTypes() {
    document.getElementById('loading').innerHTML = '';
    for(let index = 0; index < 20; index++) {
        document.getElementById('loading').innerHTML += '<div class="col-md-3"><div class="skeleton"></div></div>';
    }

    try {
        let pokemonListTypes = await fetch(API2);
        let listType = await pokemonListTypes.json();
        let selectType = document.getElementById('typeFilter');
        for(let index = 0; index < listType.results.length; index++) {
            let option = document.createElement('option');
            option.value = listType.results[index].name;
            option.textContent = listType.results[index].name.charAt(0).toUpperCase() + listType.results[index].name.slice(1);
            selectType.appendChild(option);
        }
    } catch(erro) {
        console.log('erro',erro);
    }

    await loadingAllTypesPokemon();
}

async function loadingAllTypesPokemon() {
    document.getElementById('loading').style.display = 'flex';
    document.getElementById('pokemonGrid').style.display = 'none';

    try {
        let changePokemonPerPage = (minimumPokemonPerPage - 1) * maximumPokemonPerPage;
        let pokemonLimitPage = API + '?limit=' + '&offset=' + changePokemonPerPage;
        let responsePokemonLimitPage = await fetch(pokemonLimitPage);
        let responsePokemonList = await responsePokemonLimitPage.json();

        let listAllPokemons = [];
        for(let index = 0; index < responsePokemonList.results.length; index++) {
            listAllPokemons.push(fetch(responsePokemonList.results[index].url));
        }

        let responseListAllPokemons = await Promise.all(listAllPokemons);
        pokemonList = [];
        for(let index = 0; index < responseListAllPokemons.length; index++) {
            let pokemon = await responseListAllPokemons[index].json();
            pokemonList.push(pokemon);
        }

        pokemonTypeList = [...pokemonList];
        pokemonGrid();
    } catch(erro) {
        console.log('erro ao carregar',erro);
        alert('Erro ao carregar Pokémons!');
    }
}

async function listByType() {
    document.getElementById('loading').style.display = 'flex';
    document.getElementById('pokemonGrid').style.display = 'none';

    try {
        let typePokemonRote= API2 + '/' + searchTypePokemon;
        let responsePokemonRote = await fetch(typePokemonRote);
        let listPokemonTypes = await responsePokemonRote.json();

        let pokemonTypesList = [];
        let limitPerPage = listPokemonTypes.pokemon.length > 100 ? 100 : listPokemonTypes.pokemon.length; // Limita a 100
        for(let index = 0; index < limitPerPage; index++) {
            pokemonTypesList.push(fetch(listPokemonTypes.pokemon[index].pokemon.url));
        }

        let response = await Promise.all(pokemonTypesList);
        pokemonList = [];
        for(let index = 0; index < response.length; index++) {
            let responseData = await response[index].json();
            pokemonList.push(responseData);
        }

        pokemonTypeList = [...pokemonList];
        pokemonGrid();
    } catch(erro) {
        console.log('erro ao carregar tipo',erro);
        alert('Erro ao carregar Pokémons do tipo!');
    }
}

function pokemonGrid() {
  let pokemonGridContainer = document.getElementById("pokemonGrid");
  pokemonGridContainer.innerHTML = "";

    let pokemonFilteredList = pokemonTypeList;
    if(searchPokemon !== '') {
        pokemonFilteredList = pokemonFilteredList.filter(p => {
            return p.name.toLowerCase().includes(searchPokemon.toLowerCase()) ||
                   p.id.toString().includes(searchPokemon);
        });
    }

    for(let i = 0; i < pokemonFilteredList.length; i++) {
        let filteredListElement = pokemonFilteredList[i];
        var showPokemon = document.createElement('div');
        showPokemon.className = 'col-md-3';

        var html = '<div class="c" onclick="showDetails(' + filteredListElement.id + ')">';
        html = html + '<img src="' + filteredListElement.sprites.front_default + '" class="i" alt="' + filteredListElement.name + '">';
        html = html + '<h5 class="text-center">#' + filteredListElement.id + ' ' + filteredListElement.name.charAt(0).toUpperCase() + filteredListElement.name.slice(1) + '</h5>';
        html = html + '<div class="text-center">';

        for(let j = 0; j < filteredListElement.types.length; j++) {
            let typeName = filteredListElement.types[j].type.name;
            html = html + '<span class="badge type-' + typeName + '">' + typeName + '</span> ';
        }

        html = html + '</div></div>';
        showPokemon.innerHTML = html;
        pokemonGridContainer.appendChild(showPokemon);
    }
    html = html + "</div></div>";
    showPokemon.innerHTML = html;
    pokemonGridContainer.appendChild(showPokemon);

    document.getElementById('loading').style.display = 'none';
    document.getElementById('pokemonGrid').style.display = 'flex';

    if(searchTypePokemon !== '') {
        document.getElementById('pageInfo').textContent = 'Mostrando ' + pokemonFilteredList.length + ' pokémons';
    } else {
        document.getElementById('pageInfo').textContent = 'Página ' + minimumPokemonPerPage;
    }

    document.getElementById('prevBtn').disabled = minimumPokemonPerPage === 1 || searchTypePokemon !== '';
    document.getElementById('nextBtn').disabled = searchTypePokemon !== '';
}

async function f() {
    searchPokemon = document.getElementById('s').value;
    searchTypePokemon = document.getElementById('typeFilter').value;

    // Se tem filtro de tipo, busca pokémons daquele tipo
    if(searchTypePokemon !== '') {
        await listByType();
    } else {
        pokemonGrid();
    }
}

function clearSearch() {
    document.getElementById('s').value = '';
    document.getElementById('typeFilter').value = '';
    searchPokemon = '';
    searchTypePokemon = '';
    minimumPokemonPerPage = 1;
    loadingAllTypesPokemon();
}

function previousPage() {
    if(minimumPokemonPerPage > 1) {
        minimumPokemonPerPage--;
        if(searchTypePokemon !== '') {
            pokemonGrid();
        } else {
            loadingAllTypesPokemon();
        }
    }
}

function nextPage() {
    minimumPokemonPerPage++;
    if(searchTypePokemon !== '') {
        pokemonGrid();
    } else {
        loadingAllTypesPokemon();
    }
}

function darkTheme() {
    document.body.classList.toggle('dark');
}

async function showDetails(id) {
    try {
        let response = await fetch(API + '/' + id);
        let pokemonDetailsRote = await response.json();

        let response1 = await fetch(pokemonDetailsRote.species.url);
        var m = await response1.json();

        var desc = '';
        for(let index = 0; index < m.flavor_text_entries.length; index++) {
            if(m.flavor_text_entries[index].language.name === 'en') {
                desc = m.flavor_text_entries[index].flavor_text;
                break;
            }
        }

        document.getElementById('modalTitle').textContent = '#' + pokemonDetailsRote.id + ' ' + pokemonDetailsRote.name.charAt(0).toUpperCase() + pokemonDetailsRote.name.slice(1);

        var ph = '<div class="row"><div class="col-md-6">';
        ph += '<div class="sprite-container">';
        ph += '<div><img src="' + pokemonDetailsRote.sprites.front_default + '" alt="front"><p class="text-center">Normal</p></div>';
        ph += '<div><img src="' + pokemonDetailsRote.sprites.front_shiny + '" alt="shiny"><p class="text-center">Shiny</p></div>';
        ph += '</div>';

        ph += '<p><strong>Tipo:</strong> ';
        for(let index = 0; index < pokemonDetailsRote.types.length; index++) {
            ph += '<span class="badge type-' + pokemonDetailsRote.types[index].type.name + '">' + pokemonDetailsRote.types[index].type.name + '</span> ';
        }
        ph += '</p>';

        ph += '<p><strong>Altura:</strong> ' + (pokemonDetailsRote.height / 10) + ' m</p>';
        ph += '<p><strong>Peso:</strong> ' + (pokemonDetailsRote.weight / 10) + ' kg</p>';

        ph += '<p><strong>Habilidades:</strong> ';
        for(let index = 0; index < pokemonDetailsRote.abilities.length; index++) {
            ph += pokemonDetailsRote.abilities[index].ability.name;
            if(index < pokemonDetailsRote.abilities.length - 1) ph += ', ';
        }
        ph += '</p>';

        ph += '</div><div class="col-md-6">';

        ph += '<p><strong>Descrição:</strong></p>';
        ph += '<p>' + desc.replace(/\f/g, ' ') + '</p>';

        ph += '<h6>Estatísticas:</h6>';
        for(let index = 0; index < pokemonDetailsRote.stats.length; index++) {
            var stat = pokemonDetailsRote.stats[index];
            var percentage = (stat.base_stat / 255) * 100;
            ph += '<div><small>' + stat.stat.name + ': ' + stat.base_stat + '</small>';
            ph += '<div class="stat-bar"><div class="stat-fill" style="width: ' + percentage + '%"></div></div></div>';
        }

        ph += '</div></div>';

        document.getElementById('modalBody').innerHTML = ph;

        var mod = new bootstrap.Modal(document.getElementById('m'));
        mod.show();

    } catch(error) {
        console.log('erro');
        alert('Erro ao carregar detalhes!');
    }
}

window.onload = function() {
    loadingPokemonTypes();
};
