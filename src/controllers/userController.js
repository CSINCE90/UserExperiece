/*Questo controller include:

Registrazione (con hash della password)
Login (con generazione JWT)
Recupero profilo utente
Aggiornamento profilo
Eliminazione account

Ogni metodo:

Gestisce gli errori appropriatamente
Fornisce risposte JSON strutturate
Include messaggi di successo/errore
Registra gli errori in console per il debugging
Implementa controlli di sicurezza (es. verifica email duplicata)*/

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const userController = {
    // Registrazione nuovo utente
    async register(req, res) {
        try {
            const { username, email, password } = req.body;

            // Verifica se l'email è già registrata
            const existingUser = await User.findByEmail(email);
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'Email già registrata'
                });
            }

            // Hash della password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Creazione nuovo utente
            const result = await User.create({
                username,
                email,
                password: hashedPassword
            });

            res.status(201).json({
                success: true,
                message: 'Utente registrato con successo',
                data: {
                    id: result.insertId,
                    username,
                    email
                }
            });
        } catch (error) {
            console.error('Errore durante la registrazione:', error);
            res.status(500).json({
                success: false,
                message: 'Errore durante la registrazione dell\'utente'
            });
        }
    },

    // Login utente
    async login(req, res) {
        try {
            const { email, password } = req.body;

            // Trova l'utente
            const user = await User.findByEmail(email);
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Credenziali non valide'
                });
            }

            // Verifica password
            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                return res.status(401).json({
                    success: false,
                    message: 'Credenziali non valide'
                });
            }

            // Genera token JWT
            const token = jwt.sign(
                { 
                    userId: user.id,
                    email: user.email 
                },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.json({
                success: true,
                message: 'Login effettuato con successo',
                data: {
                    token,
                    user: {
                        id: user.id,
                        username: user.username,
                        email: user.email
                    }
                }
            });
        } catch (error) {
            console.error('Errore durante il login:', error);
            res.status(500).json({
                success: false,
                message: 'Errore durante il login'
            });
        }
    },

    // Ottenere profilo utente
    async getProfile(req, res) {
        try {
            const user = await User.findById(req.user.userId);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Utente non trovato'
                });
            }

            res.json({
                success: true,
                data: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    created_at: user.created_at,
                    updated_at: user.updated_at
                }
            });
        } catch (error) {
            console.error('Errore nel recupero del profilo:', error);
            res.status(500).json({
                success: false,
                message: 'Errore nel recupero del profilo utente'
            });
        }
    },

    // Aggiornare profilo utente
    async updateProfile(req, res) {
        try {
            const { username, email } = req.body;
            
            // Verifica se l'email è già utilizzata da un altro utente
            if (email) {
                const existingUser = await User.findByEmail(email);
                if (existingUser && existingUser.id !== req.user.userId) {
                    return res.status(400).json({
                        success: false,
                        message: 'Email già in uso'
                    });
                }
            }

            // Aggiorna l'utente
            const result = await User.update(req.user.userId, { username, email });
            
            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Utente non trovato'
                });
            }

            res.json({
                success: true,
                message: 'Profilo aggiornato con successo',
                data: { username, email }
            });
        } catch (error) {
            console.error('Errore durante l\'aggiornamento:', error);
            res.status(500).json({
                success: false,
                message: 'Errore durante l\'aggiornamento del profilo'
            });
        }
    },

    // Eliminare account utente
    async deleteAccount(req, res) {
        try {
            const result = await User.delete(req.user.userId);
            
            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Utente non trovato'
                });
            }

            res.json({
                success: true,
                message: 'Account eliminato con successo'
            });
        } catch (error) {
            console.error('Errore durante l\'eliminazione:', error);
            res.status(500).json({
                success: false,
                message: 'Errore durante l\'eliminazione dell\'account'
            });
        }
    }
};

module.exports = userController;