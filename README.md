# TechRent - Situs Peminjaman HP

## Fitur
- Login user & admin
- Daftar HP dinamis
- Form peminjaman, riwayat, feedback

## Instalasi
1. Clone repo ini
2. `npm install`
3. Setup database MySQL:
   - Buat database: `techrent_db`
   - (Opsional) Import file backup.sql jika ada, atau jalankan:
     `node src/models/sync_and_seed.js`
4. Edit `src/models/index.js` jika perlu (user/password DB)
5. Jalankan aplikasi:
   - `node src/app.js`
6. Akses di browser: [http://localhost:3000](http://localhost:3000)

## Akun Demo
- User: `user` / `123`
- Admin: `admin` / `admin123`
