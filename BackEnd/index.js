const express = require('express');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(express.json());

app.use(cors({
  origin: '*', // allow requests from this origin
  methods: ['GET', 'POST'] // allow only these HTTP methods
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// Konfigurasi database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'bangkit'
});

// Membuat tabel users jika belum ada
db.query(`CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
)`, (error) => {
  if (error) {
    console.error(error);
  } else {
    console.log('Tabel users telah dibuat atau sudah ada.');
  }
});

function verifyToken(req, res, next) {
  // Mendapatkan header authorization dari request
  const authHeader = req.headers['authorization'];
  // Mendapatkan token dari header authorization
  const token = authHeader && authHeader.split(' ')[1];
  // Jika token tidak ada, kirim respons dengan status 401 dan pesan 'Token tidak tersedia'
  if (!token) {
    return res.status(401).json({ message: 'Token tidak tersedia' });
  }
  // Memverifikasi token dengan menggunakan secret key
  jwt.verify(token, 'rahasia', (err, decoded) => {
    // Jika terdapat error saat memverifikasi token, kirim respons dengan status 403 dan pesan 'Token tidak valid'
    if (err) {
      return res.status(403).json({ message: 'Token tidak valid' });
    }

    // Menyimpan decoded token ke dalam objek req.user
    req.user = decoded;

    // Melanjutkan proses request
    next();
  });
}

// Endpoint register
app.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const query = `INSERT INTO users (name, email, password) VALUES ('${name}', '${email}', '${hashedPassword}')`;

  db.query(query, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send('Error registering user!');
    } else {
      const token = jwt.sign({ email }, 'rahasia');
      db.query('SELECT id FROM users WHERE email = ?', [email], (err, results) => {
        if (err) {
          console.log(err);
          res.status(500).send('Error registering user!');
        } else {
          const id = {
            id: results[0].id
          }
          return res.status(200).json({
            message : "Berhasil",
            token,
            data: id
          })
        }
      });
    }
  });

});

// Endpoint login
app.post('/login', (req, res) => {
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
});


app.get('/user/saldo/:id', verifyToken, (req, res) => {
  const id = req.params.id;

  db.query('SELECT uang_gopay, uang_cash, uang_rekening FROM tabungan WHERE id = ?', [id], (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ message: 'Terjadi kesalahan.' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Data tidak ada!' });
    }

    return res.status(200).json({
      results
    });
  });
});

app.post('/user/newdepo', verifyToken, (req, res) => {
  const { id, uang_gopay, uang_cash, uang_rekening } = req.body;

  db.query('INSERT INTO tabungan VALUES (?,?,?,?)', [id, uang_gopay, uang_cash, uang_rekening], (error, results) => {
    if (error) {
      console.error(error);
      return res.status(501).json({ message: 'Terjadi kesalahan.' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Data tidak ada!' });
    }

    const saldoUser = {
      "uang_gopay" : uang_gopay,
      "uang_cash" : uang_cash,
      "uang_rekening" : uang_rekening
    }

    return res.status(200).json({
      message:"Berhasil mengubah saldo",
      data: saldoUser
    })
  })
})


app.post('/user/id', verifyToken, (req, res) => {
  const email  = req.body;

  db.query('SELECT * FROM users WHERE email = ? ', [email], (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ message: 'Terjadi kesalahan.' });
    }

    // if (results.length === 0) {
    //   return res.status(401).json({ message: 'Data Tidak ada' });
    // }

    return res.status(200).json({
      results
    });
  });
})

app.post('/user/belanja', verifyToken, (req, res) => {
  const { nama, tanggal, jumlah, pembayaran, user_id }  = req.body;

  db.query('INSERT INTO pengeluaran VALUES(null, ?, ?, ?, ?, ?) ', [nama, tanggal, jumlah, pembayaran, user_id], (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ message: 'Terjadi kesalahan.' });
    }

    db.query(`SELECT uang_gopay, uang_cash, uang_rekening FROM tabungan WHERE id = ${user_id}`, (error, results) => {

      if (error) {
        console.error(error);
        return res.status(500).json({ message: 'Terjadi kesalahan.' });
      }

      const uang_gopay = results[0].uang_gopay;
      const uang_cash = results[0].uang_cash;
      const uang_rekening = results[0].uang_rekening;
      if (pembayaran == "GOPAY"){
        const uang_gopay_update = uang_gopay - jumlah
        db.query(`UPDATE tabungan SET uang_gopay = ${uang_gopay_update} WHERE id = ${user_id}`, (error, results) => {
          if (error) {
            console.error(error);
            return res.status(500).json({ message: 'Terjadi kesalahan.' });
          }

          return res.status(200).json({ message: 'Berhasil Membeli Barang!', results });
        })
      } else if (pembayaran == "REKENING"){
        const uang_rekening_update = uang_rekening - jumlah
        db.query(`UPDATE tabungan SET uang_rekening = ${uang_rekening_update} WHERE id = ${user_id}`, (error, results) => {
          if (error) {
            console.error(error);
            return res.status(500).json({ message: 'Terjadi kesalahan.' });
          }

          return res.status(200).json({ message: 'Berhasil Membeli Barang!', results });
        })
      } else if (pembayaran == "CASH"){
        const uang_cash_update = uang_cash - jumlah
        db.query(`UPDATE tabungan SET uang_cash = ${uang_cash_update} WHERE id = ${user_id}`, (error, results) => {
          if (error) {
            console.error(error);
            return res.status(500).json({ message: 'Terjadi kesalahan.' });
          }

          return res.status(200).json({ message: 'Berhasil Membeli Barang!', results });
        })
      }
    })
    // if (results.length === 0) {
    //   return res.status(401).json({ message: 'Data Tidak ada' });
    // }
  });
})

app.get('/user/pengeluaran/:id', verifyToken, (req, res) => {
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

app.get('/user/pengeluaran/:id/list/:tanggal', verifyToken, (req, res) => {
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

// Jalankan server
app.listen(5000, () => {
  console.log('Server berjalan pada http://localhost:5000');
});
