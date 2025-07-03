export default function WelcomePage() {
  const div = document.createElement('div');
  div.innerHTML = `
    <style>
      .welcome-container { display: flex; flex-direction: column; min-height: 100vh; }
      .welcome-header { display: flex; justify-content: space-between; align-items: center; padding: 1rem 2rem; background-color: #ffffff; border-bottom: 1px solid #e0e0e0; }
      .welcome-header .site-title { font-weight: bold; font-size: 1.2rem; }
      .welcome-nav a { margin: 0 10px; text-decoration: none; color: #007bff; font-weight: 500; }
      .welcome-header #masukBtn { padding: 8px 16px; font-size: 0.9rem; background-color: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer; }
      .welcome-content { flex-grow: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; padding: 20px; }
      .welcome-content h1 { font-size: 2.5rem; }
      /* --- Media Query untuk HP --- */
      @media (max-width: 768px) {
        .welcome-header { flex-direction: column; gap: 15px; padding: 1rem; }
        .welcome-nav { order: 1; /* Pindahkan navigasi ke bawah judul */ }
        .welcome-header #masukBtn { width: 100%; }
        .welcome-content h1 { font-size: 2rem; }
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
        <p>Pesan tiket Anda dengan mudah, cepat, dan aman.</p>
        </section>
    </div>
  `;
  div.querySelector('#masukBtn').addEventListener('click', () => { netlifyIdentity.open('login'); });
  return div;
}
