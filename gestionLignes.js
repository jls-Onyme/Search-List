/* gestionLignes.js */

// ====================================================================== //
/* ===== Fonction Ajouter une ligne ===================================== */
// ====================================================================== //
document.getElementById("btnAjouter").addEventListener("click", function ()
{
	if (selection === "tous") return alert("Choisir une feuille avant !");

	const etat = prompt("Etat :");
	const BAL = prompt("BAL :");
	const nom = prompt("Nom :");
	const prenom = prompt("Prénom :");

	console.log("etat", etat);
	console.log("BAL", BAL);
	if (etat || BAL || nom || prenom){
		// Nouvelle Ligne dans selection
		//const nextLigne = { etat: "", BAL: "", nom: "", prenom: ""};
		bases[selection].push({Etat: etat, BAL: BAL, Nom: nom, Prénom: prenom});
		console.log("bases[selection]", bases[selection]);
		afficherResultats();
	}
})

// ====================================================================== //
/* ===== Fonction Modiiffier une ligne ================================== */
// ====================================================================== //
function modifierLigne(nomOnglet, index)
{
	const ligne = bases[nomOnglet][index];
	const newEtat = prompt("Modifier Etat :", ligne.Etat);
	const newBAL = prompt("Modifier N° :", ligne.BAL);
	const newNom = prompt("Modifier Nom :", ligne.Nom);
	const newPrenom = prompt("Modifier Prénom :", ligne.Prénom);

	console.log("ligne.Etat", ligne.Etat);
	console.log("ligne.BAL", ligne.BAL);
	console.log("ligne.Nom", ligne.Nom);
	console.log("ligne.Prénom", ligne.Prénom);
	
	// Remplace la ligne par des inputs pour édition
	if (newEtat !== null) {
		ligne.Etat = newEtat;
	}
	if (newBAL !== null) {
		ligne.BAL = newBAL;
	}
	if (newNom !== null) {
		ligne.Nom = newNom;
	}
	if (newPrenom !== null) {
		ligne.Prénom = newPrenom;
	}
	if (newEtat !== null || newBAL !== null 
		|| newNom !== null || newPrenom !== null) {
		afficherResultats();
	}
}

// ====================================================================== //
/* ===== Fonction Supprimer une ligne =================================== */
// ====================================================================== //
function supprimerLigne(selection, index){
	if(!confirm("Suppression, sûre ?")) return;
	bases[selection].splice(index, 1); // Supprimme l'élément à la position index
	afficherResultats();
}