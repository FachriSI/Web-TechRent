const express = require('express');
const router = express.Router();
const Peminjaman = require('../models/peminjaman');
const HP = require('../models/hp');
const User = require('../models/user');
const { Op } = require('sequelize');
const Feedback = require('../models/feedback');

// Dashboard ringkas (statistik)
router.get('/dashboard', async (req, res) => {
  try {
    const totalUser = await User.count({ where: { role: 'user' } });
    const totalHP = await HP.count();
    const totalDipinjam = await HP.count({ where: { status: 'dipinjam' } });
    const totalPeminjaman = await Peminjaman.count();
    res.render('admin_dashboard', { statistik: { totalUser, totalHP, totalDipinjam, totalPeminjaman } });
  } catch (err) {
    res.status(500).send('Gagal mengambil data statistik');
  }
});

// Manajemen peminjaman
router.get('/peminjaman', async (req, res) => {
  try {
    // Otomatis update status 'disetujui' yang sudah lewat jatuh tempo menjadi 'terlambat'
    const today = new Date().toISOString().slice(0, 10);
    await Peminjaman.update(
      { status: 'terlambat' },
      {
        where: {
          status: 'disetujui',
          tanggal_kembali: { [Op.lt]: today },
        },
      }
    );
    // Ambil data terbaru
    const daftarPeminjaman = await Peminjaman.findAll({
      include: [
        { model: HP, as: 'hp', attributes: ['nama'] },
        { model: User, as: 'user', attributes: ['username'] }
      ],
      order: [['tanggal', 'DESC']]
    });
    res.render('admin_peminjaman', { daftarPeminjaman });
  } catch (err) {
    res.status(500).send('Gagal mengambil data peminjaman');
  }
});

// Approve peminjaman
router.post('/approve-peminjaman', async (req, res) => {
  try {
    const { id } = req.body;
    const peminjaman = await Peminjaman.findByPk(id);
    if (!peminjaman || peminjaman.status !== 'pending') {
      return res.send('<script>alert("Tidak bisa approve peminjaman ini!"); window.location.href="/admin/dashboard";</script>');
    }
    peminjaman.status = 'disetujui';
    await peminjaman.save();
    res.redirect('/admin/dashboard');
  } catch (err) {
    res.status(500).send('Gagal approve peminjaman');
  }
});

// Reject peminjaman
router.post('/reject-peminjaman', async (req, res) => {
  try {
    const { id } = req.body;
    const peminjaman = await Peminjaman.findByPk(id);
    if (!peminjaman || peminjaman.status !== 'pending') {
      return res.send('<script>alert("Tidak bisa reject peminjaman ini!"); window.location.href="/admin/dashboard";</script>');
    }
    peminjaman.status = 'ditolak';
    await peminjaman.save();
    // Update status HP jadi tersedia
    const hp = await HP.findByPk(peminjaman.hpId);
    if (hp) {
      hp.status = 'tersedia';
      await hp.save();
    }
    res.redirect('/admin/dashboard');
  } catch (err) {
    res.status(500).send('Gagal reject peminjaman');
  }
});

// Setujui pengembalian
router.post('/approve-return', async (req, res) => {
  try {
    const { id } = req.body;
    const peminjaman = await Peminjaman.findByPk(id);
    if (!peminjaman || peminjaman.status !== 'dikembalikan') {
      return res.send('<script>alert("Tidak bisa approve pengembalian ini!"); window.location.href="/admin/dashboard";</script>');
    }
    peminjaman.status = 'selesai';
    await peminjaman.save();
    // Update status HP jadi tersedia
    const hp = await HP.findByPk(peminjaman.hpId);
    if (hp) {
      hp.status = 'tersedia';
      await hp.save();
    }
    res.redirect('/admin/dashboard');
  } catch (err) {
    res.status(500).send('Gagal approve pengembalian');
  }
});

// Mark as dikembalikan
router.post('/mark-dikembalikan', async (req, res) => {
  try {
    const { id } = req.body;
    const peminjaman = await Peminjaman.findByPk(id);
    if (!peminjaman || peminjaman.status !== 'disetujui') {
      return res.send('<script>alert("Tidak bisa update status peminjaman ini!"); window.location.href="/admin/peminjaman";</script>');
    }
    peminjaman.status = 'dikembalikan';
    await peminjaman.save();
    // Update status HP jadi tersedia
    const hp = await HP.findByPk(peminjaman.hpId);
    if (hp) {
      hp.status = 'tersedia';
      await hp.save();
    }
    res.redirect('/admin/peminjaman');
  } catch (err) {
    res.status(500).send('Gagal update status peminjaman');
  }
});

// Mark as terlambat
router.post('/mark-terlambat', async (req, res) => {
  try {
    const { id } = req.body;
    const peminjaman = await Peminjaman.findByPk(id);
    if (!peminjaman || peminjaman.status !== 'disetujui') {
      return res.send('<script>alert("Tidak bisa update status peminjaman ini!"); window.location.href="/admin/peminjaman";</script>');
    }
    peminjaman.status = 'terlambat';
    await peminjaman.save();
    res.redirect('/admin/peminjaman');
  } catch (err) {
    res.status(500).send('Gagal update status peminjaman');
  }
});

// Manajemen feedback admin
router.get('/feedback', async (req, res) => {
  try {
    const feedbacks = await Feedback.findAll({
      include: [
        { model: User, as: 'user', attributes: ['username'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.render('admin_feedback', { feedbacks });
  } catch (err) {
    res.status(500).send('Gagal mengambil data feedback');
  }
});

// Approve feedback
router.post('/feedback/approve', async (req, res) => {
  try {
    const { id } = req.body;
    const feedback = await Feedback.findByPk(id);
    if (!feedback) return res.redirect('/admin/feedback');
    feedback.status = 'approved';
    await feedback.save();
    res.redirect('/admin/feedback');
  } catch (err) {
    res.status(500).send('Gagal approve feedback');
  }
});

// Reject feedback
router.post('/feedback/reject', async (req, res) => {
  try {
    const { id } = req.body;
    const feedback = await Feedback.findByPk(id);
    if (!feedback) return res.redirect('/admin/feedback');
    feedback.status = 'rejected';
    await feedback.save();
    res.redirect('/admin/feedback');
  } catch (err) {
    res.status(500).send('Gagal reject feedback');
  }
});

// Delete feedback
router.post('/feedback/delete', async (req, res) => {
  try {
    const { id } = req.body;
    const feedback = await Feedback.findByPk(id);
    if (!feedback) return res.redirect('/admin/feedback');
    await feedback.destroy();
    res.redirect('/admin/feedback');
  } catch (err) {
    res.status(500).send('Gagal hapus feedback');
  }
});

module.exports = router;
