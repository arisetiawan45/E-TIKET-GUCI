
export default function WelcomePage() {
  const div = document.createElement('div');
  
  div.innerHTML = `
    <style>
      .welcome-container { display: flex; flex-direction: column; min-height: 100vh; }
      .welcome-header { display: flex; justify-content: space-between; align-items: center; padding: 1rem 2rem; background-color: #ffffff; border-bottom: 1px solid #e0e0e0; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
      .welcome-header .site-title { font-weight: bold; font-size: 1.5rem; color: #333; }
      .welcome-nav a { margin: 0 15px; text-decoration: none; color: #007bff; font-weight: 500; }
      .welcome-nav a:hover { text-decoration: underline; }
      .welcome-header #masukBtn { padding: 10px 24px; font-size: 1rem; cursor: pointer; background-color: #007bff; color: white; border: none; border-radius: 5px; }
      .welcome-content { flex-grow: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; padding: 40px 20px; background: linear-gradient(135deg, #f8f9fa, #e9ecef); }
      .welcome-content h1 { font-size: 3rem; margin-bottom: 1rem; color: #343a40; }
      .welcome-content p { font-size: 1.25rem; color: #6c757d; max-width: 600px; }
      @media (max-width: 768px) {
        .welcome-header { flex-direction: column; gap: 15px; padding: 1rem; }
        .welcome-nav { order: 1; }
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
          <a href="#/tentang-kami">Tentang Kami</a>
        </nav>
        <button id="masukBtn">Masuk</button>
      </header>
      <section class="welcome-content">
        <h1>Selamat Datang di Sistem Tiket Wisata Guci</h1>
        <p>Platform pemesanan tiket wisata Guci yang mudah, cepat, dan aman untuk liburan Anda.</p>
      </section>
    </div>
  `;

  div.querySelector('#masukBtn').addEventListener('click', () => {
    netlifyIdentity.open('login');
  });

  return div;
}
