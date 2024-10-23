const { body, validationResult } = require('express-validator');

// Regole di validazione per la registrazione
const registerValidation = [
    body('username')
        .trim()
        .notEmpty().withMessage('Username è richiesto')
        .isLength({ min: 3, max: 50 }).withMessage('Username deve essere tra 3 e 50 caratteri')
        .matches(/^[A-Za-z0-9_-]+$/).withMessage('Username può contenere solo lettere, numeri, - e _'),
    
    body('email')
        .trim()
        .notEmpty().withMessage('Email è richiesta')
        .isEmail().withMessage('Inserire un indirizzo email valido')
        .normalizeEmail(),
    
    body('password')
        .trim()
        .notEmpty().withMessage('Password è richiesta')
        .isLength({ min: 6 }).withMessage('Password deve essere di almeno 6 caratteri')
        .matches(/\d/).withMessage('Password deve contenere almeno un numero')
        .matches(/[A-Z]/).withMessage('Password deve contenere almeno una lettera maiuscola')
];

// Regole di validazione per il login
const loginValidation = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email è richiesta')
        .isEmail().withMessage('Inserire un indirizzo email valido')
        .normalizeEmail(),
    
    body('password')
        .trim()
        .notEmpty().withMessage('Password è richiesta')
];

// Regole di validazione per l'aggiornamento utente
const updateValidation = [
    body('username')
        .optional()
        .trim()
        .isLength({ min: 3, max: 50 }).withMessage('Username deve essere tra 3 e 50 caratteri')
        .matches(/^[A-Za-z0-9_-]+$/).withMessage('Username può contenere solo lettere, numeri, - e _'),
    
    body('email')
        .optional()
        .trim()
        .isEmail().withMessage('Inserire un indirizzo email valido')
        .normalizeEmail()
];

// Middleware per gestire gli errori di validazione
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array().map(err => ({
                field: err.param,
                message: err.msg
            }))
        });
    }
    next();
};

module.exports = {
    registerValidation,
    loginValidation,
    updateValidation,
    validate
};


/*Questi middleware fanno:
auth.js:

Verifica presenza token JWT nell'header Authorization
Valida il token usando la JWT_SECRET
Aggiunge le informazioni dell'utente decodificate alla request
Gestisce diversi tipi di errori di autenticazione

validate.js:

Definisce regole di validazione per registrazione, login e aggiornamento
Controlla formato e contenuto di username, email e password
Normalizza i dati in input (trim, normalizeEmail)
Fornisce messaggi di errore dettagliati per ogni tipo di validazione fallita*/