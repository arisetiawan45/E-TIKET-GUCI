// pages/DashboardPage.js
import Pemesanan from '../components/Pemesanan';
import Transaksi from '../components/Transaksi';
import AdminPage from './AdminPage';
import PimpinanPage from './PimpinanPage';

export default function DashboardPage() {
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
  
  // --- Navigasi menggunakan <a> dengan Pengecekan Peran ---
  // PERBAIKAN: Link Admin dan Pimpinan hanya muncul jika pengguna memiliki peran yang sesuai.
  nav.innerHTML = `
    <a href="#/dashboard/pesan" class="nav-link" style="margin: 0 10px;">Pesan Tiket</a>
    <a href="#/dashboard/transaksi" class="nav-link" style="margin: 0 10px;">Lihat Transaksi</a>
    ${userRoles.includes('admin') ? `<a href="#/dashboard/admin" class="nav-link" style="margin: 0 10px;">Halaman Admin</a>` : ''}
    ${userRoles.includes('pimpinan') ? `<a href="#/dashboard/pimpinan" class="nav-link" style="margin: 0 10px;">Halaman Pimpinan</a>` : ''}
  `;
  
  // --- SUB-ROUTER untuk konten di dalam Dashboard ---
  const renderSubPage = () => {
    // PERBAIKAN: Halaman default dikembalikan ke 'pesan' untuk pengguna biasa.
    const subpath = window.location.hash.split('/')[2] || 'pesan';
    
    contentArea.innerHTML = ''; // Kosongkan konten

    switch(subpath) {
      case 'pesan':
        const navigateToTransaksi = () => window.location.hash = '#/dashboard/transaksi';
        contentArea.appendChild(Pemesanan(navigateToTransaksi));
        break;
      case 'transaksi':
        contentArea.appendChild(Transaksi());
        break;
      case 'admin':
        // PERBAIKAN: Menambahkan kembali pengecekan peran.
        if (userRoles.includes('admin')) {
          contentArea.appendChild(AdminPage());
        } else {
          // Jika pengguna biasa mencoba akses, arahkan ke halaman default.
          contentArea.innerHTML = `<p>Akses ditolak. Anda bukan admin.</p>`;
          window.location.hash = '#/dashboard/pesan';
        }
        break;
      case 'pimpinan':
        // PERBAIKAN: Menambahkan kembali pengecekan peran.
        if (userRoles.includes('pimpinan')) {
          contentArea.appendChild(PimpinanPage());
        } else {
          contentArea.innerHTML = `<p>Akses ditolak. Anda bukan pimpinan.</p>`;
          window.location.hash = '#/dashboard/pesan';
        }
        break;
      default:
        // Jika sub-rute tidak ditemukan, kembali ke halaman default.
        window.location.hash = '#/dashboard/pesan';
        break;
    }
  };

  // Dengarkan perubahan hash untuk menavigasi antar sub-halaman
  window.addEventListener('hashchange', renderSubPage);

  // Render halaman default saat Dashboard pertama kali dimuat
  renderSubPage();
  
  // Event listener untuk tombol logout tetap sama
  div.querySelector('#logoutBtn').addEventListener('click', () => {
    netlifyIdentity.logout();
  });

  return div;
}
