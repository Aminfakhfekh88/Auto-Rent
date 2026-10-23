// Taille du texte (A- / A+) et mode sombre, mémorisés dans le navigateur
(function () {
    var root = document.documentElement, tailles = [100, 115, 130, 150];
    function lire(cle, defaut) { try { return localStorage.getItem(cle) || defaut; } catch (e) { return defaut; } }
    function ecrire(cle, val) { try { localStorage.setItem(cle, val); } catch (e) { } }

    var taille = Math.min(Math.max(parseInt(lire("taille", "0"), 10) || 0, 0), tailles.length - 1);
    root.setAttribute("data-bs-theme", lire("theme", "light"));
    root.style.fontSize = tailles[taille] + "%";

    document.addEventListener("DOMContentLoaded", function () {
        var moins = document.getElementById("textMinus"), plus = document.getElementById("textPlus"), th = document.getElementById("themeToggle");

        function maj() {
            root.style.fontSize = tailles[taille] + "%";
            if (moins) moins.disabled = taille === 0;
            if (plus) plus.disabled = taille === tailles.length - 1;
            if (th) {
                var sombre = root.getAttribute("data-bs-theme") === "dark";
                th.innerHTML = sombre ? '<i class="bi bi-sun-fill me-1"></i>Mode clair' : '<i class="bi bi-moon-fill me-1"></i>Mode sombre';
            }
        }
        if (moins) moins.addEventListener("click", function () { taille--; ecrire("taille", taille); maj(); });
        if (plus) plus.addEventListener("click", function () { taille++; ecrire("taille", taille); maj(); });
        if (th) th.addEventListener("click", function () {
            var suivant = root.getAttribute("data-bs-theme") === "dark" ? "light" : "dark";
            root.setAttribute("data-bs-theme", suivant);
            ecrire("theme", suivant);
            maj();
        });
        maj();
    });
})();

// Animations : apparition au défilement, compteurs, pause du slider
(function () {
    var racine = document.documentElement;
    racine.classList.add("js");
    var reduit = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function compter(el) {
        var cible = parseInt(el.getAttribute("data-cible"), 10) || 0;
        if (reduit) { el.textContent = cible; return; }
        var debut = null;
        function pas(t) {
            if (debut === null) debut = t;
            var p = Math.min((t - debut) / 1400, 1);
            el.textContent = Math.round(cible * (1 - Math.pow(1 - p, 3)));
            if (p < 1) requestAnimationFrame(pas);
        }
        requestAnimationFrame(pas);
    }

    document.addEventListener("DOMContentLoaded", function () {
        var cibles = document.querySelectorAll(".reveal, .compteur");
        if (!("IntersectionObserver" in window)) {
            cibles.forEach(function (e) { e.classList.add("visible"); if (e.classList.contains("compteur")) compter(e); });
        } else {
            var obs = new IntersectionObserver(function (entrees) {
                entrees.forEach(function (en) {
                    if (!en.isIntersecting) return;
                    en.target.classList.add("visible");
                    if (en.target.classList.contains("compteur")) compter(en.target);
                    obs.unobserve(en.target);
                });
            }, { threshold: 0.2 });
            cibles.forEach(function (e) { obs.observe(e); });
        }

        // Slider d'accueil : bouton Pause / Lecture (et pas de défilement si l'utilisateur préfère moins d'animations)
        var slider = document.getElementById("heroSlider"), bouton = document.getElementById("heroPause");
        if (slider && bouton && window.bootstrap) {
            var car = bootstrap.Carousel.getOrCreateInstance(slider), enMarche = !reduit;
            function majBouton() {
                bouton.innerHTML = enMarche ? '<i class="bi bi-pause-fill me-1"></i>Pause' : '<i class="bi bi-play-fill me-1"></i>Lecture';
                bouton.setAttribute("aria-label", enMarche ? "Mettre le diaporama en pause" : "Relancer le diaporama");
            }
            if (!enMarche) car.pause();
            bouton.addEventListener("click", function () { enMarche = !enMarche; if (enMarche) car.cycle(); else car.pause(); majBouton(); });
            majBouton();
        }
    });
})();
