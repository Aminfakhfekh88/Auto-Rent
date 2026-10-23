$(function () {
    // 1. Lire les véhicules dans le tableau AVANT DataTables
    var voitures = [];
    $("#tableCatalogue tbody tr").each(function () {
        var td = $(this).children("td");
        voitures.push({ categorie: td.eq(0).text().trim(), nom: td.eq(1).text().trim(), prix: parseInt(td.eq(3).text()) });
    });

    // 2. DataTables : recherche, tri, pagination
    var table = $("#tableCatalogue").DataTable({ language: FR, pageLength: 6, lengthMenu: [6, 12, 24], order: [], columnDefs: [{ orderable: false, targets: [4, 5] }] });

    // 3. Select2
    var $cat = $("#categorie"), $voit = $("#voiture");
    var options = {
        theme: "bootstrap-5", width: "100%", placeholder: "Cliquez pour choisir", allowClear: true,
        language: { noResults: function () { return "Aucun résultat"; } }
    };
    $cat.select2(options);
    $voit.select2(options);

    function trouver(nom) {
        return voitures.find(function (v) { return v.nom === nom; });
    }

    // 4. Listes dépendantes : catégorie -> voitures -> prix
    function remplir(cat) {
        $voit.empty().append("<option></option>");
        voitures.forEach(function (v) {
            if (!cat || v.categorie === cat) {
                $voit.append($("<option>").val(v.nom).text(v.nom + " — " + v.prix + " DT/jour"));
            }
        });
        $voit.val(null).trigger("change");
    }

    // 5. Estimation affichée en direct (sans bouton "calculer")
    function estimer() {
        var v = trouver($voit.val()), d1 = $("#dateDebut").val(), d2 = $("#dateFin").val(), jours = 0;
        if (d1 && d2) jours = (new Date(d2) - new Date(d1)) / 86400000;
        var ok = v && d1 && d2 && jours >= 0;
        if (ok) jours = Math.max(1, jours);
        $("#resVoiture").text(v ? v.nom : "—");
        $("#resJours").text(ok ? jours + (jours > 1 ? " jours" : " jour") : "—");
        $("#resTotal").text(ok ? jours * v.prix + " DT" : "—");
        return ok ? { jours: jours, prixJour: v.prix, total: jours * v.prix } : null;
    }

    $cat.on("change", function () { remplir($(this).val()); });
    $voit.on("change", function () {
        var v = trouver($(this).val());
        $("#prixJour").val(v ? v.prix + " DT" : "");
        if (v) $cat.val(v.categorie).trigger("change.select2"); // met à jour l'affichage sans relancer remplir()
        estimer();
    });

    var aujourdhui = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    $("#dateDebut, #dateFin").attr("min", aujourdhui);
    $("#dateDebut").on("change", function () { $("#dateFin").attr("min", $(this).val() || aujourdhui); });
    $("#dateDebut, #dateFin").on("change", estimer);

    remplir("");

    // Tri (le tableau est affiché en cartes, donc pas d'en-têtes cliquables)
    $("#tri").on("change", function () {
        var o = this.value ? this.value.split(",") : null;
        if (o) table.order([+o[0], o[1]]).draw(); else table.order([]).draw();
    });

    // Bouton « Choisir cette voiture » sur une carte
    $("#tableCatalogue").on("click", ".btn-choisir", function () {
        var v = trouver($(this).data("nom"));
        $cat.val(v.categorie).trigger("change");
        $voit.val(v.nom).trigger("change");
        document.getElementById("reservation").scrollIntoView({ behavior: "smooth" });
    });

    // 6. Véhicule choisi depuis catalogue.html
    var choix = null;
    try { choix = JSON.parse(localStorage.getItem("vehiculeChoisi")); localStorage.removeItem("vehiculeChoisi"); } catch (e) { }
    if (choix) {
        if (!trouver(choix.nom)) voitures.push(choix);
        $cat.val(choix.categorie).trigger("change");
        $voit.val(choix.nom).trigger("change");
    }

    // 7. Validation avec messages simples
    function erreur(texte, sel) {
        $("#message").attr("class", "alert alert-danger").text(texte);
        var $c = $(sel).addClass("is-invalid");
        if ($c.is("select")) $c.select2("open"); else $c.trigger("focus");
        return null;
    }
    $("#reservationForm").on("input change", ".is-invalid", function () { $(this).removeClass("is-invalid"); });

    $("#reservationForm").on("submit", function (e) {
        e.preventDefault();
        $("#message").addClass("d-none");
        var nom = $("#nom").val().trim(), email = $("#email").val().trim(), tel = $("#telephone").val().trim();
        var d1 = $("#dateDebut").val(), d2 = $("#dateFin").val();

        if (!$cat.val()) return erreur("Étape 1 : choisissez un type de voiture.", "#categorie");
        if (!$voit.val()) return erreur("Étape 1 : choisissez une voiture.", "#voiture");
        if (!d1) return erreur("Étape 2 : choisissez la date de début.", "#dateDebut");
        if (!d2) return erreur("Étape 2 : choisissez la date de fin.", "#dateFin");
        if (new Date(d2) < new Date(d1)) return erreur("Étape 2 : la date de fin doit être après la date de début.", "#dateFin");
        if (nom.length < 3) return erreur("Étape 3 : écrivez votre nom et prénom (3 lettres au moins).", "#nom");
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return erreur("Étape 3 : votre adresse email semble incorrecte. Exemple : nom@exemple.com", "#email");
        if (!/^(\+216)?\s?\d{8}$/.test(tel)) return erreur("Étape 3 : votre numéro doit contenir 8 chiffres. Exemple : 20123456", "#telephone");

        var r = estimer();
        localStorage.setItem("reservation", JSON.stringify({
            numero: "DV-" + Date.now().toString().slice(-6),
            emission: new Date().toISOString(),
            nom: nom, email: email, telephone: tel,
            categorie: $cat.val(), voiture: $voit.val(),
            dateDebut: d1, dateFin: d2,
            jours: r.jours, prixJour: r.prixJour, total: r.total
        }));
        location.href = "devis.html";
    });
});
