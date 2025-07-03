// pages/PimpinanPage.js
import Transaksi from '../components/Transaksi'; // Impor komponen Transaksi yang baru

export default function PimpinanPage() {
  const div = document.createElement("div");
  div.className = "pimpinan-container";
  div.innerHTML = `
    <style>
      .pimpinan-card {
        background-color: #ffffff;
        padding: 25px;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        margin-bottom: 30px;
      }
      .pimpinan-card h3 {
        margin-top: 0;
        font-size: 1.5rem;
      }
      .stats-container { display: flex; gap: 40px; }
      .stats-container p { font-size: 1.1rem; margin: 0; }
    </style>
    <section style="padding: 20px 0;">
      <h2>Laporan Pimpinan</h2>
      <p id="loading-message">Memuat data laporan...</p>
      
      <div id="pimpinan-content" style="display: none;">
        <div class="pimpinan-card">
          <h3>Statistik Situs</h3>
          <div class="stats-container">
            <p><strong>Total Transaksi:</strong> <span id="totalTransaksi">0</span></p>
            <p><strong>Total Tiket Terjual:</strong> <span id="totalTiket">0</span></p>
          </div>
        </div>
        
        <!-- Area untuk menampilkan komponen Transaksi -->
        <div id="transaksi-component-wrapper"></div>
      </div>
    </section>
  `;

  // Fungsi untuk mengambil data statistik (lebih efisien)
  const fetchStats = async () => {
    const loadingMessage = div.querySelector("#loading-message");
    const pimpinanContent = div.querySelector("#pimpinan-content");
    try {
      // Kita tetap memanggil get-admin-data karena ia sudah efisien
      const response = await fetch('/.netlify/functions/get-admin-data');
      if (!response.ok) throw new Error('Gagal mengambil data statistik');
      const data = await response.json();

      // Update statistik
      div.querySelector("#totalTransaksi").textContent = data.transaksi.length;
      div.querySelector("#totalTiket").textContent = data.transaksi.reduce((sum, trx) => sum + (trx.jumlah || 0), 0);

      // Tampilkan konten setelah statistik dimuat
      loadingMessage.style.display = 'none';
      pimpinanContent.style.display = 'block';

    } catch (error) {
      loadingMessage.textContent = `Error: ${error.message}`;
    }
  };

  // Panggil dan tampilkan komponen Transaksi
  const transaksiWrapper = div.querySelector("#transaksi-component-wrapper");
  // Kita panggil dengan scope 'all' dan adminFeatures 'true'
  transaksiWrapper.appendChild(Transaksi({ scope: 'all', adminFeatures: true }));

  // Ambil data statistik
  fetchStats();

  return div;
}
