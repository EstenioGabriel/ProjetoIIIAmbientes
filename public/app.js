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
        UNIFOR();
    } catch(erro) {
        console.log('erro ao carregar',erro);
        alert('Erro ao carregar Pokémons!');
    }
}

async function lbt() {
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
            var p = await response[index].json();
            pokemonList.push(p);
        }

        pokemonTypeList = [...pokemonList];
        UNIFOR();
    } catch(error) {
        console.log('erro ao carregar tipo');
        alert('Erro ao carregar Pokémons do tipo!');
    }
}

function UNIFOR() {
    var g = document.getElementById('pokemonGrid');
    g.innerHTML = '';

    var fil = pokemonTypeList;
    if(searchPokemon !== '') {
        fil = fil.filter(p => {
            return p.name.toLowerCase().includes(searchPokemon.toLowerCase()) ||
                   p.id.toString().includes(searchPokemon);
        });
    }

    for(var i = 0; i < fil.length; i++) {
        var p = fil[i];
        var fdp = document.createElement('div');
        fdp.className = 'col-md-3';

        var html = '<div class="c" onclick="showDetails(' + p.id + ')">';
        html = html + '<img src="' + p.sprites.front_default + '" class="i" alt="' + p.name + '">';
        html = html + '<h5 class="text-center">#' + p.id + ' ' + p.name.charAt(0).toUpperCase() + p.name.slice(1) + '</h5>';
        html = html + '<div class="text-center">';

        for(var j = 0; j < p.types.length; j++) {
            var typeName = p.types[j].type.name;
            html = html + '<span class="badge type-' + typeName + '">' + typeName + '</span> ';
        }

        html = html + '</div></div>';
        fdp.innerHTML = html;
        g.appendChild(fdp);
    }

    document.getElementById('loading').style.display = 'none';
    document.getElementById('pokemonGrid').style.display = 'flex';

    if(searchTypePokemon !== '') {
        document.getElementById('pageInfo').textContent = 'Mostrando ' + fil.length + ' pokémons';
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
        await lbt();
    } else {
        UNIFOR();
    }
}

function r() {
    document.getElementById('s').value = '';
    document.getElementById('typeFilter').value = '';
    searchPokemon = '';
    searchTypePokemon = '';
    minimumPokemonPerPage = 1;
    loadingAllTypesPokemon();
}

function p1() {
    if(minimumPokemonPerPage > 1) {
        minimumPokemonPerPage--;
        if(searchTypePokemon !== '') {
            UNIFOR();
        } else {
            loadingAllTypesPokemon();
        }
    }
}

function p2() {
    minimumPokemonPerPage++;
    if(searchTypePokemon !== '') {
        UNIFOR();
    } else {
        loadingAllTypesPokemon();
    }
}

function x() {
    document.body.classList.toggle('dark');
}

async function Minhe_nha(id) {
    try {
        var xpto = await fetch(API + '/' + id);
        var p = await xpto.json();

        var zyz = await fetch(p.species.url);
        var m = await zyz.json();

        var desc = '';
        for(let index = 0; index < m.flavor_text_entries.length; index++) {
            if(m.flavor_text_entries[index].language.name === 'en') {
                desc = m.flavor_text_entries[index].flavor_text;
                break;
            }
        }

        document.getElementById('modalTitle').textContent = '#' + p.id + ' ' + p.name.charAt(0).toUpperCase() + p.name.slice(1);

        var ph = '<div class="row"><div class="col-md-6">';
        ph += '<div class="sprite-container">';
        ph += '<div><img src="' + p.sprites.front_default + '" alt="front"><p class="text-center">Normal</p></div>';
        ph += '<div><img src="' + p.sprites.front_shiny + '" alt="shiny"><p class="text-center">Shiny</p></div>';
        ph += '</div>';

        ph += '<p><strong>Tipo:</strong> ';
        for(let index = 0; index < p.types.length; index++) {
            ph += '<span class="badge type-' + p.types[index].type.name + '">' + p.types[index].type.name + '</span> ';
        }
        ph += '</p>';

        ph += '<p><strong>Altura:</strong> ' + (p.height / 10) + ' m</p>';
        ph += '<p><strong>Peso:</strong> ' + (p.weight / 10) + ' kg</p>';

        ph += '<p><strong>Habilidades:</strong> ';
        for(let index = 0; index < p.abilities.length; index++) {
            ph += p.abilities[index].ability.name;
            if(index < p.abilities.length - 1) ph += ', ';
        }
        ph += '</p>';

        ph += '</div><div class="col-md-6">';

        ph += '<p><strong>Descrição:</strong></p>';
        ph += '<p>' + desc.replace(/\f/g, ' ') + '</p>';

        ph += '<h6>Estatísticas:</h6>';
        for(let index = 0; index < p.stats.length; index++) {
            var stat = p.stats[index];
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
