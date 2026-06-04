# JustStreamIt

Site affichant le classement de films de l'API OCMovies.
Il présente un meilleur film en vedette et plusieurs sections par genre.

Une section "Autres" avec un menu déroulant permet de choisir une catégorie.
Une modale de détails par film cliqué apparaît.

## Prérequis

- Python 3.8+
- Navigateur
- Git

## Installation

### 1. Cloner le repository

```bash
git clone https://github.com/GuillaumeQuelen/JustStreamIt.git
cd JustStreamIt
```

### 2. Récupérer et lancer l'API OCMovies

Dans un terminal:

git clone https://github.com/OpenClassrooms-Student-Center/OCMovies-API-EN-FR.git
cd OCMovies-API-EN-FR
python3 -m venv env
source env/bin/activate
pip install -r requirements.txt
python manage.py create_db
python manage.py runserver
```

Aller sur http://127.0.0.1:8000

### 3. Lancer le site

```bash
cd JustStreamIt
python3 -m http.server 8080
```

Ouvre http://localhost:8080 dans votre navigateur.

## Fonctionnalités

- Affichage du meilleur film toutes catégories confondues
- Sections par genre (Sci-Fi, Film-Noir, Crime)
- Section "Autres" avec menu déroulant de tous les genres
- Modale de détails au clic sur un film
- Responsive design (mobile / tablette / desktop)

## Technologies

- HTML5, CSS3
- JavaScript vanilla (sans framework)
- Bootstrap 5 (en local)
- API REST OCMovies