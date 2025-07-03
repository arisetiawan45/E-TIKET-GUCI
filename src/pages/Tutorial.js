// pages/Tutorial.js

// Parameter navigasi tidak lagi diperlukan karena kita menggunakan hash-routing
export default function TutorialPage() {
  const div = document.createElement('div');
  
  // Menambahkan styling untuk halaman tutorial
  div.innerHTML = `
    <style>
      .tutorial-container {
        max-width: 800px;
        margin: 40px auto;
        padding: 20px;
        font-family: sans-serif;
      }
      .tutorial-header {
        text-align: center;
        margin-bottom: 50px;
      }
      .tutorial-header h2 {
        font-size: 2.5rem;
        color: #333;
      }
      .tutorial-header p {
        font-size: 1.1rem;
        color: #666;
      }
      .tutorial-steps {
        display: grid;
        gap: 30px;
      }
      .step-card {
        display: flex;
        align-items: flex-start;
        gap: 20px;
        padding: 20px;
        background-color: #f9f9f9;
        border-left: 5px solid #007bff;
        border-radius: 8px;
      }
      .step-icon {
        flex-shrink: 0;
        background-color: #007bff;
        color: white;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        font-weight: bold;
      }
      .step-content h3 {
        margin-top: 0;
        font-size: 1.3rem;
      }
      .step-content p {
        margin-bottom: 0;
        line-height: 1.6;
        color: #555;
      }
      .back-link-container {
        text-align: center;
        margin-top: 50px;
      }
      .back-link-container a {
        padding: 12px 25px;
        background-color: #6c757d;
        color: white;
        text-decoration: none;
        border-radius: 5px;
        font-size: 1rem;
      }
    </style>

    <div class="tutorial-container">
      <div class="tutorial-header">
        <h2>Tutorial Penggunaan</h2>
        <p>Ikuti langkah-langkah mudah berikut untuk memesan tiket Anda.</p>
      </div>

      <div class="tutorial-steps">
        <!-- Langkah 1 -->
        <div class="step-card">
          <div class="step-icon">1</div>
          <div class="step-content">
            <h3>Daftar atau Masuk</h3>
            <p>Klik tombol "Masuk" di halaman utama. Jika Anda pengguna baru, silakan lakukan pendaftaran terlebih dahulu. Jika sudah punya akun, langsung masuk menggunakan email dan kata sandi Anda.</p>
          </div>
        </div>

        <!-- Langkah 2 -->
        <div class="step-card">
          <div class="step-icon">2</div>
          <div class="step-content">
            <h3>Pilih Menu Pemesanan</h3>
            <p>Setelah berhasil masuk, Anda akan diarahkan ke Dashboard. Pilih menu "Pesan Tiket" untuk memulai proses pemesanan.</p>
          </div>
        </div>

        <!-- Langkah 3 -->
        <div class="step-card">
          <div class="step-icon">3</div>
          <div class="step-content">
            <h3>Isi Formulir Pemesanan</h3>
            <p>Isi semua data yang diperlukan pada formulir, seperti nama pemesan, tanggal kunjungan, jenis tiket (biasa atau paket), dan jumlah tiket yang diinginkan. Total harga akan terhitung secara otomatis.</p>
          </div>
        </div>

        <!-- Langkah 4 -->
        <div class="step-card">
          <div class="step-icon">4</div>
          <div class="step-content">
            <h3>Lihat Riwayat Transaksi</h3>
            <p>Setelah menyelesaikan pemesanan, Anda akan diarahkan ke halaman Riwayat Transaksi. Di sini Anda bisa melihat semua detail pesanan Anda, termasuk status pembayarannya.</p>
          </div>
        </div>

        <!-- Langkah 5 -->
        <div class="step-card">
          <div class="step-icon">5</div>
          <div class="step-content">
            <h3>Gunakan E-Tiket Anda</h3>
            <p>Tidak perlu mencetak tiket. Cukup tunjukkan bukti transaksi dari halaman Riwayat Transaksi di aplikasi kepada petugas di pintu masuk lokasi wisata.</p>
          </div>
        </div>
      </div>

      <div class="back-link-container">
        <!-- Tombol kembali ini menggunakan href="#/" yang akan ditangani oleh router utama -->
        <a href="#/">Kembali ke Halaman Utama</a>
      </div>
    </div>
  `;

  return div;
}
