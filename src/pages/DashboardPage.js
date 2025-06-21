// pages/DashboardPage.js
import { Pemesanan } from '../components/Pemesanan';
import { Transaksi } from '../components/Transaksi';
import { AdminPage } from './AdminPage';
// ...impor komponen lain yang relevan

export function DashboardPage() {
  const div = document.createElement('div');
  const user = netlifyIdentity.currentUser();
  const userRoles = user?.app_metadata?.roles || []; // Dapatkan peran pengguna

  // Tampilkan pesan selamat datang dan tombol logout
  div.innerHTML = `
    <header style="display: flex; justify-content: space-between; align-items: center; padding: 20px; background-color: #f0f0f0;">
      <div>
          <h3>Selamat Datang, ${user.user_metadata.full_name || user.email}</h3>
          <small>Peran: ${userRoles.join(', ') || 'pengunjung'}</small>
      </div>
      <button id="logoutBtn" style="padding: 8px 15px;">Logout</button>
    </header>
    <nav id="main-nav" style="padding: 20px; text-align: center;"></nav>
    <main id="content" style="padding: 20px;"></main>
  `;
  
  const nav = div.querySelector('#main-nav');

  // --- Buat Tombol Navigasi Berdasarkan Peran ---

  // Tombol untuk semua peran yang sudah login
  const tombolPemesanan = document.createElement('button');
  tombolPemesanan.textContent = 'Pesan Tiket';
  tombolPemesanan.onclick = () => { /* Logika tampilkan pemesanan */ };
  nav.appendChild(tombolPemesanan);

  // Tombol yang hanya bisa dilihat oleh 'admin'
  if (userRoles.includes('admin')) {
    const tombolAdmin = document.createElement('button');
    tombolAdmin.textContent = 'Halaman Admin';
    tombolAdmin.style.marginLeft = '10px';
    tombolAdmin.onclick = () => { /* Logika tampilkan halaman admin */ };
    nav.appendChild(tombolAdmin);
  }

  // Tombol yang hanya bisa dilihat oleh 'pimpinan'
  if (userRoles.includes('pimpinan')) {
      const tombolPimpinan = document.createElement('button');
      tombolPimpinan.textContent = 'Halaman Pimpinan';
      tombolPimpinan.style.marginLeft = '10px';
      tombolPimpinan.onclick = () => { /* Logika tampilkan halaman pimpinan */ };
      nav.appendChild(tombolPimpinan);
  }

  // Event listener untuk tombol logout
  div.querySelector('#logoutBtn').addEventListener('click', () => {
    netlifyIdentity.logout();
  });

  return div;
}