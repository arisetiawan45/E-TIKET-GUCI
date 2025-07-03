// pages/TanyaJawab.js

// Parameter navigasi tidak lagi diperlukan karena kita menggunakan hash-routing
export default function TanyaJawabPage() {
  const div = document.createElement('div');
  
  // Menambahkan styling untuk akordeon FAQ dan layout halaman
  div.innerHTML = `
    <style>
      .faq-container {
        max-width: 800px;
        margin: 40px auto;
        padding: 20px;
        font-family: sans-serif;
      }
      .faq-header {
        text-align: center;
        margin-bottom: 40px;
      }
      .faq-header h2 {
        font-size: 2.5rem;
        color: #333;
      }
      .faq-item {
        margin-bottom: 15px;
        border: 1px solid #ddd;
        border-radius: 8px;
        overflow: hidden;
      }
      .faq-item summary {
        font-size: 1.2rem;
        font-weight: 500;
        padding: 20px;
        cursor: pointer;
        outline: none;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #f9f9f9;
      }
      .faq-item summary::after {
        content: '▼'; /* Panah ke bawah */
        transition: transform 0.2s;
      }
      .faq-item details[open] summary::after {
        transform: rotate(180deg); /* Panah ke atas saat terbuka */
      }
      .faq-item .faq-answer {
        padding: 20px;
        background-color: #fff;
        border-top: 1px solid #ddd;
      }
      .back-link-container {
        text-align: center;
        margin-top: 40px;
      }
      .back-link-container a {
        padding: 10px 20px;
        background-color: #6c757d;
        color: white;
        text-decoration: none;
        border-radius: 5px;
      }
    </style>

    <div class="faq-container">
      <div class="faq-header">
        <h2>Pertanyaan Umum (FAQ)</h2>
      </div>

      <div class="faq-item">
        <details>
          <summary>Bagaimana cara memesan tiket?</summary>
          <div class="faq-answer">
            <p>Untuk memesan tiket, Anda harus masuk (login) terlebih dahulu. Setelah berada di Dashboard, klik menu "Pesan Tiket", lalu isi formulir pemesanan sesuai dengan tanggal kunjungan dan jumlah tiket yang Anda inginkan.</p>
          </div>
        </details>
      </div>

      <div class="faq-item">
        <details>
          <summary>Metode pembayaran apa saja yang diterima?</summary>
          <div class="faq-answer">
            <p>Saat ini kami mendukung pembayaran melalui transfer bank dan dompet digital (e-wallet). Detail lebih lanjut akan ditampilkan saat Anda melanjutkan ke halaman transaksi setelah melakukan pemesanan.</p>
          </div>
        </details>
      </div>

      <div class="faq-item">
        <details>
          <summary>Apakah saya perlu mencetak tiket?</summary>
          <div class="faq-answer">
            <p>Tidak perlu. E-tiket Anda akan tersimpan di halaman Riwayat Transaksi. Cukup tunjukkan bukti transaksi (bisa berupa screenshot atau langsung dari aplikasi) kepada petugas di lokasi.</p>
          </div>
        </details>
      </div>
      
      <div class="faq-item">
        <details>
          <summary>Bisakah saya membatalkan atau mengubah jadwal tiket?</summary>
          <div class="faq-answer">
            <p>Mohon maaf, saat ini tiket yang sudah dibeli tidak dapat dibatalkan (non-refundable) atau diubah jadwalnya. Pastikan Anda memilih tanggal kunjungan dengan benar sebelum menyelesaikan transaksi.</p>
          </div>
        </details>
      </div>

      <div class="back-link-container">
        <a href="#">Kembali ke Halaman Utama</a>
      </div>
    </div>
  `;

  // Tidak ada lagi event listener untuk tombol kembali, karena sudah diganti dengan link <a>
  
  return div;
}
