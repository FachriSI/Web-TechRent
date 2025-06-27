const sequelize = require('./index');
const User = require('./user');
const HP = require('./hp');
const Peminjaman = require('./peminjaman');
const Feedback = require('./feedback');

async function syncAndSeed() {
  try {
    await sequelize.authenticate();
    console.log('Koneksi ke database berhasil!');
    await sequelize.sync({ force: true });
    console.log('Tabel berhasil dibuat ulang.');

    // Seed HP saja
    await HP.bulkCreate([
      { nama: 'Samsung Galaxy A12', status: 'tersedia' },
      { nama: 'Xiaomi Redmi Note 10', status: 'tersedia' },
      { nama: 'OPPO A54', status: 'tersedia' },
      { nama: 'Realme C25', status: 'tersedia' },
      { nama: 'Vivo Y20', status: 'tersedia' },
    ]);

    console.log('Database seeded: hanya data HP.');

    // Seed User
    await User.bulkCreate([
      { username: 'admin', password: 'admin123', role: 'admin' },
      { username: 'user', password: '123', role: 'user' },
    ]);

    console.log('Database seeded: hanya data HP dan User.');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

syncAndSeed(); 