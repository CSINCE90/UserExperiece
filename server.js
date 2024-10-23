const express = require('express');
const dotenv = require('dotenv');
const userRoutes = require('./src/routes/userRoutes');
const errorHandler = require('./src/utils/errorHandler');

// Carica le variabili d'ambiente
dotenv.config();

// Inizializza express
const app = express();
const port = process.env.PORT || 3000;

// Middleware per il parsing del body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Headers CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

// Route di base per verificare che il server sia attivo
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'User Experience API is running',
        version: '1.0.0'
    });
});

// Routes
app.use('/api/users', userRoutes);

// 404 handler
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint non trovato'
    });
});

// Error handler globale
app.use(errorHandler);

// Avvio del server
app.listen(port, () => {
    console.log(`Server avviato su http://localhost:${port}`);
    console.log('Press CTRL-C to stop');
});

// Gestione errori non catturati
process.on('unhandledRejection', (err) => {
    console.error('Errore non gestito:', err);
});

module.exports = app;