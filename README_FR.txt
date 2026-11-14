GAME PSP DOWNLOAD — GUIDE DE DÉMARRAGE

Cette première version comprend :
- une page publique avec recherche ;
- un espace administrateur protégé par mot de passe ;
- l'ajout de fichiers .ISO et .CSO ;
- le téléchargement et la suppression des jeux.

IMPORTANT — DROITS D'AUTEUR
Publie uniquement des jeux homebrew, des fichiers que tu as créés, ou des fichiers dont tu as l'autorisation de distribution. N'héberge pas de copies non autorisées de jeux commerciaux.

TEST SUR ORDINATEUR
1. Installer Node.js.
2. Ouvrir un terminal dans le dossier du projet.
3. Exécuter : npm install
4. Définir un mot de passe administrateur avec la variable ADMIN_PASSWORD.
5. Exécuter : npm start
6. Ouvrir http://localhost:3000

MISE EN LIGNE SUR RENDER
1. Décompresser le ZIP.
2. Envoyer les fichiers du projet dans un nouveau dépôt GitHub.
3. Sur Render, créer un nouveau Web Service et connecter ce dépôt.
4. Build Command : npm install
5. Start Command : npm start
6. Ajouter une variable d'environnement ADMIN_PASSWORD avec un mot de passe fort.
7. Pour conserver les fichiers envoyés après redémarrage/redéploiement, configurer un disque persistant Render et définir DATA_DIR sur son chemin de montage (par exemple /var/data).

ATTENTION
Sans disque persistant ou stockage externe, les fichiers téléversés peuvent être perdus lors d'un redéploiement ou d'un remplacement de l'instance. Les gros fichiers ISO consomment beaucoup d'espace et de bande passante. Vérifie les limites et tarifs actuels de l'hébergeur avant publication.

SÉCURITÉ
Change impérativement le mot de passe par défaut avant la mise en ligne. Le mot de passe est fourni par variable d'environnement et n'est pas enregistré dans le code.
