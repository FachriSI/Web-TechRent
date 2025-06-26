const express = require('express');
const router = express.Router();

router.get('/dashboard', (req, res) => {
  res.render('admin_dashboard');
});

module.exports = router;
