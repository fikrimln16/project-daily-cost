const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = express.Router();
const db = require('../config/db')

router.post('/', (req, res) => {
    const { email, password } = req.body;

    // Ambil user dari database berdasarkan email
    db.query('SELECT * FROM users WHERE email = ?', [email], (error, results) => {
    if (error) {
        console.error(error);
        return res.status(500).json({ message: 'Terjadi kesalahan saat login.' });
    }

    if (results.length === 0) {
        return res.status(401).json({ message: 'Email atau password salah.' });
    }

    // Bandingkan password yang diinputkan dengan password di database
    bcrypt.compare(password, results[0].password, (error, match) => {
        if (error) {
        console.error(error);
        return res.status(500).json({ message: 'Terjadi kesalahan saat login.' });
        }

        if (!match) {
        return res.status(401).json({ message: 'Email atau password salah.' });
        }

        const id = {
        "id" : results[0].id
        }

        // Buat token JWT
        const token = jwt.sign({ id: results[0].id, email: results[0].email }, 'rahasia', { expiresIn: '1h' });
        return res.status(200).json({ message: 'Login berhasil.', token, data: id });
    });
    });
})

module.exports = router;
