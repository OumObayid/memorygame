 //music de fond aau cours de la partie du jeu
 var monElementAudio = document.getElementById('BgMusic');
 monElementAudio.volume = 0.1;
 //compteur de secondes
 var seconds = 60; // parametrable
 document.getElementById("timer").textContent = seconds;
 var montimer = setInterval(function decompte() {
     seconds--;
     document.getElementById("timer").textContent = seconds;
     if (seconds <= 0) {
         document.getElementById("resultat").innerText = "Game Over !"; //afficher le text "Game Over quand la dur�e est temin�e"
         document.getElementById("btn").value = "Rejouer" // bouton change de text
         afficher_cacher_resultat("resultat"); //afficher le message  "game over"
         clearInterval(montimer); // arreter le timer si la dur�e est termin��
         document.getElementById("BgMusic").pause(); // arreter la musique du fond
         document.getElementById("BgMusic").currentTime = 0;
         var audioGameOver = new Audio('audios/gameOver.wav');
         audioGameOver.play(); // faire marcher le son de la fin du jeu
     }
     if (nbPairesTrouvees == 8) clearInterval(montimer); // aarreter le timer si toutes les paires sont trouv�es
 }, 1000);

 //fonction afficher le message du r�sultat: "bravo" ou "game over"
 function afficher_cacher_resultat(id) {
     if (document.getElementById(id).style.visibility == "hidden")
         document.getElementById(id).style.visibility = "visible";
     else
         document.getElementById(id).style.visibility = "hidden";
     return true;
 }

 //Cr�ation et initialisation du Tableau des motifs
 /*Le jeu comporte 8 motifs diff�rents qui sont num�rot�s de 1 � 8.
 Le tableau est initialis� avec les num�ros de motifs qui se suivent.*/
 var motifsImages = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8];

 //Cr�ation et initialisation du Tableau des �tats
 /*Le codage utilis� pour l'�tat des images est le suivant :
 * 0 : face cach�e ()
 * 1 : face visible 
 Au d�part toutes les images sont pr�sent�es de dos.*/
 var etatsImages = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

 //Cr�ation et initialisation du Tableau des num�ros des images retourn�es � un moment donn� du jeu
 var imagesRetournees = [];

 //Cr�ation et initialisation du variable contenaant le nombre de paires de images qui ont d�j� �t� trouv�es.*/
 var nbPairesTrouvees = 0;

 //Cr�ation et initialisation du variable pour compteur de clics*/
 var NombreClics = 0;

 // Cr�ation et initialisation du tableau contenant les objets des �l�ments "<img" du tableau des images du jeu.
 var TabImages = document.getElementById("TabJeu").getElementsByTagName("img");

 //Controle des cliques sur les images	
 /*On parcourt le tableau des objets des �l�ments "<img", chacune d'eux re�oit une fonction d�clench�e 
   par l'�v�nement "onclick".*/
 for (var i = 0; i < TabImages.length; i++) {
     TabImages[i].NumImg = i; //Ajout de la propri�t� NumImg � l'objet img
     TabImages[i].onclick = function() {
         if (document.getElementById("resultat").style.visibility == "hidden") {
             var audioClic = new Audio('audios/flip.wav');
             audioClic.play(); //son de clic                                        
             controleJeu(this.NumImg); //appel � la fonction pour v�rifier si les deux images cliqu�es
         }
     }
 }
 //initialisation du jeu en m�langeant les images grace � l'appel � cette fonction
 initialiseJeu();

 //fonction du mise � jour de l'affichage de l'image (passant de l'image dos � l'image dont on passe le num�ro en param�tre)
 /* L'affichage rendu d�pend de l'�tat actuel de l'image (donn� par le tableau "etatsImages":
 * �tat 0 : image face cach�e, on affiche l'image "dosImg.png"
 * �tat 1 : image retourn�e, on affiche l'image du motif correspondant, on notera que les
 diff�rentes images des motifs sont dans les fichiers nomm�s "image1.jpg", "image2.jpg" ...*/
 function majAffichage(NumImg) {
     switch (etatsImages[NumImg]) {
         case 0:
             TabImages[NumImg].src = "imgs/dosImg.png";
             break;
         case 1:
             TabImages[NumImg].src = "imgs/image" + motifsImages[NumImg] + ".jpg"; //affectation de l'�l�ment objet img par sa source
             document.getElementById('nbPairesTrouvees').innerText = nbPairesTrouvees; //affichage du nombre des paires trouv�es
             document.getElementById('comptClics').innerText = NombreClics; //affichage du nombre des cliques
             break;
     }
 }

 //Fonction pour afficher ou masquer la solution (toutes les images sont affich�es ou masqu�es via un meme bouton)
 function afficherMasquerSolution() {
     if (document.getElementById("btnA").value == "Afficher") { //si le bouton est "Afficher"
         document.getElementById("btnA").value = "Masquer";
         for (var i = 0; i < TabImages.length; i++) TabImages[i].src = "imgs/image" + motifsImages[i] + ".jpg"; //on retourne toutes les images 
     } else { //si le bouton est "Masquer"
         document.getElementById("btnA").value = "Afficher";
         for (var i = 0; i < TabImages.length; i++) TabImages[i].src = "imgs/dosImg.png"; // on cache toutes les images
     }
 }

 //fonction pour recharger le jeu. lors du chargement de la page , la fonction initiaaliseJeu() est aappel�e.
 function rejouer() {
     location.reload();
 }

 //Fonction pour initialiser le jeu: elle m�lange les num�ros de motif des images.
 function initialiseJeu() {
     for (var position = motifsImages.length - 1; position >= 1; position--) {
         var hasard = Math.floor(Math.random() * (position + 1));
         var sauve = motifsImages[position];
         motifsImages[position] = motifsImages[hasard];
         motifsImages[hasard] = sauve;
     }
 }

 //Fonction pour controler le clique sur l'objet "img"
 function controleJeu(NumImg) {
     NombreClics++; //incr�mentation du nombre du clique
     if (imagesRetournees.length < 2) { //Si le nombre des images retourn� est 1
         if (etatsImages[NumImg] == 0) { //Si l'image cliqu�e est de dos		 
             etatsImages[NumImg] = 1; //on fait passer son �tat � 1
             imagesRetournees.push(NumImg); //on ajoute son num�ro au tableau des images retourn�es
             majAffichage(NumImg); //on fait la mise � jour de son affichage
         }
     }
     if (imagesRetournees.length == 2) { //Si le nombre des images retourn� est 2
         var nouveauEtat = 0; //variable pour stoquer le nouveau �tat
         if (motifsImages[imagesRetournees[0]] == motifsImages[imagesRetournees[1]]) { //si les deux images retourn�es sont identiques
             var audioPaireTrouve = new Audio('audios/match.wav');
             audioPaireTrouve.play(); // son de paires retrouv�es
             nouveauEtat = 1;
             nbPairesTrouvees++; //incr�mentaation du nombre des paires trouv�es
         }

         /*affectaation des �tats des images retourn�es par leurs nouveaux �tats.
         1: les deux imaages restent affich�es. 
         0: on les remets � dos*/
         etatsImages[imagesRetournees[0]] = nouveauEtat;
         etatsImages[imagesRetournees[1]] = nouveauEtat;
         // Mise � jour de l'affichage des images et tout le reste
         setTimeout(function() { // on tol�re un peu de temps de 750ms � l'utilisateur pour voir ce qui se passe la mise � de l'affichage des images
             majAffichage(imagesRetournees[0]); //Mise � jour de l'affichage de la premi�re image retourn�e
             majAffichage(imagesRetournees[1]); //Mise � jour de l'affichage de la deuxi�me image retourn�e
             imagesRetournees = []; //Initialisation du tableau  
             //si toutes les paires ont �t� retrouv�es                                                                       
             if (nbPairesTrouvees == 8) {
                 document.getElementById("resultat").innerText = "Bravo !!"; // saisir dans le span du message:"bravo"
                 afficher_cacher_resultat('resultat'); //affichage du message du r�sultat (bravo)
                 document.getElementById("BgMusic").pause(); //arret du musique du fond ( �a marche pas !!!)
                 document.getElementById("BgMusic").currentTime = 0;
                 var audioVictoire = new Audio('audios/victory.wav');
                 audioVictoire.play(); //declenchement du son du victoire ( �a marche pas !!!)
                 clearInterval(montimer); //arrete du timer
                 document.getElementById('btn').value = "Rejouer";
             }
         }, 750);
     }


 }