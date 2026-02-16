/* script.js */

// ====================================================================== //
/* ===== Variable Globale =============================================== */
// ====================================================================== //
let bases = {}; // Contiendra toutes les Feuilles JSON
let selection = ""; // Nom onglet choisit


// ====================================================================== //
/* =====  Fonction Charger le JSON via FileReader ======================= */
// ====================================================================== //
document.getElementById("chargerJson")
    .addEventListener("change", function(event)
{
    // event.target.file -> liste des fichier selectionné
    const fichier = event.target.files[0]; // Premier fichier choisi
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
        }
        catch (err)
        {
            console.log("Erreur lecture JSON : ", err)
            alert("Erreur lecture JSON : " + err);
        }
    };
    reader.readAsText(fichier); // Lecture du fichier du texte
})


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
/* ===== Fonction Creer une ligne Tableau =============================== */
// ====================================================================== //
function creerLigneTableau(ligne, index, nomFeuille) {
    const tr = document.createElement("tr");
    
    // Affichage des colonnes
    tr.innerHTML = `
        <td>${ligne.Etat || ""}</td>
        <td>${ligne.Num || ""}</td>
        <td>${ligne.Nom || ""}</td>
        <td>${ligne.Prénom || ""}</td>
        `;
    
    const tdActions = document.createElement("td");
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
    // querySelector("#monTableau tbody") -> selectionne le <tboody> dans monTableau
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
            Array.isArray(bases[nomOnglet]);
            // Boucle des lignes
            bases[nomOnglet].forEach(function(ligne, index){
                // Recherche simple
                if (String(ligne.Etat || "").toLowerCase().trim().includes(recherche)
                    || String(ligne.Num || "").toLowerCase().trim().includes(recherche)
                    || String(ligne.Nom || "").toLowerCase().trim().includes(recherche)
                    || String(ligne.Prénom || "").toLowerCase().trim().includes(recherche))
                    {
                        const tr = creerLigneTableau(ligne, index, nomOnglet);
                        tbody.appendChild(tr);
                    }
            });
        })
    } else {
        bases[selection].forEach(function(ligne, index){
            if (String(ligne.Etat || "").toLowerCase().trim().includes(recherche)
                || String(ligne.Num || "").toLowerCase().trim().includes(recherche)
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


// ====================================================================== //
/* ===== Fonction Trier et Afficher les Lignes ========================== */
// ====================================================================== //
/*
function trierAfficherLigne(ligne, index, nomOnglet, tbody)
{
    //console.log("Affichage ligne !")
    const recherche = document.getElementById("search").value.toLowerCase();
    
    console.log("nomOnglet :", nomOnglet);

    //On filtre d'abort les resultats
    const filtres = bases[nomOnglet].filter(ligne =>
            String(ligne.Etat || "").toLowerCase().trim().includes(recherche)
            || String(ligne.Num || "").toLowerCase().trim().includes(recherche)
            || String(ligne.Nom || "").toLowerCase().trim().includes(recherche)
            || String(ligne.Prénom || "").toLowerCase().trim().includes(recherche));

    // Si aucun résultat
    if (filtres.length === 0)
    {
        //const zone = document.getElementById("rienTrouve");
        //zone.textContent = "Aucun resultat trouvé !";
        const tr = document.createElement("tr");
        const td = document.createElement("td");
        td.colSpan = 5;
        td.textContent = "Aucun résultat !";
        tr.appendChild(td);
        tbody.appendChild(tr);
        return;
    }

    // Afficher les lignes
    filtres.forEach((ligne, index) =>{
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${ligne.Etat || ""}</td>
            <td>${ligne.Num || ""}</td>
            <td>${ligne.Nom || ""}</td>
            <td>${ligne.Prénom || ""}</td>
            <td>
                <button onclick="ModifierLigne(${ligne, index})">Modifier</button>
                <button onclick="SupprimerLigne(${ligne, index})">Supprimer</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}
*/

// ====================================================================== //
/* ===== Fonction Modiiffier une ligne ================================== */
// ====================================================================== //
function modifierLigne(nomOnglet, index)
{
    const ligne = bases[nomOnglet][index];
    const newEtat = prompt("Modifier Etat :", ligne.Etat);
    const newNum = prompt("Modifier N° :", ligne.Num);
    const newNom = prompt("Modifier Nom :", ligne.Nom);
    const newPrenom = prompt("Modifier Prénom :", ligne.Prénom);

    console.log("ligne.Etat", ligne.Etat);
    console.log("ligne.num", ligne.Num);
    console.log("ligne.Nom", ligne.Nom);
    console.log("ligne.Prénom", ligne.Prénom);
    
    // Remplace la ligne par des inputs pour édition
    if (newEtat !== null) {
        ligne.Etat = newEtat;
    }
    if (newNum !== null) {
        ligne.Num = newNum;
    }
    if (newNom !== null) {
        ligne.Nom = newNom;
    }
    if (newPrenom !== null) {
        ligne.Prénom = newPrenom;
    }
    if (newEtat !== null || newNum !== null 
        || newNom !== null || newPrenom !== null) {
        afficherResultats();
    }
}


// ====================================================================== //
/* ===== Fonction Valider la ligne modiffier ============================ */
// ====================================================================== //
/*
function validerLigne(index)
{
    const newEtat = document.getElementById(`etat_${index}`).value;
    console.log( "newEtat :" , newEtat);
    const newNum = document.getElementById(`num_${index}`).value;
    console.log( "newNum :" , newNum);
    const newNom = document.getElementById(`nom_${index}`).value;
    const newPrenom = document.getElementById(`prenom_${index}`).value;

    bases[selection][index].etat = newEtat;
    bases[selection][index].num = newNum;
    bases[selection][index].nom = newNom;
    bases[selection][index].prenom = newPrenom;

    afficherResultats(); // Reconstruit le tableau
}
*/
// ====================================================================== //
/* ===== Fonction Ajouter une ligne ===================================== */
// ====================================================================== //
document.getElementById("btnAjouter").addEventListener("click", function ()
{
    if (selection === "tous") return alert("Choisir une feuille avant !");

    const etat = prompt("Etat :");
    const num = prompt("Num :");
    const nom = prompt("Nom :");
    const prenom = prompt("Prénom :");

    console.log("etat", etat);
    console.log("num", num);
    if (etat || num || nom || prenom){
        // Nouvelle Ligne dans selection
        //const nextLigne = { etat: "", num: "", nom: "", prenom: ""};
        bases[selection].push({Etat: etat, Num: num, Nom: nom, Prénom: prenom});
        console.log("bases[selection]", bases[selection]);
        afficherResultats();
    }
})


// ====================================================================== //
/* ===== Fonction Supprimer une ligne =================================== */
// ====================================================================== //
function supprimerLigne(selection, index){
    if(!confirm("Suppression, sûre ?")) return;
    bases[selection].splice(index, 1); // Supprimme l'élément à la position index
    afficherResultats();
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

    const dataStr = JSON.stringify(bases, null, 2) // null, é = mise en forme indentée
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
