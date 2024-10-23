/*In questo file abbiamo:

Rotte pubbliche:

POST /register - Registrazione nuovo utente
POST /login - Login utente


Rotte protette (richiedono token JWT):

GET /profile - Ottieni dati profilo
PUT /profile - Aggiorna profilo
DELETE /account - Elimina account



Ogni rotta ha:

Il percorso appropriato
I middleware necessari (validazione, autenticazione)
Il controller corrispondente
Gli endpoint completi saranno:

POST /api/users/register
POST /api/users/login
GET /api/users/profile
PUT /api/users/profile
DELETE /api/users/account*/


const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const { 
    registerValidation, 
    loginValidation, 
    updateValidation, 
    validate 
} = require('../middleware/validate');

// Rotte pubbliche (non richiedono autenticazione)
router.post(
    '/register', 
    registerValidation,    // Validazione input registrazione
    validate,             // Controllo errori validazione
    userController.register
);

router.post(
    '/login', 
    loginValidation,      // Validazione input login
    validate,             // Controllo errori validazione
    userController.login
);

// Rotte protette (richiedono autenticazione)
router.get(
    '/profile', 
    auth,                 // Verifica autenticazione
    userController.getProfile
);

router.put(
    '/profile', 
    auth,                 // Verifica autenticazione
    updateValidation,     // Validazione input aggiornamento
    validate,             // Controllo errori validazione
    userController.updateProfile
);

router.delete(
    '/account', 
    auth,                 // Verifica autenticazione
    userController.deleteAccount
);

module.exports = router;