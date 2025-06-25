import './styles/main.css';
// Impor semua komponen halaman yang akan menjadi 'rute'
import WelcomePage from './pages/WelcomePage';
import DashboardPage from './pages/DashboardPage';
// Halaman lain yang diimpor berdasarkan permintaan Anda
import KontakPage from './pages/Kontak';
import TanyaJawabPage from './pages/TanyaJawab';
import TutorialPage from './pages/Tutorial';


// Menunggu hingga seluruh dokumen HTML selesai dimuat
window.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');

  if (!app) {
    console.error("KRITIS: Elemen dengan id 'app' tidak ditemukan.");
    return;
  }

  // --- Router Utama ---
  const router = () => {
    // Logika router tetap sama, sudah benar
    const path = window.location.hash.slice(1) || '/';
    app.innerHTML = '';
    const user = netlifyIdentity.currentUser();

    if (!user) {
      app.appendChild(WelcomePage());
    } else {
      // Periksa apakah path dimulai dengan /dashboard untuk menangani sub-rute
      if (path.startsWith('/dashboard')) {
        app.appendChild(DashboardPage());
        return; // Hentikan eksekusi agar tidak masuk ke switch
      }

      switch (path) {
        case '/':
          // Jika path hanya '/', arahkan ke dasbor
          window.location.hash = '#/dashboard';
          break;
        
        // --- RUTE BARU DITAMBAHKAN DI SINI ---
        case '/kontak':
          app.appendChild(KontakPage());
          break;
        case '/tanya-jawab':
          app.appendChild(TanyaJawabPage());
          break;
        case '/tutorial':
          app.appendChild(TutorialPage());
          break;

        default:
          // Jika rute tidak ditemukan, arahkan kembali ke dasbor
          window.location.hash = '#/dashboard';
          break;
      }
    }
  };

  // --- PERUBAHAN UTAMA PADA LOGIKA EVENT LISTENER ---

  // 1. Jalankan router SEGERA setelah halaman dimuat.
  // Ini akan memastikan halaman tidak pernah kosong.
  // Pada titik ini, 'user' kemungkinan besar null, jadi WelcomePage akan ditampilkan.
  router();

  // 2. Dengarkan perubahan hash untuk navigasi selanjutnya.
  window.addEventListener('hashchange', router);
  
  // 3. Pasang listener Netlify untuk menangani perubahan status login.
  if (window.netlifyIdentity) {
    // Event 'init' sekarang tugasnya adalah me-render ulang jika pengguna SUDAH login.
    window.netlifyIdentity.on('init', (user) => {
      if (user) {
        console.log('Pengguna sudah login dari sesi sebelumnya, render ulang.');
        // Jalankan router lagi untuk beralih ke halaman yang benar berdasarkan hash
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
