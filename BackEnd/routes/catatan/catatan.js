const express = require('express');
const router = express.Router();
const verifyToken = require('../../auth/verifyToken');
const db = require('../../config/db')

router.get('/catatan', verifyToken, (req, res) => {
  
    db.query('SELECT * FROM catatan', (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ message: 'Terjadi kesalahan.' });
      }
      // if (results.length === 0) {
      //   return res.status(401).json({ message: 'Data Tidak ada' });
      // }
      return res.status(200).json({
        message : 'berhasil',
        data : results
      });
    });
  }
)

router.get('/catatan/:id', verifyToken, (req, res) => {
    const id  = req.params.id;
  
    db.query('SELECT * FROM catatan WHERE user_id = ?', [id], (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ message: 'Terjadi kesalahan.' });
      }
      // if (results.length === 0) {
      //   return res.status(401).json({ message: 'Data Tidak ada' });
      // }
      return res.status(200).json({
        message : 'berhasil',
        data : results
      });
    });
  }
)

router.post('/catatan', verifyToken, (req, res) => {
    const { title, body, date, user_id }  = req.body;
  
    db.query('INSERT INTO catatan VALUES(null, ?, ?, ?, ?) ', [title, body, date, user_id], (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ message: 'Terjadi kesalahan.' });
      }
      // if (results.length === 0) {
      //   return res.status(401).json({ message: 'Data Tidak ada' });
      // }
      return res.status(200).json({
        message : 'berhasil',
        data : results
      });
    });
  }
)

module.exports = router;