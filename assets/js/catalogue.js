$(function () {
    var PHOTOS = {"Citadine": "https://images.unsplash.com/photo-1749840705747-21cc842efab8?w=600&q=80&auto=format&fit=crop", "Berline": "https://images.unsplash.com/photo-1565429504749-436a49cd9f45?w=600&q=80&auto=format&fit=crop", "Commerciale": "https://images.unsplash.com/photo-1579992822406-2092a7bd5a36?w=600&q=80&auto=format&fit=crop", "SUV": "https://images.unsplash.com/photo-1506244856291-8910ea843e81?w=600&q=80&auto=format&fit=crop"};
    fetch("data/vehicles.csv")
        .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.text(); })
        .then(demarrer)
        .catch(function () { $("#erreur").removeClass("d-none"); $("#zoneCatalogue").addClass("d-none"); });

    // Lecture du CSV : 1re ligne = noms des colonnes
    function parserCsv(texte) {
        var lignes = texte.trim().split(/\r?\n/), cles = lignes.shift().split(",");
        return lignes.map(function (l) {
            var c = l.split(","), o = {};
            cles.forEach(function (k, i) { o[k] = c[i]; });
            return o;
        });
    }

    function demarrer(texte) {
        var vehicules = parserCsv(texte), parId = {}, html = "";

        vehicules.forEach(function (v) {
            parId[v.id] = v;
            var dispo = v.available === "true", nom = v.brand + " " + v.model;
            html += '<tr><td class="c-cat">' + v.category + '</td><td class="c-nom">' + nom + '</td><td class="c-cv">' + v.power + ' CV</td><td class="c-prix" data-order="' + v.pricePerDay + '">' + v.pricePerDay + ' DT / jour</td><td class="c-dispo">' +
                (dispo ? '<span class="badge text-bg-success fs-6">Disponible</span>' : '<span class="badge text-bg-secondary fs-6">Indisponible</span>') +
                '</td><td class="c-act"><button class="btn btn-primary w-100 btn-reserver" data-id="' + v.id + '" aria-label="Réserver ' + nom + '"' +
                (dispo ? "" : " disabled") + '>Réserver</button></td><td class="c-img"><img src="' + PHOTOS[v.category] + '" alt="" loading="lazy"></td></tr>';
        });
        $("#tableVehicules tbody").html(html);
        $("#nbVehicules").text(vehicules.length);

        var table = $("#tableVehicules").DataTable({ language: FR, pageLength: 9, lengthMenu: [9, 18, 36], order: [], columnDefs: [{ orderable: false, targets: [5, 6] }] });

        // Filtres simples : type, budget, disponibilité
        $.fn.dataTable.ext.search.push(function (settings, data) {
            if (settings.nTable.id !== "tableVehicules") return true;
            var cat = $("#filtreCat").val();
            if (cat && data[0] !== cat) return false;
            if (parseInt(data[3]) > +$("#filtrePrix").val()) return false;
            if ($("#filtreDispo").is(":checked") && data[4].indexOf("Indisponible") !== -1) return false;
            return true;
        });
        $("#filtreCat, #filtrePrix, #filtreDispo").on("change", function () { table.draw(); });
        $("#tri").on("change", function () {
            var o = this.value ? this.value.split(",") : null;
            if (o) table.order([+o[0], o[1]]).draw(); else table.order([]).draw();
        });

        // Lien depuis l'accueil : catalogue.html?type=SUV
        var type = new URLSearchParams(location.search).get("type");
        if (type) { $("#filtreCat").val(type).trigger("change"); }

        // Réserver : envoie la voiture au formulaire de index3.html
        $("#tableVehicules").on("click", ".btn-reserver", function () {
            var v = parId[$(this).data("id")];
            localStorage.setItem("vehiculeChoisi", JSON.stringify({ categorie: v.category, nom: v.brand + " " + v.model, prix: +v.pricePerDay }));
            location.href = "index3.html#reservation";
        });
    }
});
