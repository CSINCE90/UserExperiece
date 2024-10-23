const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
    try {
        // Estrae il token dall'header Authorization
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        // Verifica presenza token
        if (!token) {
            return res.status(401).json({ 
                success: false,
                message: 'Accesso negato. Token mancante.' 
            });
        }

        try {
            // Verifica validità token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            next();
        } catch (error) {
            return res.status(401).json({ 
                success: false,
                message: 'Token non valido o scaduto.' 
            });
        }
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Errore nel server durante autenticazione' 
        });
    }
};

module.exports = authMiddleware;