const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    // Gestione errori specifici
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            message: 'Errore di validazione',
            errors: err.errors
        });
    }

    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({
            success: false,
            message: 'Non autorizzato'
        });
    }

    // Errore generico
    res.status(500).json({
        success: false,
        message: 'Errore interno del server',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
};

module.exports = errorHandler;