$(function () {
    var regles = {
        nom: [function (v) { return v.trim().length >= 3; }, "Le nom doit contenir au moins 3 caractères."],
        email: [function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); }, "Adresse email invalide."],
        telephone: [function (v) { return /^(\+216)?\s?\d{8}$/.test(v.trim()); }, "Téléphone invalide (8 chiffres)."],
        sujet: [function (v) { return v !== ""; }, "Veuillez choisir un sujet."],
        message: [function (v) { return v.trim().length >= 10; }, "Le message doit contenir au moins 10 caractères."]
    };

    $("#contactForm").on("submit", function (e) {
        e.preventDefault();
        var ok = true;

        $.each(regles, function (id, r) {
            var $champ = $("#" + id), valide = r[0]($champ.val());
            $champ.toggleClass("is-invalid", !valide).toggleClass("is-valid", valide);
            $champ.next(".invalid-feedback").text(r[1]);
            if (!valide) ok = false;
        });

        $("#succes").toggleClass("d-none", !ok);
        if (ok) {
            this.reset();
            $(this).find(".is-valid").removeClass("is-valid");
        }
    });
});
