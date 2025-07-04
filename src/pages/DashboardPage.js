// pages/DashboardPage.js
import Pemesanan from '../components/Pemesanan';
import Transaksi from '../components/Transaksi';
import AdminPage from './AdminPage';
import PimpinanPage from './PimpinanPage';
import Dashboard from '../components/Dashboard';

export default function DashboardPage() {
  const div = document.createElement('div');
  const user = netlifyIdentity.currentUser();
  const userRoles = user?.app_metadata?.roles || [];
  const isPengunjung = !userRoles.includes('admin') && !userRoles.includes('pimpinan');

  div.innerHTML = `
    <style>
      .dashboard-layout { display: flex; flex-direction: column; min-height: 100vh; background-color: #f4f7f6; }
      .dashboard-header { display: flex; justify-content: space-between; align-items: center; padding: 1rem 2rem; background-color: #ffffff; border-bottom: 1px solid #e0e0e0; }
      .dashboard-header .user-info h3 { margin: 0; font-size: 1.1rem; }
      .dashboard-header .user-info small { color: #666; font-size: 0.85rem; }
      #logoutBtn { padding: 8px 16px; font-size: 0.9rem; background-color: #dc3545; color: white; border: none; border-radius: 5px; cursor: pointer; }
      .dashboard-nav { background-color: #ffffff; padding: 0 2rem; border-bottom: 1px solid #e0e0e0; box-shadow: 0 2px 4px rgba(0,0,0,0.02); }
      .dashboard-nav .nav-links { display: flex; gap: 10px; flex-wrap: wrap; }
      .dashboard-nav .nav-link { padding: 15px 20px; text-decoration: none; color: #555; font-weight: 500; border-bottom: 3px solid transparent; }
      .dashboard-nav .nav-link.active { color: #007bff; border-bottom-color: #007bff; }
      .dashboard-content { padding: 20px 40px; flex-grow: 1; }
      @media (max-width: 768px) {
        .dashboard-header { flex-direction: column; gap: 10px; text-align: center; }
        .dashboard-nav { padding: 0 10px; }
        .dashboard-nav .nav-links { justify-content: center; }
        .dashboard-nav .nav-link { padding: 12px 8px; font-size: 0.85rem; }
        .dashboard-content { padding: 15px; }
      }
    </style>
    <div class="dashboard-layout">
      <header class="dashboard-header">
        <div class="user-info">
          <h3>${user.user_metadata.full_name || user.email}</h3>
          <small>Peran: ${userRoles.join(', ') || 'Pengunjung'}</small>
        </div>
        <button id="logoutBtn">Logout</button>
      </header>
      <nav id="main-nav" class="dashboard-nav">
        <div class="nav-links"></div>
      </nav>
      <main id="content" class="dashboard-content"></main>
    </div>
  `;

  const navLinksContainer = div.querySelector('.nav-links');
  const contentArea = div.querySelector('#content');
  
  let navHTML = '';
  if (isPengunjung) {
    navHTML += `<a href="#/dashboard/home" class="nav-link">Beranda</a>`;
    navHTML += `<a href="#/dashboard/pesan" class="nav-link">Pesan Tiket</a>`;
    navHTML += `<a href="#/dashboard/transaksi" class="nav-link">Riwayat Transaksi</a>`;
  }
  if (userRoles.includes('admin')) {
    navHTML += `<a href="#/dashboard/admin" class="nav-link">Kelola Situs</a>`;
  }
  if (userRoles.includes('pimpinan')) {
    navHTML += `<a href="#/dashboard/pimpinan" class="nav-link">Laporan</a>`;
  }
  
  navHTML += `<a href="#/tutorial" class="nav-link">Tutorial</a>`;
  navHTML += `<a href="#/tanya-jawab" class="nav-link">Tanya Jawab</a>`;
  navHTML += `<a href="#/kontak" class="nav-link">Kontak</a>`;
  navHTML += `<a href="#/tentang-kami" class="nav-link">Tentang Kami</a>`;

  navLinksContainer.innerHTML = navHTML;
  
  const renderSubPage = () => {
    let defaultSubpath = isPengunjung ? 'home' : (userRoles.includes('admin') ? 'admin' : 'pimpinan');
    const path = window.location.hash.split('/');
    const mainPath = path[1];
    const subpath = path[2] || defaultSubpath;
    
    div.querySelectorAll('.nav-link').forEach(link => {
      const linkPath = new URL(link.href).hash;
      if (linkPath === `#/${mainPath}/${subpath}` || linkPath === `#/${mainPath}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    contentArea.innerHTML = '';
    switch(subpath) {
      case 'home':
        if (isPengunjung) contentArea.appendChild(Dashboard());
        else window.location.hash = `#/dashboard/${defaultSubpath}`;
        break;
      case 'pesan':
      case 'transaksi':
        if (isPengunjung) {
          if (subpath === 'pesan') {
            const navigateToTransaksi = () => window.location.hash = '#/dashboard/transaksi';
            contentArea.appendChild(Pemesanan(navigateToTransaksi));
          } else {
            contentArea.appendChild(Transaksi());
          }
        } else {
          window.location.hash = `#/dashboard/${defaultSubpath}`;
        }
        break;
      case 'admin':
        if (userRoles.includes('admin')) contentArea.appendChild(AdminPage());
        else window.location.hash = `#/dashboard/${defaultSubpath}`;
        break;
      case 'pimpinan':
        if (userRoles.includes('pimpinan')) contentArea.appendChild(PimpinanPage());
        else window.location.hash = `#/dashboard/${defaultSubpath}`;
        break;
      default:
        window.location.hash = `#/dashboard/${defaultSubpath}`;
        break;
    }
  };

  window.addEventListener('hashchange', renderSubPage);
  renderSubPage();
  
  div.querySelector('#logoutBtn').addEventListener('click', () => {
    netlifyIdentity.logout();
  });

  return div;
}