# Auto Rent

Site web d'une agence de location de voitures, réalisé pour le TP de Développement Web (ENET'Com, Sfax).

Pas de serveur, pas de base de données : tout tourne dans le navigateur. On part d'une page HTML toute simple (Partie 1) et on l'améliore étape par étape jusqu'à un petit site complet avec catalogue, réservation, devis et page contact.

## Le groupe

- Mohamed Amine Fakhfekh

Dépôt GitHub : _lien à ajouter_
Site en ligne (GitHub Pages) : _lien à ajouter_

## Ce qu'on a fait, partie par partie

**Partie 1 : HTML, CSS, JavaScript** (`index.html`, `style.css`, `script.js`)
Une page avec le catalogue de 5 voitures, un formulaire de réservation, le calcul du prix (jours × prix par jour) et la validation des champs.

**Partie 2 : Bootstrap** (`index2.html`)
Même site avec Bootstrap : navbar, grille, cards, carousel et formulaire restylé.

**Partie 3 : Select2 et DataTables** (`index3.html`)
Listes déroulantes avec recherche, catalogue avec recherche/tri/pagination, et listes liées : quand on choisit une catégorie, seules ses voitures apparaissent, et le prix par jour se remplit tout seul.

**Partie 4 : CSV et IA** (`catalogue.html`, `contact.html`, `devis.html`)
- `data/vehicles.csv` : 60 véhicules, lus en JavaScript pour construire le catalogue
- une page Contact avec validation
- un devis généré à partir de la réservation, avec un bouton « Imprimer » (`window.print()` et règles `@media print`)
- trois améliorations faites avec l'IA (voir plus bas)

## Technologies et bibliothèques

HTML5, CSS3, JavaScript, Bootstrap 5.3, Bootstrap Icons, jQuery 3.7, Select2 (avec son thème Bootstrap 5), DataTables 1.13, Git et GitHub.

## Les fichiers

```
auto-rent/
├── index.html           Partie 1
├── index2.html          Partie 2
├── index3.html          Partie 3, c'est la page d'accueil du site final
├── catalogue.html       catalogue lu depuis le CSV
├── contact.html
├── devis.html
├── style.css            styles de la Partie 1
├── script.js            script de la Partie 1
├── data/
│   └── vehicles.csv
├── assets/
│   ├── css/             ux.css (design et animations), print.css (impression)
│   └── js/              script3.js, catalogue.js, contact.js, devis.js, ux.js, datatables-fr.js
├── images/
├── Lancer le site.bat   démarre le site en double-clic (Windows)
├── serveur.ps1          le petit serveur utilisé par le .bat
└── README.md
```

Les photos viennent de liens Unsplash, donc le dossier `images/` reste vide. Les avis clients de l'accueil sont inventés, c'est juste pour la démo.

## Lancer le site

Le catalogue charge le CSV avec `fetch()`, et ça ne marche pas si on double-clique sur le fichier HTML. Il faut un petit serveur local, au choix :

- **Windows** : double-clic sur `Lancer le site.bat`, le navigateur s'ouvre tout seul
- **VS Code** : extension Live Server, clic droit sur `index3.html` puis « Open with Live Server »
- **Python** : `python -m http.server` dans le dossier, puis http://localhost:8080/index3.html
- **En ligne** : GitHub Pages (voir ci-dessous)

## Comment tester

1. Ouvrir `index3.html` : le slider défile, les cartes de voitures se trient et se cherchent.
2. Cliquer sur « Choisir cette voiture » sur une carte : le formulaire de réservation se remplit.
3. Choisir deux dates : le prix s'affiche en direct.
4. Cliquer sur « Voir mon devis » puis « Imprimer mon devis ».
5. Aller dans `catalogue.html` : 60 voitures, filtres par type, budget et disponibilité.
6. Tester `contact.html` en laissant des champs vides, puis en les remplissant.

## Mettre le projet sur GitHub

```
git init
git add .
git commit -m "TP Développement Web - Version complète"
git branch -M main
git remote add origin https://github.com/<COMPTE>/<DEPOT>.git
git push -u origin main
```

Pour GitHub Pages : Settings, puis Pages, branche `main`, dossier `/ (root)`, Save. Le site est en ligne au bout d'une ou deux minutes.

## Les trois améliorations faites avec l'IA

<!-- remplacer les prompts par ceux réellement utilisés -->

### 1. Taille du texte et mode sombre

**Prompt :** « Ajoute des boutons A− / A+ pour agrandir le texte et un mode sombre sur toutes les pages, et garde le choix de l'utilisateur. »

**Ce que l'IA a proposé :** changer la taille de police de la balise `<html>` et l'attribut `data-bs-theme` de Bootstrap.

**Ce qu'on a gardé :** `assets/js/ux.js` et la barre en haut des pages. On l'a chargé dans le `<head>` pour que le thème ne clignote pas au chargement.

**Comment ça marche :** toutes les tailles sont en `rem`, donc tout grandit quand la police de `<html>` change. Bootstrap 5.3 adapte ses couleurs selon `data-bs-theme`. Le choix est gardé dans `localStorage`.

### 2. Prix en direct et messages d'erreur plus clairs

**Prompt :** « Remplace le bouton Calculer par un résumé qui se met à jour dès que je choisis la voiture et les dates, et écris des messages d'erreur plus simples. »

**Ce que l'IA a proposé :** une fonction `estimer()` appelée à chaque changement de champ.

**Ce qu'on a gardé :** `assets/js/script3.js` et le panneau « Votre estimation » dans `index3.html`. Chaque erreur dit quelle étape est concernée et place le curseur sur le champ à corriger.

**Comment ça marche :** `estimer()` calcule le nombre de jours puis jours × prix par jour, et met à jour le panneau.

### 3. Slider, cartes et animations

**Prompt :** « Remplace les tableaux par des cartes avec photos, ajoute un grand slider d'images et des animations douces. Garde la recherche, le tri et la pagination. »

**Ce que l'IA a proposé :** un Carousel Bootstrap en fondu, des animations CSS et un `IntersectionObserver` pour faire apparaître les blocs au défilement.

**Ce qu'on a gardé :** le slider dans `index3.html`, les animations dans `ux.css` et `ux.js`, et le catalogue en cartes dans `catalogue.js`. Les animations s'arrêtent si l'appareil demande moins de mouvement, et le slider a un bouton Pause.

**Comment ça marche :** la balise `<table>` est toujours là pour DataTables, mais le CSS l'affiche en grille de cartes. Un menu « Trier par » remplace les en-têtes de colonnes cliquables.

## Les pièges qu'on a rencontrés

- `fetch()` ne lit pas le CSV en `file://`, d'où le petit serveur local.
- DataTables retire du DOM les lignes qui ne sont pas sur la page affichée : il faut lire les voitures du tableau **avant** de l'initialiser.
- Pour changer la catégorie sans relancer le remplissage de la liste des voitures, on déclenche `change.select2` au lieu de `change`.

## Sources des photos

Photos libres de droits Unsplash : Jasper, Martin Katler, Norbert Kundrak, Florian van Duyn.
