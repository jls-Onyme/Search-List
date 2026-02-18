/* lectureFichier.js */

// ====================================================================== //
/* =====  Fonction Charger le JSON via FileReader ======================= */
// ====================================================================== //
function lireJSON(fichier)
{
	if (!fichier) return; //Pas de fichier -> on sort
	
	const reader = new FileReader(); //Créer un "lecteur" de fichiers
	
	// reader.onload ->declenché quand le fichier est entierement lu
	reader.onload = function(evt)
	{
		try
		{
			// evt.target.result contient texte brut du fichier json
			bases = JSON.parse(evt.target.result); // convertir le texte JSON en objet JS
			remplirMenu(); // Fonction Mettre à jour le menu des onglets
			afficherResultats(); // Fonction Afficher et trier le tableau

			// Rendre le bouton Telecharger vivible
			document.getElementById("btnTelecharger").style.display = "inline-block";
			// Rendre l'input fichier invisible
			document.getElementById("chargerFile").style.display = "none";
		}
		catch (err)
		{
			console.log("Erreur lecture JSON : ", err)
			alert("Erreur lecture JSON : " + err);
		}
	};
	reader.readAsText(fichier); // Lecture du fichier du texte
}

// ====================================================================== //
/* =====  Fonction convertir Excel en js ================================ */
// ====================================================================== //
function lireExcel(fichier)
{
	const reader = new FileReader(); //Créer un "lecteur" de fichiers
	// reader.onload ->declenché quand le fichier est entierement lu
	reader.onload = function(evt)
	{
		try
		{
			// evt.target.result contient texte brut du fichier json
			const data = new Uint8Array(evt.target.result);
			const workbook = XLSX.read(data, {type: "array"});

			for (let nom of workbook.SheetNames){
				console.log("SheetNames :", nom);
				const feuille = workbook.Sheets[nom];
				bases[nom] = XLSX.utils.sheet_to_json(feuille);
			}

			console.log("excel->JSON :", bases);
			remplirMenu(); // Fonction Mettre à jour le menu des onglets
			afficherResultats(); // Fonction Afficher et trier le tableau

			// Rendre le bouton Telecharger vivible
			document.getElementById("btnTelecharger").style.display = "inline-block";
			// Rendre l'input fichier invisible
			document.getElementById("chargerFile").style.display = "none";
		}
		catch (err)
		{
			console.log("Erreur lecture Excel : ", err)
			alert("Erreur lecture Excel : " + err);
		}
	};
	reader.readAsArrayBuffer(fichier); // Lecture du fichier du texte
}

// ====================================================================== //
/* =====  Fonction convertir Excel en js ================================ */
// ====================================================================== //
document.getElementById("chargerFile")
	.addEventListener("change", function(event)
{
	// event.target.file -> liste des fichier selectionné
	const fichier = event.target.files[0]; // Premier fichier choisi
	if (!fichier) return; //Pas de fichier -> on sort

	const extension = fichier.name.split(`.`).pop().toLowerCase();

	if (extension === "json"){
		lireJSON(fichier);
	}
	else if (extension === "xlsx") {
		lireExcel(fichier);
	}
	else {
		alert("Mauvais Fichier!");
	}

})