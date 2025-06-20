export function PengunjungPage(navigateToDashboard) {
    const div = document.createElement('div');
  
    div.innerHTML = `
      <section style="padding: 20px;">
        <h2>Halaman Pengunjung</h2>
        <p>Selamat datang, Pengunjung!</p>
  
        <p>Silakan mulai dengan memesan tiket wisata Guci atau lihat informasi seputar paket wisata yang tersedia.</p>
  
        <button id="btnKembali" style="margin-top: 20px;">Kembali ke Dashboard</button>
      </section>
    `;
  
    div.querySelector('#btnKembali').addEventListener('click', () => {
      navigateToDashboard();
    });
  
    return div;
  }
  