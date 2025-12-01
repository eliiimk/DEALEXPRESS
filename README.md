# DealExpress API

DealExpress est une API REST inspirée de Dealabs permettant aux utilisateurs de partager des bons plans, voter HOT/COLD, commenter, et aux modérateurs/admins de gérer les validations et les rôles utilisateurs.

## Installation

### Cloner le projet
```bash
git clone https://github.com/eliiimk/DEALEXPRESS.git
```

### Installer les dépendances
```bash
npm install
```

### Configurer les variables d’environnement

Créer un fichier **.env** à la racine du projet :

```
PORT=3000
MONGODB_URI=Votre_URI_MongoDB
JWT_SECRET=change-me
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

### Lancer le serveur

```bash
npm run dev
```

Le serveur démarre sur :

```
http://localhost:3000
```

### Outils recommandés

- **MongoDB Compass** → visualiser vos données
- **Postman ou Insomnia** → tester vos requêtes API
- **VSCode** → édition du code

## Liste complète des Endpoints

AUTHENTIFICATION

### Register  
**POST** `/api/auth/register`

### Login  
**POST** `/api/auth/login`

### Profil utilisateur  
**GET** `/api/auth/me`

DEALS

### Liste des deals  
**GET** `/api/deals`

### Détails d’un deal  
**GET** `/api/deals/:id`

### Créer un deal  
**POST** `/api/deals`

### Modifier un deal  
**PUT** `/api/deals/:id`

### Supprimer un deal  
**DELETE** `/api/deals/:id`

VOTES HOT / COLD

### Voter HOT / COLD  
**POST** `/api/deals/:id/vote`

### Retirer son vote  
**DELETE** `/api/deals/:id/vote`

### Stats des votes  
**GET** `/api/deals/:id/votes`

COMMENTAIRES

### Ajouter un commentaire  
**POST** `/api/deals/:dealId/comments`

### Lister les commentaires d’un deal  
**GET** `/api/deals/:dealId/comments`

### Modifier un commentaire  
**PUT** `/api/comments/:id`

### Supprimer un commentaire  
**DELETE** `/api/comments/:id`

MODÉRATION 

### Lister les deals en attente  
**GET** `/api/admin/deals/pending`

### Approuver / Rejeter un deal  
**PATCH** `/api/admin/deals/:id/moderate`

ADMINISTRATION 

### Lister les utilisateurs  
**GET** `/api/admin/users?page=1&limit=10`

### Modifier le rôle d’un utilisateur  
**PATCH** `/api/admin/users/:id/role`