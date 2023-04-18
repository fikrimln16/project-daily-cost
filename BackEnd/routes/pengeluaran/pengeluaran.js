const express = require('express');
const router = express.Router();
const verifyToken = require('../../auth/verifyToken');
const db = require('../../config/db')


router.get('/pengeluaran/:id', verifyToken, (req, res) => {
    const  id   = req.params.id;

    db.query('SELECT nama, tanggal, jumlah, pembayaran FROM pengeluaran WHERE user_id = ? ', [id], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: 'Terjadi kesalahan.' });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: 'Data Tidak ada' });
        }

        return res.status(200).json({
            results
        });
    });
})

router.get('/pengeluaran/:id/list/:tanggal', verifyToken, (req, res) => {
    const id = req.params.id;
    const tanggal = req.params.tanggal;
    db.query(`SELECT nama, tanggal, jumlah, pembayaran FROM pengeluaran WHERE user_id = ${id} && tanggal BETWEEN "${tanggal} 00:00:00" AND "${tanggal} 23:59:59"`, (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: 'Terjadi kesalahan.' });
        }
      // if (results.length === 0) {
      //   return res.status(401).json({ message: 'Data Tidak ada', print: tanggal });
      // }
        return res.status(200).json({
            results
        });
    });
})

module.exports = router;