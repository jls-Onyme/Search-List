/* affichageTableau.js */

// ====================================================================== //
/* ===== Fonction Creer une ligne Tableau =============================== */
// ====================================================================== //
function creerLigneTableau(ligne, index, nomFeuille) {
	const tr = document.createElement("tr");

	// ===== Etat =====
	const tdEtat = document.createElement("td");
	tdEtat.textContent = ligne.Etat;
	tdEtat.setAttribute("data-label", "Etat");
	tr.appendChild(tdEtat);

	// ===== N° =====
	const tdBAL = document.createElement("td");
	tdBAL.textContent = ligne.BAL;
	tdBAL.setAttribute("data-label", "BAL");
	tr.appendChild(tdBAL);

	// ===== Nom =====
	const tdNom = document.createElement("td");
	tdNom.textContent = ligne.Nom;
	tdNom.setAttribute("data-label", "Nom");
	tr.appendChild(tdNom);

	// ===== Prénom =====
	const tdPrenom = document.createElement("td");
	tdPrenom.textContent = ligne.Prénom;
	tdPrenom.setAttribute("data-label", "Prénom");
	tr.appendChild(tdPrenom);
	
	// ===== Action =====
	const tdActions = document.createElement("td");
	tdActions.setAttribute("data-label", "Action");
	if (selection !== "tous"){
		// Bouton Modifier
		const btnModif = document.createElement("button");
		btnModif.textContent = "Modifier";
		btnModif.addEventListener("click", function() {
			modifierLigne(nomFeuille, index);
		});
		tdActions.appendChild(btnModif);

		// Bouton Supprimer
		const btnSupp = document.createElement("button");
		btnSupp.textContent = "Supprimer";
		btnSupp.addEventListener("click", function() {
			supprimerLigne(nomFeuille, index);
		});
		tdActions.appendChild(btnSupp);
	} else {
		tdActions.textContent = "Lecture seule";
	}

	tr.appendChild(tdActions);
	return tr;
}


// ====================================================================== //
/* ===== Fonction pour Afficher le tableau ============================== */
// ====================================================================== //
function afficherResultats()
{
	console.log("Affichage Resultat !")

	const tbody = document.querySelector("#monTableau tbody");
	if (!bases)
	{
		tbody.innerHTML = "<tr><td colspan=`5`>Pas de Fichier</td></tr>";
		return ;
	}
	tbody.innerHTML = ""; // On vide le tableau
	// Verifie si la feuille existe et contient des données
	selection = document.getElementById("choixOnglet").value;
	console.log("bases", bases);
	
	const recherche = document.getElementById("search").value.toLowerCase().trim();
	const table = document.getElementById("monTableau");
	
	// Si Champ de Recherche est vide
	console.log("Recherche", recherche);
	if (recherche.trim() === "")
	{
		console.log("Recherche vide.", recherche);
		table.style.display = "none";
		return ;
	}
	table.style.display = "table";

	console.log("selection", selection);

	if (selection === "tous")
	{
		// Boucle des Onglets
		Object.keys(bases).forEach(function (nomOnglet) {
			if (!Array.isArray(bases[nomOnglet])) return;
			console.log("Is array passe");

			let separator = true; // Booléen pour nom de l'onglet
		
			// Boucle des lignes
			bases[nomOnglet].forEach(function(ligne, index){
				// Recherche simple
				if (String(ligne.Etat || "").toLowerCase().trim().includes(recherche)
					|| String(ligne.BAL || "").toLowerCase().trim().includes(recherche)
					|| String(ligne.Nom || "").toLowerCase().trim().includes(recherche)
					|| String(ligne.Prénom || "").toLowerCase().trim().includes(recherche))
					{
						if(separator === true )
						{
							// Ligne séparatrice avec nom de l'Onglet
							const trSeparator = document.createElement("tr");
							trSeparator.classList.add("ligne-separatrice");
							
							const td = document.createElement("td");
							td.colSpan = document.querySelectorAll("#monTableau thead th").length;
							td.textContent = "- " + nomOnglet +" -";
							trSeparator.appendChild(td);
							tbody.appendChild(trSeparator);
							separator = false;
						}


						const tr = creerLigneTableau(ligne, index, nomOnglet);
						tbody.appendChild(tr);
					}
			});
		})
	} else {
		bases[selection].forEach(function(ligne, index){
			if (String(ligne.Etat || "").toLowerCase().trim().includes(recherche)
				|| String(ligne.BAL || "").toLowerCase().trim().includes(recherche)
				|| String(ligne.Nom || "").toLowerCase().trim().includes(recherche)
				|| String(ligne.Prénom || "").toLowerCase().trim().includes(recherche))
				{
					const tr = creerLigneTableau(ligne, index, selection);
					tbody.appendChild(tr);
				}
		})
		//document.getElementById("btnAjouter").style.display = "inline-block";
	}
}
