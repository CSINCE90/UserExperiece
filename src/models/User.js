const db = require('../config/database');

class User {
    static async create(userData) {
        const [result] = await db.execute(
            'INSERT INTO users (username, email, password, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())',
            [userData.username, userData.email, userData.password]
        );
        return result;
    }

    static async findByEmail(email) {
        const [rows] = await db.execute(
            'SELECT id, username, email, password, created_at, updated_at FROM users WHERE email = ?', 
            [email]
        );
        return rows[0];
    }

    static async findById(id) {
        const [rows] = await db.execute(
            'SELECT id, username, email, created_at, updated_at FROM users WHERE id = ?', 
            [id]
        );
        return rows[0];
    }

    static async update(id, userData) {
        const [result] = await db.execute(
            'UPDATE users SET username = ?, email = ?, updated_at = NOW() WHERE id = ?',
            [userData.username, userData.email, id]
        );
        return result;
    }

    static async delete(id) {
        const [result] = await db.execute(
            'DELETE FROM users WHERE id = ?', 
            [id]
        );
        return result;
    }

    static async findAll() {
        const [rows] = await db.execute(
            'SELECT id, username, email, created_at, updated_at FROM users'
        );
        return rows;
    }
}

module.exports = User;