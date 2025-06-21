import './styles/main.css';
// Impor komponen halaman utama
import { WelcomePage } from './pages/WelcomePage';
import { DashboardPage } from './pages/DashboardPage'; // Kita akan buat/modifikasi halaman ini

// Dapatkan elemen root dari HTML Anda (misal: <div id="app"></div>)
const app = document.getElementById('app');

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

// --- Event Listener Netlify Identity (SUMBER KEBENARAN TUNGGAL) ---

// 1. Dipanggil saat halaman dimuat
netlifyIdentity.on('init', (user) => {
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
netlifyIdentity.on('login', (user) => {
  console.log('Login berhasil, menampilkan dasbor.');
  navigateToDashboard();
});

// 3. Dipanggil setelah logout berhasil
netlifyIdentity.on('logout', () => {
  console.log('Logout berhasil, kembali ke halaman selamat datang.');
  navigateToWelcome();
});