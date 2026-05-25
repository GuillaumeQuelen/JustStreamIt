# JustStreamIt — Le Petit Ciné

Site web qui affiche un classement de films en consommant l'API OCMovies.

## Prérequis
- Python 3.8+
- Navigateur récent

## Installation

### 1. Lancer l'API OCMovies
```bash
cd OCMovies-API-EN-FR
python3 -m venv env
source env/bin/activate
pip install -r requirements.txt
python manage.py create_db
python manage.py runserver
```

### 2. Lancer le site
```bash
cd 1603881-creez-votre-site-web-avec-html5-et-css3
python3 -m http.server 8080
```

Ouvre http://localhost:8080

## Technologies
- HTML5, CSS3, JavaScript vanilla
- Bootstrap 5
- API REST OCMovies