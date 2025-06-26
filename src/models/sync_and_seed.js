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

    // Seed user
    await User.bulkCreate([
      { username: 'admin', password: 'admin123', role: 'admin' },
      { username: 'user', password: '123', role: 'user' },
    ]);
    // Seed HP
    await HP.bulkCreate([
      { nama: 'Samsung Galaxy A12', status: 'tersedia' },
      { nama: 'Xiaomi Redmi Note 10', status: 'dipinjam' },
      { nama: 'OPPO A54', status: 'tersedia' },
    ]);
    // Seed peminjaman dummy
    await Peminjaman.create({
      userId: 2, // user
      hpId: 2, // Xiaomi Redmi Note 10
      tanggal: '2024-07-01',
      status: 'pending',
    });

    console.log('Database synced & seeded!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

syncAndSeed(); 