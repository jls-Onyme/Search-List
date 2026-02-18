/* main.js */

// ====================================================================== //
/* ===== Variable Globale =============================================== */
// ====================================================================== //
var bases = {}; // Contiendra toutes les Feuilles JSON
var selection = ""; // Nom onglet choisit




// ====================================================================== //
/* ===== Fonction Remplir le Menu Déroulant avec le Nom des Onglets ===== */
// ====================================================================== //
function remplirMenu()
{
	const select = document.getElementById("choixOnglet");
	// Supprime toutes les options sauf "Tous"
	select.innerHTML = `<option value="tous">Toutes les Adresses</option>`;

	// Ajouter les Onglet present dans JSON
	Object.keys(bases).forEach(function(nom)
	{
		const option = document.createElement("option");
		option.value = nom;
		option.textContent = nom;
		select.appendChild(option);
	})

	//Gestion de l'affichage du bouton Ajouter
	if (selection === "tous") {
		document.getElementById("btnAjouter").style.display = "none";
	} else {
		document.getElementById("btnAjouter").style.display = "inline-block";
	}

}


// ====================================================================== //
/* ===== Fonction Télécharger le Json Modifié =========================== */
// ====================================================================== //
document.getElementById("btnTelecharger").addEventListener("click", function()
{
	const maintenant = new Date();
	const date =
		maintenant.getFullYear() + "-" +
		String(maintenant.getMonth() + 1).padStart(2, "O") + "-" +
		String(maintenant.getDate()).padStart(2, "O");
	const nomFichier = `MAJ_List_${date}.json`;

	const dataStr = JSON.stringify(bases, null, 2) // null, 2 = mise en forme indentée
	const blob = new Blob([dataStr], {type: "application/json"});
	const url = URL.createObjectURL(blob);

	const a = document.createElement("a");
	a.href = url;
	a.download = nomFichier;
	a.click();

	URL.revokeObjectURL(url); // libère lamémoire(rde')
})


// ====================================================================== //
/* ===== Evenements pour declancher le filtre =========================== */
// ====================================================================== //
document.getElementById("choixOnglet").addEventListener("change", function (){
	
	console.log("CLICK AJOUTER");
	selection = this.value;
	if (selection === "tous"){
		document.getElementById("btnAjouter").style.display = "none";
	} else {
		document.getElementById("btnAjouter").style.display = "inline-block";
	}
	afficherResultats();
})

document.getElementById("search").addEventListener("input", afficherResultats);
