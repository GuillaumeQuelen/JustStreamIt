const couleursGenres = {
  "Action": "#e8e8e8", "Adult": "#ff4d8d", "Adventure": "#ffd700",
  "Animation": "#00e5cc", "Biography": "#a0a0a0", "Comedy": "#ff8c00",
  "Crime": "#4169e1", "Documentary": "#c8c8c8", "Drama": "#9b30ff",
  "Family": "#ffec4f", "Fantasy": "#00c957", "Film-Noir": "#888888",
  "History": "#808080", "Horror": "#ff0000", "Music": "#bf5fff",
  "Musical": "#ffe44d", "Mystery": "#9e9e9e", "News": "#f0f0f0",
  "Reality-TV": "#ffc200", "Romance": "#ff69b4", "Sci-Fi": "#00ff88",
  "Sport": "#ff3333", "Thriller": "#1e90ff", "War": "#cc0000",
  "Western": "#daa520", "Best": "#e9be53", "Bests": "#e9be53", "Others": "#fbff84",
};

const sections = {
  "meilleur-film": "Best", "meilleurs-films": "Bests",
  "action": "Action", "animation": "Animation", "comedie": "Comedy",
  "policier": "Crime", "drame": "Drama", "horreur": "Horror","autres":"Others"
};

for (const [sectionId, genre] of Object.entries(sections)) {
  const element = document.querySelector(`#${sectionId} h2`);
  if (element && genre) {
    element.style.color = couleursGenres[genre];
  }
}

function ouvrirModal(filmId) {
  fetch(`http://127.0.0.1:8000/api/v1/titles/${filmId}`)
    .then(response => response.json())
    .then(detail => {
      document.getElementById("modal-titre").textContent = detail.title;
      document.getElementById("modal-img").src = detail.image_url;
      document.getElementById("modal-img").onerror = () => {
        document.getElementById("modal-img").src = "images/no-image.png";
      };
      document.getElementById("modal-genres").textContent = detail.genres.join(", ");
      document.getElementById("modal-date").textContent = detail.date_published || detail.year;
      document.getElementById("modal-classification").textContent = detail.rated || "N/A";
      document.getElementById("modal-score").textContent = detail.imdb_score;
      document.getElementById("modal-realisateur").textContent = detail.directors.join(", ");
      document.getElementById("modal-acteurs").textContent = detail.actors.join(", ");
      document.getElementById("modal-duree").textContent = detail.duration ? `${detail.duration} min` : "N/A";
      document.getElementById("modal-pays").textContent = detail.countries ? detail.countries.join(", ") : "N/A";
      document.getElementById("modal-recettes").textContent = detail.worldwide_gross_income || "N/A";
      document.getElementById("modal-resume").textContent = detail.long_description;
      const modal = new bootstrap.Modal(document.getElementById("modalFilm"));
      modal.show();
    });
}

function afficherFilms(films, sectionId) {
  const row = document.querySelector(`#${sectionId} .row`);
  row.innerHTML = "";
  films.forEach(film => {
    const col = document.createElement("div");
    col.className = "col-6 col-md-3 col-lg-2 carte-film";
    col.style.cursor = "pointer";

    const img = document.createElement("img");
    img.src = film.image_url;
    img.alt = film.title;
    img.className = "img-fluid";
    img.onerror = () => { img.src = "images/no-image.png"; };

    const h3 = document.createElement("h3");
    h3.textContent = film.title;

    col.appendChild(img);
    col.appendChild(h3);
    row.appendChild(col);

    col.addEventListener("click", () => ouvrirModal(film.id));
  });
}

function afficherGenre(genre, sectionId) {
  fetch(`http://127.0.0.1:8000/api/v1/titles/?sort_by=-imdb_score&genre=${genre}&page_size=6`)
    .then(response => response.json())
    .then(data => { afficherFilms(data.results, sectionId); });
}

fetch("http://127.0.0.1:8000/api/v1/titles/?sort_by=-imdb_score&page_size=7")
  .then(response => response.json())
  .then(data => {
    const meilleurFilm = data.results[0];
    const img = document.querySelector("#meilleur-film img");
    img.onerror = () => { img.src = "images/no-image.png"; };
    img.src = meilleurFilm.image_url;
    img.alt = meilleurFilm.title;
    document.querySelector("#meilleur-film h3").textContent = meilleurFilm.title;
    afficherFilms(data.results.slice(1, 7), "meilleurs-films");

    const ouvrirMeilleur = () => ouvrirModal(meilleurFilm.id);
    document.getElementById("btn-details-meilleur").addEventListener("click", ouvrirMeilleur);
    document.querySelector("#meilleur-film img").addEventListener("click", ouvrirMeilleur);
    document.querySelector("#meilleur-film h3").addEventListener("click", ouvrirMeilleur);
  });

fetch("http://127.0.0.1:8000/api/v1/genres/?page_size=100")
  .then(response => response.json())
  .then(data => {
    const select = document.getElementById("choix-genre");
    data.results.forEach(genre => {
      const option = document.createElement("option");
      option.value = genre.name;
      option.textContent = genre.name;
      select.appendChild(option);
    });

    select.addEventListener("change", (event) => {
      const genreChoisi = event.target.value;
      if (genreChoisi) {
        afficherGenre(genreChoisi, "autres");
      }
    });
  });

afficherGenre("Horror", "horreur");
afficherGenre("Comedy", "comedie");
afficherGenre("Action", "action");
afficherGenre("Animation", "animation");
afficherGenre("Drama", "drame");
afficherGenre("Crime", "policier");