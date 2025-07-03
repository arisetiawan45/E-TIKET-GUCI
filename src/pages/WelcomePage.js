// pages/WelcomePage.js

export default function WelcomePage() {
  const div = document.createElement('div');
  
  // Menambahkan styling untuk header dan konten baru
  div.innerHTML = `
    <style>
      .welcome-container {
        display: flex;
        flex-direction: column;
        min-height: 100vh; /* Memastikan container setinggi layar */
      }
      .welcome-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 2rem;
        background-color: #ffffff;
        border-bottom: 1px solid #e0e0e0;
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      }
      .welcome-header .site-title {
        font-weight: bold;
        font-size: 1.5rem;
        color: #333;
      }
      .welcome-nav a {
        margin: 0 15px;
        text-decoration: none;
        color: #007bff;
        font-weight: 500;
      }
      .welcome-nav a:hover {
        text-decoration: underline;
      }
      .welcome-header #masukBtn {
        padding: 10px 24px;
        font-size: 1rem;
        cursor: pointer;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 5px;
        transition: background-color 0.2s;
      }
      .welcome-header #masukBtn:hover {
        background-color: #0056b3;
      }
      .welcome-content {
        flex-grow: 1; /* Membuat konten mengisi sisa ruang */
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        padding: 40px 20px;
        background: linear-gradient(135deg, #f8f9fa, #e9ecef);
      }
      .welcome-content h1 {
        font-size: 3rem;
        margin-bottom: 1rem;
        color: #343a40;
      }
      .welcome-content p {
        font-size: 1.25rem;
        color: #6c757d;
        max-width: 600px;
      }
    </style>
    <div class="welcome-container">
      <header class="welcome-header">
        <span class="site-title">E-Tiket Guci</span>
        <nav class="welcome-nav">
          <a href="#/tutorial">Tutorial</a>
          <a href="#/tanya-jawab">Tanya Jawab</a>
          <a href="#/kontak">Kontak</a>
        </nav>
        <button id="masukBtn">Masuk</button>
      </header>
      <section class="welcome-content">
        <h1>Selamat Datang di Sistem Tiket Wisata Guci</h1>
        <p>Platform pemesanan tiket wisata Guci yang mudah, cepat, dan aman untuk liburan Anda.</p>
      </section>
    </div>
  `;

  // Logika untuk tombol "Masuk" tidak perlu diubah.
  div.querySelector('#masukBtn').addEventListener('click', () => {
    // Membuka widget Netlify Identity pada tab login
    netlifyIdentity.open('login');
  });

  return div;
}
