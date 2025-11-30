let pokemonList = [];
let pokemonTypeList = [];
let minimumPokemonPerPage = 1;
let maximumPokemonPerPage = 20;
let searchPokemon = "";
let searchTypePokemon = "";

const API = "https://pokeapi.co/api/v2/pokemon";
const API2 = "https://pokeapi.co/api/v2/type";

async function loadingPokemonTypes() {
  document.getElementById("loading").innerHTML = "";
  for (let index = 0; index < 20; index++) {
    document.getElementById("loading").innerHTML +=
      '<div class="col-md-3"><div class="skeleton"></div></div>';
  }

  try {
    let pokemonListTypes = await fetch(API2);
    let listType = await pokemonListTypes.json();
    let selectType = document.getElementById("typeFilter");
    for (let index = 0; index < listType.results.length; index++) {
      let option = document.createElement("option");
      option.value = listType.results[index].name;
      option.textContent =
        listType.results[index].name.charAt(0).toUpperCase() +
        listType.results[index].name.slice(1);
      selectType.appendChild(option);
    }
  } catch (erro) {
    console.log("erro", erro);
  }

  await loadingAllTypesPokemon();
}

async function loadingAllTypesPokemon() {
  document.getElementById("loading").style.display = "flex";
  document.getElementById("pokemonGrid").style.display = "none";

  try {
    let changePokemonPerPage =
      (minimumPokemonPerPage - 1) * maximumPokemonPerPage;
    let pokemonLimitPage = API + "?limit=" + "&offset=" + changePokemonPerPage;
    let responsePokemonLimitPage = await fetch(pokemonLimitPage);
    let responsePokemonList = await responsePokemonLimitPage.json();

    let listAllPokemons = [];
    for (let index = 0; index < responsePokemonList.results.length; index++) {
      listAllPokemons.push(fetch(responsePokemonList.results[index].url));
    }

    let responseListAllPokemons = await Promise.all(listAllPokemons);
    pokemonList = [];
    for (let index = 0; index < responseListAllPokemons.length; index++) {
      let pokemon = await responseListAllPokemons[index].json();
      pokemonList.push(pokemon);
    }

    pokemonTypeList = [...pokemonList];
    UNIFOR();
  } catch (erro) {
    console.log("erro ao carregar", erro);
    alert("Erro ao carregar Pokémons!");
  }
}

async function lbt() {
  document.getElementById("loading").style.display = "flex";
  document.getElementById("pokemonGrid").style.display = "none";

  try {
    var ur = API2 + "/" + searchTypePokemon;
    var r = await fetch(ur);
    var dt = await r.json();

    var pr = [];
    var li = dt.pokemon.length > 100 ? 100 : dt.pokemon.length; // Limita a 100
    for (var i = 0; i < li; i++) {
      pr.push(fetch(dt.pokemon[i].pokemon.url));
    }

    var rps = await Promise.all(pr);
    pokemonList = [];
    for (let index = 0; index < rps.length; index++) {
      var p = await rps[index].json();
      pokemonList.push(p);
    }

    pokemonTypeList = [...pokemonList];
    UNIFOR();
  } catch (error) {
    console.log("erro ao carregar tipo");
    alert("Erro ao carregar Pokémons do tipo!");
  }
}
/**
 * Função UNIFOR
 * ----------------------
 * Atualiza a grade de Pokémon na página.
 * Permite filtragem por nome ou ID, renderiza cada Pokémon com imagem, ID, nome e tipos.
 * Controla exibição de carregamento e informações da página, além de habilitar/desabilitar botões de navegação.
 */
function UNIFOR() {
  var g = document.getElementById("pokemonGrid");
  // Seleciona o elemento HTML com id 'pokemonGrid', que é onde os Pokémon serão exibidos.

  g.innerHTML = "";
  // Limpa o conteúdo atual do grid para que a nova lista de Pokémon possa ser exibida.

  var fil = pokemonTypeList;
  // Cria uma variável 'fil' que inicialmente recebe toda a lista de Pokémon.

  if (searchPokemon !== "") {
    fil = fil.filter((p) => {
      return (
        p.name.toLowerCase().includes(searchPokemon.toLowerCase()) ||
        p.id.toString().includes(searchPokemon)
      );
    });
  }
  // Se houver texto em searchPokemon, filtra a lista:
  // - Mantém Pokémon cujo nome contenha o texto pesquisado (ignorando maiúsculas/minúsculas)
  // - Ou cujo ID contenha o texto pesquisado.

  for (var i = 0; i < fil.length; i++) {
    var p = fil[i];
    // Recebe o Pokémon atual no loop

    var fdp = document.createElement("div");
    fdp.className = "col-md-3";
    // Cria um div para cada Pokémon com classe de layout em grade (Bootstrap)

    var html = `<div class="c" onclick="showDetails(${p.id})">`;
    // Cria o container do Pokémon e define um evento onclick para mostrar detalhes do Pokémon

    html += `<img src="${p.sprites.front_default}" class="i" alt="${p.name}">`;
    // Adiciona a imagem do Pokémon no HTML

    html += `<h5 class="text-center">#${p.id} ${p.name
      .charAt(0)
      .toUpperCase()}${p.name.slice(1)}</h5>`;
    // Adiciona o ID e nome do Pokémon com a primeira letra em maiúscula

    html += '<div class="text-center">';
    // Cria um container centralizado para os tipos

    for (var j = 0; j < p.types.length; j++) {
      var typeName = p.types[j].type.name;
      html += `<span class="badge type-${typeName}">${typeName}</span> `;
    }
    // Loop pelos tipos do Pokémon, criando uma badge para cada tipo

    html += "</div></div>";
    // Fecha os divs abertos

    fdp.innerHTML = html;
    // Define o HTML gerado no div criado

    g.appendChild(fdp);
    // Adiciona o div do Pokémon ao grid principal
  }

  document.getElementById("loading").style.display = "none";
  // Esconde o indicador de carregamento

  document.getElementById("pokemonGrid").style.display = "flex";
  // Exibe o grid de Pokémon

  if (searchTypePokemon !== "") {
    document.getElementById(
      "pageInfo"
    ).textContent = `Mostrando ${fil.length} pokémons`;
  } else {
    document.getElementById(
      "pageInfo"
    ).textContent = `Página ${minimumPokemonPerPage}`;
  }
  // Atualiza informações da página: quantidade de Pokémon exibidos ou página atual

  document.getElementById("prevBtn").disabled =
    minimumPokemonPerPage === 1 || searchTypePokemon !== "";
  document.getElementById("nextBtn").disabled = searchTypePokemon !== "";
  // Controla botões de navegação:
  // - Desativa "Anterior" se estiver na primeira página ou filtrando por tipo
  // - Desativa "Próximo" se filtrando por tipo
}

