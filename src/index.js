import './styles/main.css';
// Impor komponen halaman utama
import WelcomePage from './pages/WelcomePage'; // Menggunakan default import
import DashboardPage from './pages/DashboardPage'; // Menggunakan default import

// Menunggu hingga seluruh dokumen HTML selesai dimuat sebelum menjalankan JavaScript
window.addEventListener('DOMContentLoaded', () => {
  // Dapatkan elemen root dari HTML Anda (sekarang dijamin sudah ada)
  const app = document.getElementById('app');

  // Pastikan kita tidak melanjutkan jika elemen 'app' tidak ditemukan
  if (!app) {
    console.error("Error: Elemen dengan id 'app' tidak ditemukan di DOM.");
    return;
  }

  // --- Fungsi Navigasi Utama ---
  function navigateToWelcome() {
    app.innerHTML = '';
    // WelcomePage akan memanggil netlifyIdentity.open('login') secara internal
    app.appendChild(WelcomePage());
  }

  function navigateToDashboard() {
    app.innerHTML = '';
    // DashboardPage akan berisi semua tombol navigasi dan logika setelah login
    app.appendChild(DashboardPage());
  }

  // --- Event Listener Netlify Identity ---

  // Pastikan objek netlifyIdentity ada sebelum menambahkan listener
  if (window.netlifyIdentity) {
    // 1. Dipanggil saat halaman dimuat
    window.netlifyIdentity.on('init', (user) => {
      if (user) {
        // Jika ada sesi login aktif, langsung ke dasbor
        console.log('Sesi aktif, menampilkan dasbor.');
        navigateToDashboard();
      } else {
        // Jika tidak ada sesi, tampilkan halaman selamat datang
        console.log('Tidak ada sesi, menampilkan halaman selamat datang.');
        navigateToWelcome();
      }
    });

    // 2. Dipanggil setelah login berhasil
    window.netlifyIdentity.on('login', (user) => {
      console.log('Login berhasil, menampilkan dasbor.');
      navigateToDashboard();
    });

    // 3. Dipanggil setelah logout berhasil
    window.netlifyIdentity.on('logout', () => {
      console.log('Logout berhasil, kembali ke halaman selamat datang.');
      navigateToWelcome();
    });
  } else {
    console.error('Netlify Identity widget tidak ditemukan. Pastikan skrip sudah dimuat dengan benar.');
  }
});
