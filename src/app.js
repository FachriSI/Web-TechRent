const express = require('express');
const path = require('path');
const app = express();
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', (req, res) => {
  const { username, password, role } = req.body;
  if (role === 'user' && username === 'user' && password === '123') {
    return res.redirect('/user/dashboard');
  }
  if (role === 'admin' && username === 'admin' && password === 'admin123') {
    return res.redirect('/admin/dashboard');
  }
  // Jika login gagal, kembali ke login dengan pesan error sederhana
  res.send('<script>alert("Username atau password salah!"); window.location.href="/";</script>');
});

app.use('/user', userRoutes);
app.use('/admin', adminRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
