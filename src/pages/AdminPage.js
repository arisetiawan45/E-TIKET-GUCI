// main.js
import DashboardPage from './pages/DashboardPage.js';

function renderApp() {
  const app = document.getElementById('app');
  if (!app) return;

  // Kosongkan isi sebelum render ulang
  app.innerHTML = '';

  // Render hanya satu kali instance Dashboard
  const dashboard = DashboardPage();
  dashboard.id = 'dashboard-wrapper';
  app.appendChild(dashboard);

  // Tambahkan styling global langsung di sini (gabungan CSS)
  const style = document.createElement('style');
  style.textContent = `
    * {
      box-sizing: border-box;
      font-family: 'Segoe UI', sans-serif;
      margin: 0;
      padding: 0;
    }

    body {
      background-color: #f4f7fa;
      line-height: 1.6;
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

    @media (max-width: 768px) {
      header, nav#main-nav {
        flex-direction: column;
        align-items: flex-start;
        text-align: left;
      }

      .nav-link {
        margin: 8px 0;
      }

      #logoutBtn {
        margin-top: 10px;
      }

      main#content {
        padding: 20px;
      }

      .card {
        padding: 20px;
      }
    }
  `;
  document.head.appendChild(style);
}

// Event saat hash berubah (navigasi)
window.addEventListener('hashchange', renderApp);

// Event saat pertama kali halaman diload
window.addEventListener('DOMContentLoaded', renderApp);
