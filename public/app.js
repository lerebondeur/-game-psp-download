console.log("GAME PSP DOWNLOAD est prêt !");

function rechercherJeu() {
    let recherche = document.querySelector("input").value.toLowerCase();
    let jeux = document.querySelectorAll(".game");

    jeux.forEach(jeu => {
        jeu.style.display = jeu.textContent.toLowerCase().includes(recherche)
            ? "block"
            : "none";
    });
}
