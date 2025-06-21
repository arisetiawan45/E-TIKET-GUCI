export function WelcomePage(navigateToDashboard) {
    const div = document.createElement('div');
    div.innerHTML = `
      <section style="padding: 20px; text-align: center;">
        <h1>Selamat Datang di Sistem Tiket Wisata Guci</h1>
        <p>Silakan klik tombol di bawah untuk masuk ke Dashboard.</p>
        <button id="masukBtn" style="padding: 10px 20px; font-size: 16px;">Masuk</button>
      </section>
    `;
  
    // Event untuk tombol "Masuk"
 div.querySelector('#masukBtn').addEventListener('click', () => {
    // Membuka widget Netlify Identity pada tab login
    netlifyIdentity.open('login');
  });



  return div;
}