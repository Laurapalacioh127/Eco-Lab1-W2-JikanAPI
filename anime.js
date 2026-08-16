const getAnimeById = async (id) => { //funcion que obtiene el anime según el id
  const response = await fetch(`https://api.jikan.moe/v4/anime/${id}`);

  // si la respuesta no es exitosa, error
  if (!response.ok) {
    throw new Error(`Error ${response.status}: could not get anime`);
  }

  const data = await response.json(); //convertir la respuesta en un json
  return data.data;
};

const renderAnime = async (container, id) => { //funcion para pintar los detalles del anime en html
  const anime = await getAnimeById(id);

  if (!anime) { // si la API responde sin datas sale null
    return null;
  }

  container.innerHTML = `
    <h1>${anime.titles[0].title}</h1>
    <img src="${anime.images.jpg.large_image_url}" width="300" />
    <p>${anime.synopsis}</p>
    <p><strong>Inicio:</strong> ${anime.aired.from}</p>
    <p><strong>Fin:</strong> ${anime.aired.to}</p>
  `;

  return anime;
};

// Función que arranca todo al cargar la página
const init = async () => {
  const loadingEl = document.querySelector("#loading");
  const errorEl = document.querySelector("#error");
  const emptyEl = document.querySelector("#empty");
  const container = document.querySelector("#anime-detail");

  // capturar el id desde que aparece desde la URL
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  loadingEl.style.display = "block";

  if (!id) {
    loadingEl.style.display = "none"; //si no hay id no se hace el fetch
    emptyEl.innerHTML = "could not find info about this anime :(";
    return;
  }

  try {
    const anime = await renderAnime(container, id);
    if (!anime) {
      emptyEl.innerHTML = "could not find info about this anime :(";
    }
  } catch (err) {
    console.error(err); //si hay error
    errorEl.innerHTML = "there was an error loading the anime :(";
  } finally {
    loadingEl.style.display = "none";
  }
};

document.addEventListener('DOMContentLoaded', init);