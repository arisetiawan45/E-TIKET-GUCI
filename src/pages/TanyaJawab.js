export function TanyaJawab(navigateBack) {
    const div = document.createElement('div');
    div.innerHTML = `
      <section style="padding: 20px;">
        <h2>Pertanyaan Umum (FAQ)</h2>
        <dl>
          <dt><strong>Bagaimana cara memesan tiket?</strong></dt>
          <dd>Masuk ke Dashboard dan klik tombol "Pesan Tiket", lalu isi form dan submit.</dd>
  
          <dt><strong>Bisakah saya membatalkan tiket yang sudah dipesan?</strong></dt>
          <dd>Saat ini pembatalan tiket belum tersedia secara online.</dd>
  
          <dt><strong>Apakah saya perlu mencetak tiket?</strong></dt>
          <dd>Tidak perlu. Cukup tunjukkan bukti transaksi dari aplikasi saat di lokasi.</dd>
        </dl>
        <button id="btnKembali">Kembali ke Dashboard</button>
      </section>
    `;
    div.querySelector('#btnKembali').addEventListener('click', navigateBack);
    return div;
  }
  