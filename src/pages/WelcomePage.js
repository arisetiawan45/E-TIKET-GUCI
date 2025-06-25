// pages/WelcomePage.js

// Parameter navigateToDashboard sudah tidak diperlukan dan dihapus.
export default function WelcomePage() {
  const div = document.createElement('div');
  
  // Konten HTML tetap sama.
  div.innerHTML = `
    <section style="padding: 20px; text-align: center;">
      <h1>Selamat Datang di Sistem Tiket Wisata Guci</h1>
      <p>Silakan klik tombol di bawah untuk masuk.</p>
      <button id="masukBtn" style="padding: 10px 20px; font-size: 16px;">Masuk</button>
    </section>
  `;

  // Logika untuk tombol "Masuk" sudah benar dan tidak perlu diubah.
  // Tugasnya hanya membuka widget login.
  div.querySelector('#masukBtn').addEventListener('click', () => {
    // Membuka widget Netlify Identity pada tab login
    netlifyIdentity.open('login');
  });

  return div;
}