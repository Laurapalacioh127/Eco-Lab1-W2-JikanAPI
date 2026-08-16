const getAnimes = async () => {
  const response = await fetch("https://api.jikan.moe/v4/top/anime?limit=10");
  
  if (!response.ok) {
    throw new Error(`Error ${response.status}: no se pudo obtener la lista de animes`);
  }
  
  const data = await response.json();
  return data.data;
};

const renderAnimes = async (container) => {
  const animes = await getAnimes();
  container.innerHTML = "";

  animes.forEach(anime => {
    const animeElement = document.createElement("div");
    animeElement.innerHTML = `
      <h3>${anime.title}</h3>
      <img src="${anime.images.jpg.large_image_url}" width="200" />
      <p>${anime.synopsis}</p>
      <button onclick="window.location.href='anime.html?id=${anime.mal_id}'">Ver detalles</button>
    `;
    container.appendChild(animeElement);
  });
};

const init = async () => {
  const loadingEl = document.querySelector("#loading");
  const errorEl = document.querySelector("#error");
  const animesContainer = document.querySelector("#animes");

  loadingEl.style.display = "block";

  try {
    await renderAnimes(animesContainer);
  } catch (err) {
    console.error(err); // para que tú también veas el error real en consola
    errorEl.innerHTML = "Ocurrió un error al cargar los animes.";
  } finally {
    loadingEl.style.display = "none";
  }
};

document.addEventListener('DOMContentLoaded', init);