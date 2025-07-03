// components/Transaksi.js

// Komponen ini sekarang memanggil satu fungsi backend terpusat (get-data)
export default function Transaksi(props = { scope: 'user', adminFeatures: false }) {
  const { scope, adminFeatures } = props;
  const div = document.createElement("div");

  // State aplikasi untuk komponen ini
  let transactions = [];
  let filteredTransactions = [];
  let sortColumn = 'tanggal_transaksi';
  let sortDirection = 'desc';
  let currentPage = 1;
  const rowsPerPage = 10;
  let searchTerm = '';

  div.innerHTML = `
    <style>
      .transaksi-container { background-color: #ffffff; padding: 25px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
      .transaksi-header { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px; margin-bottom: 20px; }
      .transaksi-header h3 { margin: 0; font-size: 1.5rem; }
      #transaksiTable { width: 100%; border-collapse: collapse; font-size: 0.9em; }
      #transaksiTable th, #transaksiTable td { border: 1px solid #ddd; padding: 12px; text-align: left; }
      #transaksiTable th { background-color: #f8f9fa; cursor: pointer; user-select: none; }
      #transaksiTable th:hover { background-color: #e9ecef; }
      .sort-indicator { margin-left: 5px; font-size: 0.8em; }
      .pagination-controls { margin-top: 20px; display: flex; justify-content: space-between; align-items: center; }
      .pagination-buttons button { padding: 8px 16px; cursor: pointer; }
      .pagination-buttons button:disabled { cursor: not-allowed; opacity: 0.5; }
      .search-bar input { width: 250px; padding: 10px; border: 1px solid #ccc; border-radius: 5px; }
      #printPdfBtn { padding: 8px 16px; background-color: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer; }
    </style>
    <div class="transaksi-container">
      <p id="loadingMessage">Memuat riwayat transaksi...</p>
      <div id="transaksiContent" style="display: none;">
        <div class="transaksi-header">
          <h3>${scope === 'user' ? 'Riwayat Transaksi Anda' : 'Riwayat Seluruh Transaksi'}</h3>
          <div class="table-actions" style="display: flex; gap: 15px; align-items: center;">
            ${adminFeatures ? `<div class="search-bar"><input type="search" id="searchInput" placeholder="Cari nama pemesan..."></div>` : ''}
            ${adminFeatures ? `<button id="printPdfBtn">Cetak Laporan</button>` : ''}
          </div>
        </div>
        <table id="transaksiTable">
          <thead>
            <tr>
              <th data-sort="id_transaksi">ID <span class="sort-indicator"></span></th>
              <th data-sort="nama_pemesan">Nama Pemesan <span class="sort-indicator"></span></th>
              <th data-sort="tanggal_kunjungan">Tgl Kunjungan <span class="sort-indicator"></span></th>
              <th data-sort="tanggal_transaksi">Waktu Transaksi <span class="sort-indicator"></span></th>
              <th data-sort="jumlah">Jumlah <span class="sort-indicator"></span></th>
              <th data-sort="total">Total <span class="sort-indicator"></span></th>
              <th data-sort="status">Status <span class="sort-indicator"></span></th>
            </tr>
          </thead>
          <tbody id="transaksiBody"></tbody>
        </table>
        <div class="pagination-controls">
            <span id="pageIndicator"></span>
            <div class="pagination-buttons">
                <button id="prevPageBtn" disabled>Sebelumnya</button>
                <button id="nextPageBtn" disabled>Berikutnya</button>
            </div>
        </div>
      </div>
    </div>
  `;

  const loadingMessage = div.querySelector("#loadingMessage");
  const contentDiv = div.querySelector("#transaksiContent");
  const tbody = div.querySelector("#transaksiBody");

  const printPDF = () => {
    // ... (Logika printPDF tetap sama) ...
  };

  const renderTable = () => {
    // ... (Logika renderTable tetap sama, hanya perlu memastikan kolom yang di-sort ada) ...
  };

  const fetchData = async () => {
    try {
      const user = netlifyIdentity.currentUser();
      if (!user) throw new Error('Otorisasi gagal.');

      // PERBAIKAN: Menggunakan satu endpoint dengan parameter 'scope'
      const endpoint = `/.netlify/functions/get-history-data?scope=${scope}`;
      const headers = { 'Authorization': `Bearer ${user.token.access_token}` };
      const response = await fetch(endpoint, { headers });
      
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Gagal memuat data.');
      }
      
      const data = await response.json();
      // PERBAIKAN: Menangani struktur data yang berbeda dari backend
      // Jika scope 'user', data adalah array. Jika 'admin'/'pimpinan', data adalah objek.
      transactions = (scope === 'user') ? data : data.transaksi;

      loadingMessage.style.display = 'none';
      contentDiv.style.display = 'block';
      renderTable();
    } catch (error) {
      loadingMessage.textContent = `Error: ${error.message}`;
      loadingMessage.style.color = 'red';
    }
  };

  // Event listener untuk sorting
  div.querySelectorAll('#transaksiTable th[data-sort]').forEach(header => {
    header.addEventListener('click', () => {
      const newSortColumn = header.dataset.sort;
      if (sortColumn === newSortColumn) {
        sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        sortColumn = newSortColumn;
        sortDirection = 'asc';
      }
      renderTable(); // Render ulang tabel dengan sort baru
    });
  });

  fetchData();
  return div;
}