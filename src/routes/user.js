const express = require('express');
const router = express.Router();
const HP = require('../models/hp');
const Peminjaman = require('../models/peminjaman');
const User = require('../models/user');
const Feedback = require('../models/feedback');

// Middleware proteksi route user
router.use((req, res, next) => {
  if (!req.session.userId) return res.redirect('/login');
  next();
});

router.get('/dashboard', (req, res) => {
  res.render('user_dashboard', { activePage: 'dashboard' });
});

router.get('/form-peminjaman', async (req, res) => {
  if (!req.session.userId) return res.redirect('/login');
  try {
    const daftarHP = await HP.findAll({ where: { status: 'tersedia' } });
    res.render('form_peminjaman', { daftarHP, activePage: 'hp' });
  } catch (err) {
    res.status(500).send('Gagal mengambil data HP');
  }
});

router.post('/form-peminjaman', async (req, res) => {
  if (!req.session.userId) return res.redirect('/login');
  try {
    const { nama, tanggal, hp } = req.body;
    const hpDipilih = await HP.findOne({ where: { nama: hp, status: 'tersedia' } });
    if (!hpDipilih) {
      return res.send('<script>alert("HP tidak tersedia!"); window.location.href="/user/form-peminjaman";</script>');
    }
    await Peminjaman.create({
      userId: req.session.userId,
      hpId: hpDipilih.id,
      tanggal,
      status: 'pending',
    });
    await hpDipilih.update({ status: 'dipinjam' });
    res.send('<script>alert("Pengajuan berhasil!"); window.location.href="/user/dashboard";</script>');
  } catch (err) {
    res.status(500).send('Gagal memproses peminjaman');
  }
});

router.get('/data-peminjaman', async (req, res) => {
  if (!req.session.userId) return res.redirect('/login');
  try {
    const daftarPeminjaman = await Peminjaman.findAll({
      where: { userId: req.session.userId },
      include: [{ model: HP, as: 'hp', attributes: ['nama'] }],
      order: [['tanggal', 'DESC']]
    });
    res.render('data_peminjaman', { daftarPeminjaman, activePage: 'riwayat' });
  } catch (err) {
    res.status(500).send('Gagal mengambil data peminjaman');
  }
});

router.post('/batalkan-peminjaman', async (req, res) => {
  try {
    const { id } = req.body;
    const peminjaman = await Peminjaman.findOne({ where: { id, userId: req.session.userId } });
    if (!peminjaman || peminjaman.status !== 'pending') {
      return res.send('<script>alert("Tidak bisa membatalkan peminjaman ini!"); window.location.href="/user/data-peminjaman";</script>');
    }
    // Update status peminjaman
    peminjaman.status = 'ditolak';
    await peminjaman.save();
    // Update status HP jadi tersedia
    const hp = await HP.findByPk(peminjaman.hpId);
    if (hp) {
      hp.status = 'tersedia';
      await hp.save();
    }
    res.send('<script>alert("Peminjaman berhasil dibatalkan!"); window.location.href="/user/data-peminjaman";</script>');
  } catch (err) {
    res.status(500).send('Gagal membatalkan peminjaman');
  }
});

router.post('/selesai-peminjaman', async (req, res) => {
  if (!req.session.userId) return res.redirect('/login');
  try {
    const { id } = req.body;
    const peminjaman = await Peminjaman.findOne({ where: { id, userId: req.session.userId } });
    if (!peminjaman || peminjaman.status !== 'disetujui') {
      return res.send('<script>alert("Tidak bisa menyelesaikan peminjaman ini!"); window.location.href="/user/data-peminjaman";</script>');
    }
    // Update status peminjaman
    peminjaman.status = 'selesai';
    await peminjaman.save();
    // Update status HP jadi tersedia
    const hp = await HP.findByPk(peminjaman.hpId);
    if (hp) {
      hp.status = 'tersedia';
      await hp.save();
    }
    res.send('<script>alert("Peminjaman selesai!"); window.location.href="/user/data-peminjaman";</script>');
  } catch (err) {
    res.status(500).send('Gagal menyelesaikan peminjaman');
  }
});

// Menu feedback
router.get('/feedback', (req, res) => {
  res.render('feedback_menu', { activePage: 'feedback' });
});

// Form feedback baru
router.get('/feedback/new', (req, res) => {
  res.render('feedback_form', { activePage: 'feedback', feedback: null });
});

// Simpan feedback baru
router.post('/feedback/new', async (req, res) => {
  try {
    const { comment, phone_number } = req.body;
    await Feedback.create({
      user_id: req.session.userId,
      comment,
      phone_number,
      type: 'website',
      status: 'pending',
    });
    res.redirect('/user/feedback/list');
  } catch (err) {
    res.status(500).send('Gagal mengirim feedback');
  }
});

// Daftar feedback user
router.get('/feedback/list', async (req, res) => {
  try {
    const feedbacks = await Feedback.findAll({ where: { user_id: req.session.userId }, order: [['createdAt', 'DESC']] });
    res.render('feedback_list', { feedbacks, activePage: 'feedback' });
  } catch (err) {
    res.status(500).send('Gagal mengambil data feedback');
  }
});

// Edit feedback
router.get('/feedback/edit/:id', async (req, res) => {
  try {
    const feedback = await Feedback.findOne({ where: { id: req.params.id, user_id: req.session.userId, status: 'pending' } });
    if (!feedback) return res.redirect('/user/feedback/list');
    res.render('feedback_form', { feedback, activePage: 'feedback' });
  } catch (err) {
    res.status(500).send('Gagal mengambil data feedback');
  }
});

// Update feedback
router.post('/feedback/edit/:id', async (req, res) => {
  try {
    const { comment, phone_number } = req.body;
    const feedback = await Feedback.findOne({ where: { id: req.params.id, user_id: req.session.userId, status: 'pending' } });
    if (!feedback) return res.redirect('/user/feedback/list');
    feedback.comment = comment;
    feedback.phone_number = phone_number;
    await feedback.save();
    res.redirect('/user/feedback/list');
  } catch (err) {
    res.status(500).send('Gagal update feedback');
  }
});

// Hapus feedback
router.post('/feedback/delete/:id', async (req, res) => {
  try {
    const feedback = await Feedback.findOne({ where: { id: req.params.id, user_id: req.session.userId, status: 'pending' } });
    if (!feedback) return res.redirect('/user/feedback/list');
    await feedback.destroy();
    res.redirect('/user/feedback/list');
  } catch (err) {
    res.status(500).send('Gagal hapus feedback');
  }
});

router.get('/hp', async (req, res) => {
  try {
    const daftarHP = await HP.findAll();
    res.render('user_hp', { daftarHP, activePage: 'hp' });
  } catch (err) {
    res.status(500).send('Gagal mengambil data HP');
  }
});

module.exports = router;
