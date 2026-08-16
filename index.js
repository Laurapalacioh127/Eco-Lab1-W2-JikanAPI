const getAnimes = async () => { // Función getAnimes: obtiene la lista de animes desde la API
  const response = await fetch("https://api.jikan.moe/v4/top/anime?limit=25");// se piden 25 resultados

  //si hay error:
  if (!response.ok) {
    throw new Error(`Error ${response.status}: could not get the anime list`);
  }
  //si la petición sale bien:
  const data = await response.json();
  return data.data;
};

const renderAnimes = async (container) => { // Función para pintar los animes en el HTML
  const animes = await getAnimes();
  container.innerHTML = ""; //limpiar el contenedor

  animes.forEach(anime => {
    const animeElement = document.createElement("div");
    animeElement.innerHTML = `
      <h3>${anime.title}</h3>
      <img src="${anime.images.jpg.large_image_url}" width="200" />
      <p>${anime.synopsis}</p>
      <button onclick="window.location.href='anime.html?id=${anime.mal_id}'">View details</button>`;
    container.appendChild(animeElement);
  });
};

const init = async () => { //otra funcion que carga todo
  const loadingEl = document.querySelector("#loading");
  const errorEl = document.querySelector("#error");
  const animesContainer = document.querySelector("#animes");

  loadingEl.style.display = "block"; //muestra el mensaje loading

  try {
    await renderAnimes(animesContainer);
  } catch (err) {
    console.error(err);
    errorEl.innerHTML = "Something went wrong while loading the anime list."; //mensaje al usuario
  } finally {
    loadingEl.style.display = "none";
  }
};

document.addEventListener('DOMContentLoaded', init);