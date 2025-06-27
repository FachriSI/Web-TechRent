const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username, password } });
    if (!user) {
      return res.send('<script>alert("Login gagal! Cek username dan password."); window.location.href="/login";</script>');
    }
    req.session.userId = user.id;
    req.session.role = user.role;
    if (user.role === 'admin') {
      return res.redirect('/admin/dashboard');
    } else {
      return res.redirect('/user/dashboard');
    }
  } catch (err) {
    res.status(500).send('Terjadi kesalahan saat login');
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

module.exports = router;
