$(function () {
    var r = null;
    try { r = JSON.parse(localStorage.getItem("reservation")); } catch (e) { }

    if (!r) {
        $("#devis").addClass("d-none");
        $("#vide").removeClass("d-none");
        return;
    }

    var fmt = function (d) { return new Date(d).toLocaleDateString("fr-FR"); };
    r.dateDebut = fmt(r.dateDebut);
    r.dateFin = fmt(r.dateFin);
    r.emission = fmt(r.emission);

    $("[data-champ]").each(function () {
        $(this).text(r[$(this).data("champ")]);
    });

    $("#btnImprimer").on("click", function () { window.print(); });
});
