// src/index.js
import './styles/main.css';
// Impor komponen halaman utama dan halaman publik
import WelcomePage from './pages/WelcomePage';
import DashboardPage from './pages/DashboardPage';
import KontakPage from './pages/Kontak';
import TanyaJawabPage from './pages/TanyaJawab';
import TutorialPage from './pages/Tutorial';
import TentangKamiPage from './pages/TentangKami';

// Menunggu hingga seluruh dokumen HTML selesai dimuat
window.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');

  if (!app) {
    console.error("KRITIS: Elemen dengan id 'app' tidak ditemukan.");
    return;
  }

  // --- Router Utama (Struktur Diperbarui) ---
  const router = () => {
    const path = window.location.hash.slice(1) || '/';
    app.innerHTML = ''; // Kosongkan konten saat ini

    // Langkah 1: Tangani Rute Publik terlebih dahulu.
    // Rute ini bisa diakses siapa saja, kapan saja, tanpa perlu login.
    if (['/tutorial', '/tanya-jawab', '/kontak', '/tentang-kami'].includes(path)) {
        switch (path) {
            case '/tutorial':
                app.appendChild(TutorialPage());
                break;
            case '/tanya-jawab':
                app.appendChild(TanyaJawabPage());
                break;
            case '/kontak':
                app.appendChild(KontakPage());
                break;
            case '/tentang-kami':
                app.appendChild(TentangKamiPage());
          return;
        }
        return; // Keluar dari fungsi setelah menampilkan halaman publik.
    }

    // Langkah 2: Jika bukan rute publik, periksa status login.
    const user = netlifyIdentity.currentUser();
    if (!user) {
      // Jika tidak ada pengguna yang login, SELALU tampilkan halaman Welcome.
      // Ini adalah "gerbang masuk" utama dan halaman default untuk pengguna yang belum login.
      app.appendChild(WelcomePage());
    } else {
      // Jika ada pengguna yang login...
      if (path.startsWith('/dashboard')) {
        // ...dan path-nya adalah untuk area dasbor, tampilkan DashboardPage.
        app.appendChild(DashboardPage());
      } else {
        // ...dan path-nya adalah apa pun selain itu (termasuk '/'),
        // secara otomatis arahkan mereka ke dasbor.
        window.location.hash = '#/dashboard';
      }
    }
  };

  // --- Event Listeners untuk mengaktifkan router (DIPERBAIKI) ---

  // 1. Panggil router segera setelah halaman dimuat.
  // Ini adalah perbaikan kunci untuk mencegah halaman kosong.
  // Pada titik ini, `user` kemungkinan besar null, sehingga WelcomePage akan ditampilkan dengan benar.
  router();

  // 2. Dengarkan perubahan hash untuk menangani navigasi selanjutnya.
  window.addEventListener('hashchange', router);
  
  // 3. Pasang listener Netlify untuk menangani perubahan status login.
  if (window.netlifyIdentity) {
    // Event 'init' sekarang tugasnya adalah me-render ulang jika pengguna SUDAH login.
    window.netlifyIdentity.on('init', (user) => {
      if (user) {
        console.log('Sesi aktif ditemukan, merender ulang...');
        router(); 
      }
    });

    // Listener 'login' akan mengubah hash, yang kemudian memicu 'hashchange'.
    window.netlifyIdentity.on('login', () => {
      window.location.hash = '#/dashboard';
    });

    // Listener 'logout' akan mengubah hash, yang kemudian memicu 'hashchange'.
    window.netlifyIdentity.on('logout', () => {
      window.location.hash = '#/';
    });
  } else {
    console.error('Netlify Identity widget tidak ditemukan.');
  }
});
