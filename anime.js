const getAnimeById = async (id) => {
  const response = await fetch(`https://api.jikan.moe/v4/anime/${id}`);

  if (!response.ok) {
    throw new Error(`Error ${response.status}: no se pudo obtener el anime`);
  }

  const data = await response.json();
  return data.data;
};

const renderAnime = async (container, id) => {
  const anime = await getAnimeById(id);

  if (!anime) {
    return null; // caso vacío, lo manejamos en init
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

const init = async () => {
  const loadingEl = document.querySelector("#loading");
  const errorEl = document.querySelector("#error");
  const emptyEl = document.querySelector("#empty");
  const container = document.querySelector("#anime-detail");

  // capturar el id desde la URL (?id=123)
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  loadingEl.style.display = "block";

  if (!id) {
    loadingEl.style.display = "none";
    emptyEl.innerHTML = "No se encontró información de este anime.";
    return;
  }

  try {
    const anime = await renderAnime(container, id);
    if (!anime) {
      emptyEl.innerHTML = "No se encontró información de este anime.";
    }
  } catch (err) {
    console.error(err);
    errorEl.innerHTML = "Ocurrió un error al cargar el anime.";
  } finally {
    loadingEl.style.display = "none";
  }
};

document.addEventListener('DOMContentLoaded', init);