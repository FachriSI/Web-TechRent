const express = require('express');
const path = require('path');
const session = require('express-session');
const app = express();
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');
const HP = require('./models/hp');
const authRoutes = require('./routes/auth');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'secret-key-hp',
  resave: false,
  saveUninitialized: false,
}));

app.get('/', (req, res) => {
  if (!req.session.userId) return res.redirect('/login');
  return res.redirect('/user/dashboard');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.use('/user', userRoutes);
app.use('/admin', adminRoutes);
app.use(authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
