// DashboardPage dengan Halaman Admin Digabung & Desain Modern

import Pemesanan from '../components/Pemesanan';
import Transaksi from '../components/Transaksi';

export default function DashboardPage() {
  const div = document.createElement('div');
  const user = netlifyIdentity.currentUser();
  const userRoles = user?.app_metadata?.roles || [];

  div.innerHTML = `
    <style>
      * {
        box-sizing: border-box;
        font-family: 'Segoe UI', sans-serif;
      }

      body {
        margin: 0;
        background-color: #f4f7fa;
      }

      header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 25px 30px;
        background: linear-gradient(90deg, #667eea, #764ba2);
        color: white;
        box-shadow: 0 3px 6px rgba(0,0,0,0.1);
      }

      header h3 {
        margin: 0;
        font-size: 22px;
      }

      header small {
        font-size: 13px;
        opacity: 0.9;
      }

      #logoutBtn {
        background-color: white;
        color: #333;
        border: none;
        border-radius: 20px;
        padding: 8px 18px;
        cursor: pointer;
        font-weight: 500;
        box-shadow: 0 2px 5px rgba(0,0,0,0.15);
        transition: background-color 0.3s ease;
      }

      #logoutBtn:hover {
        background-color: #ddd;
      }

      nav#main-nav {
        background-color: #ffffff;
        display: flex;
        justify-content: center;
        padding: 15px 0;
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      }

      .nav-link {
        margin: 0 15px;
        text-decoration: none;
        color: #333;
        font-weight: 500;
        position: relative;
        padding-bottom: 5px;
      }

      .nav-link:hover {
        color: #667eea;
      }

      .nav-link.active::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        height: 2px;
        width: 100%;
        background-color: #667eea;
      }

      main#content {
        padding: 30px;
        min-height: 75vh;
        background-color: #f4f7fa;
      }

      .card {
        background: white;
        border-radius: 16px;
        padding: 30px;
        margin-bottom: 30px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.05);
      }
    </style>

    <header>
      <div>
        <h3>Selamat Datang, ${user.user_metadata.full_name || user.email}</h3>
        <small>Peran: ${userRoles.join(', ') || 'pengunjung'} (Mode Development)</small>
      </div>
      <button id="logoutBtn">Logout</button>
    </header>

    <nav id="main-nav"></nav>
    <main id="content"></main>
  `;

  const nav = div.querySelector('#main-nav');
  const contentArea = div.querySelector('#content');

  nav.innerHTML = `
    <a href="#/dashboard/pesan" class="nav-link">Pesan Tiket</a>
    <a href="#/dashboard/transaksi" class="nav-link">Lihat Transaksi</a>
    <a href="#/dashboard/admin" class="nav-link">Halaman Admin</a>
    ${userRoles.includes('pimpinan') ? `<a href="#/dashboard/pimpinan" class="nav-link">Halaman Pimpinan</a>` : ''}
  `;

  const updateActiveLink = () => {
    const links = nav.querySelectorAll('.nav-link');
    links.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === window.location.hash) {
        link.classList.add('active');
      }
    });
  };

  const AdminContent = () => {
    const section = document.createElement('section');
    section.className = 'card';
    section.innerHTML = `
      <h2>Halaman Admin</h2>
      <p>Konten admin akan dimuat dari server (placeholder)</p>
      <p style="margin-top: 20px; color: #777;">🔧 Fitur seperti kelola destinasi, paket wisata, dan transaksi akan tampil di sini.</p>
    `;
    return section;
  };

  const renderSubPage = () => {
    const subpath = window.location.hash.split('/')[2] || 'admin';
    contentArea.innerHTML = '';
    updateActiveLink();

    const card = document.createElement('div');
    card.className = 'card';

    switch (subpath) {
      case 'pesan':
        const navigateToTransaksi = () => window.location.hash = '#/dashboard/transaksi';
        card.appendChild(Pemesanan(navigateToTransaksi));
        break;
      case 'transaksi':
        card.appendChild(Transaksi());
        break;
      case 'admin':
        contentArea.appendChild(AdminContent());
        return;
      case 'pimpinan':
        if (userRoles.includes('pimpinan')) {
          card.innerHTML = '<h3>Konten Pimpinan akan ditambahkan.</h3>';
        } else {
          window.location.hash = '#/dashboard/admin';
          return;
        }
        break;
      default:
        window.location.hash = '#/dashboard/admin';
        return;
    }

    contentArea.appendChild(card);
  };

  window.addEventListener('hashchange', renderSubPage);
  renderSubPage();

  div.querySelector('#logoutBtn').addEventListener('click', () => {
    netlifyIdentity.logout();
  });

  return div;
}