async function f() {
  searchPokemon = document.getElementById("s").value;
  searchTypePokemon = document.getElementById("typeFilter").value;

  // Se tem filtro de tipo, busca pokémons daquele tipo
  if (searchTypePokemon !== "") {
    await lbt();
  } else {
    UNIFOR();
  }
}

function r() {
  document.getElementById("s").value = "";
  document.getElementById("typeFilter").value = "";
  searchPokemon = "";
  searchTypePokemon = "";
  minimumPokemonPerPage = 1;
  loadingAllTypesPokemon();
}

function p1() {
  if (minimumPokemonPerPage > 1) {
    minimumPokemonPerPage--;
    if (searchTypePokemon !== "") {
      UNIFOR();
    } else {
      loadingAllTypesPokemon();
    }
  }
}

function p2() {
  minimumPokemonPerPage++;
  if (searchTypePokemon !== "") {
    UNIFOR();
  } else {
    loadingAllTypesPokemon();
  }
}

function x() {
  document.body.classList.toggle("dark");
}

async function Minhe_nha(id) {
  try {
    var xpto = await fetch(API + "/" + id);
    var p = await xpto.json();

    var zyz = await fetch(p.species.url);
    var m = await zyz.json();

    var desc = "";
    for (let index = 0; index < m.flavor_text_entries.length; index++) {
      if (m.flavor_text_entries[index].language.name === "en") {
        desc = m.flavor_text_entries[index].flavor_text;
        break;
      }
    }

    document.getElementById("modalTitle").textContent =
      "#" + p.id + " " + p.name.charAt(0).toUpperCase() + p.name.slice(1);

    var ph = '<div class="row"><div class="col-md-6">';
    ph += '<div class="sprite-container">';
    ph +=
      '<div><img src="' +
      p.sprites.front_default +
      '" alt="front"><p class="text-center">Normal</p></div>';
    ph +=
      '<div><img src="' +
      p.sprites.front_shiny +
      '" alt="shiny"><p class="text-center">Shiny</p></div>';
    ph += "</div>";

    ph += "<p><strong>Tipo:</strong> ";
    for (let index = 0; index < p.types.length; index++) {
      ph +=
        '<span class="badge type-' +
        p.types[index].type.name +
        '">' +
        p.types[index].type.name +
        "</span> ";
    }
    ph += "</p>";

    ph += "<p><strong>Altura:</strong> " + p.height / 10 + " m</p>";
    ph += "<p><strong>Peso:</strong> " + p.weight / 10 + " kg</p>";

    ph += "<p><strong>Habilidades:</strong> ";
    for (let index = 0; index < p.abilities.length; index++) {
      ph += p.abilities[index].ability.name;
      if (index < p.abilities.length - 1) ph += ", ";
    }
    ph += "</p>";

    ph += '</div><div class="col-md-6">';

    ph += "<p><strong>Descrição:</strong></p>";
    ph += "<p>" + desc.replace(/\f/g, " ") + "</p>";

    ph += "<h6>Estatísticas:</h6>";
    for (let index = 0; index < p.stats.length; index++) {
      var stat = p.stats[index];
      var percentage = (stat.base_stat / 255) * 100;
      ph +=
        "<div><small>" + stat.stat.name + ": " + stat.base_stat + "</small>";
      ph +=
        '<div class="stat-bar"><div class="stat-fill" style="width: ' +
        percentage +
        '%"></div></div></div>';
    }

    ph += "</div></div>";

    document.getElementById("modalBody").innerHTML = ph;

    var mod = new bootstrap.Modal(document.getElementById("m"));
    mod.show();
  } catch (error) {
    console.log("erro");
    alert("Erro ao carregar detalhes!");
  }
}

window.onload = function () {
  loadingPokemonTypes();
};
