const express = require('express');
const router = express.Router();

router.get('/dashboard', (req, res) => {
  res.render('index');
});

router.get('/form-peminjaman', (req, res) => {
  res.render('form_peminjaman');
});

router.post('/form-peminjaman', (req, res) => {
  res.send('<script>alert("Pengajuan berhasil!"); window.location.href="/user/dashboard";</script>');
});

router.get('/data-peminjaman', (req, res) => {
  res.render('data_peminjaman');
});

router.post('/batalkan-peminjaman', (req, res) => {
  res.send('<script>alert("Peminjaman berhasil dibatalkan!"); window.location.href=\"/user/data-peminjaman\";</script>');
});

module.exports = router;
