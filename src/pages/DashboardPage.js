// pages/DashboardPage.js
import { Pemesanan } from '../components/Pemesanan';
import { Transaksi } from '../components/Transaksi';
import { AdminPage } from './AdminPage';
import { PimpinanPage } from './PimpinanPage';

export function DashboardPage() {
  const div = document.createElement('div');
  const user = netlifyIdentity.currentUser();
  const userRoles = user?.app_metadata?.roles || [];

  div.innerHTML = `
    <header style="display: flex; justify-content: space-between; align-items: center; padding: 20px; background-color: #f0f0f0;">
      <div>
          <h3>Selamat Datang, ${user.user_metadata.full_name || user.email}</h3>
          <small>Peran: ${userRoles.join(', ') || 'pengunjung'}</small>
      </div>
      <button id="logoutBtn" style="padding: 8px 15px;">Logout</button>
    </header>
    <nav id="main-nav" style="padding: 20px; text-align: center; border-bottom: 1px solid #ccc;"></nav>
    <main id="content" style="padding: 20px;"></main>
  `;
  
  const nav = div.querySelector('#main-nav');
  const contentArea = div.querySelector('#content');

  // Fungsi ini bertugas mengganti konten di <main>
  const renderContent = (pageComponent) => {
    contentArea.innerHTML = '';
    contentArea.appendChild(pageComponent);
  };
  
  // --- Tombol Navigasi ---

  // Tombol untuk 'Pesan Tiket'
  const tombolPemesanan = document.createElement('button');
  tombolPemesanan.textContent = 'Pesan Tiket';
  // Saat diklik, panggil renderContent untuk menampilkan halaman Pemesanan
  tombolPemesanan.onclick = () => {
    renderContent(Pemesanan(renderContent));
  };
  nav.appendChild(tombolPemesanan);

  // Tombol untuk 'Lihat Transaksi'
  const tombolTransaksi = document.createElement('button');
  tombolTransaksi.textContent = 'Lihat Transaksi';
  tombolTransaksi.style.marginLeft = '10px';
  // Saat diklik, panggil renderContent untuk menampilkan halaman Transaksi
  tombolTransaksi.onclick = () => {
    renderContent(Transaksi());
  };
  nav.appendChild(tombolTransaksi);

  // Tombol Admin (berdasarkan peran)
  if (userRoles.includes('admin')) {
    const tombolAdmin = document.createElement('button');
    tombolAdmin.textContent = 'Halaman Admin';
    tombolAdmin.style.marginLeft = '10px';
    tombolAdmin.onclick = () => renderContent(AdminPage());
    nav.appendChild(tombolAdmin);
  }

  // Tombol Pimpinan (berdasarkan peran)
  if (userRoles.includes('pimpinan')) {
      const tombolPimpinan = document.createElement('button');
      tombolPimpinan.textContent = 'Halaman Pimpinan';
      tombolPimpinan.style.marginLeft = '10px';
      tombolPimpinan.onclick = () => renderContent(PimpinanPage());
      nav.appendChild(tombolPimpinan);
  }

  // Event listener untuk tombol logout
  div.querySelector('#logoutBtn').addEventListener('click', () => {
    netlifyIdentity.logout();
  });
  
  // Menampilkan halaman Pemesanan secara default saat Dasbor pertama kali dimuat
  renderContent(Pemesanan(renderContent));

  return div;
}