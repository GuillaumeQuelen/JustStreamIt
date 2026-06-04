const sections = {
  "sci-fi": "Sci-Fi",
  "film-noir": "Film-Noir",
  "policier": "Crime",
};

function choisirLogo() {
  const logo = document.getElementById("logo");
  const largeur = window.innerWidth;
  if (largeur < 768) {
    logo.src = "images/logo_Mobile.png";
  } else if (largeur < 1024) {
    logo.src = "images/logo_Tablet.png";
  } else {
    logo.src = "images/logo_Dekstop.png";
  }
}
choisirLogo();
window.addEventListener("resize", choisirLogo);

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

  films.forEach((film, index) => {
    const col = document.createElement("div");
    col.className = "col-6 col-md-3 col-lg-2 carte-film";
    col.style.cursor = "pointer";

    if (index >= 2) {
      col.classList.add("d-none", "d-md-flex", "d-lg-flex", "carte-film-cache");
    }
    if (index >= 4) {
      col.classList.add("d-none", "d-md-none", "d-lg-flex", "carte-film-cache");
    }

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

  const btnVoirPlus = document.createElement("button");
  btnVoirPlus.textContent = "Voir plus";
  btnVoirPlus.className = "btn-voir-plus d-lg-none";
  btnVoirPlus.addEventListener("click", () => {
    const caches = row.querySelectorAll(".carte-film-cache");
    if (btnVoirPlus.textContent === "Voir plus") {
      caches.forEach(el => el.classList.remove("d-none"));
      btnVoirPlus.textContent = "Voir moins";
    } else {
      caches.forEach(el => el.classList.add("d-none"));
      btnVoirPlus.textContent = "Voir plus";
    }
  });
  row.parentElement.appendChild(btnVoirPlus);
}

function afficherGenre(genre, sectionId) {
  fetch(`http://127.0.0.1:8000/api/v1/titles/?sort_by=-imdb_score&genre=${genre}&page_size=6`)
    .then(response => response.json())
    .then(data => {
      afficherFilms(data.results, sectionId);
    });
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

    // Charger le résumé du meilleur film
    fetch(`http://127.0.0.1:8000/api/v1/titles/${meilleurFilm.id}`)
      .then(r => r.json())
      .then(detail => {
        document.getElementById("meilleur-resume").textContent = detail.long_description;
      });

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

afficherGenre("Sci-Fi", "sci-fi");
afficherGenre("Film-Noir", "film-noir");
afficherGenre("Crime", "policier");