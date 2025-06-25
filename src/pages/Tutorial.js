export function Tutorial(navigateBack) {
    const div = document.createElement('div');
    div.innerHTML = `
      <section style="padding: 20px;">
        <h2>Tutorial Penggunaan Aplikasi Tiket Wisata</h2>
        <ol>
          <li>Buka halaman utama aplikasi.</li>
          <li>Klik tombol "Masuk" untuk masuk ke Dashboard.</li>
          <li>Pilih menu "Pesan Tiket".</li>
          <li>Isi form pemesanan dan klik "Pesan Tiket".</li>
          <li>Lihat bukti transaksi di halaman "Transaksi".</li>
          <li>Tunjukkan transaksi saat masuk ke lokasi wisata.</li>
        </ol>
        <button id="btnKembali">Kembali ke Dashboard</button>
      </section>
    `;
    div.querySelector('#btnKembali').addEventListener('click', navigateBack);
    return div;
  }
  