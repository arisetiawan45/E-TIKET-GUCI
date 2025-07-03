// pages/DashboardPage.js
import Pemesanan from "../components/Pemesanan";
import Transaksi from "../components/Transaksi";
import AdminPage from "./AdminPage";
import PimpinanPage from "./PimpinanPage";

export default function DashboardPage() {
  const div = document.createElement("div");
  const user = netlifyIdentity.currentUser();
  const userRoles = user?.app_metadata?.roles || [];

  div.innerHTML = `
    <style>
      * {
        box-sizing: border-box;
        font-family: 'Segoe UI', sans-serif;
        margin: 0;
        padding: 0;
      }

      header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px;
        background: linear-gradient(to right, #4facfe, #00f2fe);
        color: white;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      }

      header h3 {
        font-size: 20px;
      }

      header small {
        font-size: 14px;
        opacity: 0.9;
      }

      #logoutBtn {
        background-color: white;
        color: #333;
        border: none;
        border-radius: 5px;
        padding: 8px 15px;
        cursor: pointer;
        transition: background-color 0.3s ease;
      }

      #logoutBtn:hover {
        background-color: #ddd;
      }

      nav#main-nav {
        background-color: #f8f8f8;
        padding: 15px;
        text-align: center;
        border-bottom: 1px solid #ddd;
      }

      .nav-link {
        margin: 0 12px;
        text-decoration: none;
        color: #333;
        font-weight: 500;
        position: relative;
      }

      .nav-link::after {
        content: '';
        position: absolute;
        bottom: -5px;
        left: 0;
        width: 0;
        height: 2px;
        background-color: #4facfe;
        transition: width 0.3s;
      }

      .nav-link:hover::after {
        width: 100%;
      }

      main#content {
        padding: 30px;
        background-color: #f0f4f8;
        min-height: 70vh;
      }
    </style>

    <header>
      <div>
        <h3>Selamat Datang, ${user.user_metadata.full_name || user.email}</h3>
        <small>Peran: ${
          userRoles.join(", ") || "pengunjung"
        } (Mode Development)</small>
      </div>
      <button id="logoutBtn">Logout</button>
    </header>

    <nav id="main-nav"></nav>
    <main id="content"></main>
  `;

  const nav = div.querySelector("#main-nav");
  const contentArea = div.querySelector("#content");

  // Navigasi utama
  nav.innerHTML = `
    <a href="#/dashboard/pesan" class="nav-link">Pesan Tiket</a>
    <a href="#/dashboard/transaksi" class="nav-link">Lihat Transaksi</a>
    <a href="#/dashboard/admin" class="nav-link">Halaman Admin</a>
    ${
      userRoles.includes("pimpinan")
        ? `<a href="#/dashboard/pimpinan" class="nav-link">Halaman Pimpinan</a>`
        : ""
    }
  `;

  // Fungsi render halaman berdasarkan sub-route
  const renderSubPage = () => {
    const subpath = window.location.hash.split("/")[2] || "admin";
    contentArea.innerHTML = "";

    switch (subpath) {
      case "pesan":
        const navigateToTransaksi = () =>
          (window.location.hash = "#/dashboard/transaksi");
        contentArea.appendChild(Pemesanan(navigateToTransaksi));
        break;
      case "transaksi":
        contentArea.appendChild(Transaksi());
        break;
      case "admin":
        contentArea.appendChild(AdminPage());
        break;
      case "pimpinan":
        if (userRoles.includes("pimpinan")) {
          contentArea.appendChild(PimpinanPage());
        } else {
          window.location.hash = "#/dashboard/admin";
        }
        break;
      default:
        window.location.hash = "#/dashboard/admin";
        break;
    }
  };

  // Event listener hash change
  window.addEventListener("hashchange", renderSubPage);

  // Render halaman saat pertama kali dibuka
  renderSubPage();

  // Logout
  div.querySelector("#logoutBtn").addEventListener("click", () => {
    netlifyIdentity.logout();
  });

  return div;
}
