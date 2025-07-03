// pages/PimpinanPage.js

export default function PimpinanPage() {
  const div = document.createElement("div");
  div.className = "pimpinan-container";
  // Menambahkan styling dasar
  div.innerHTML = `
    <style>
      .pimpinan-stats { display: flex; gap: 40px; margin-bottom: 20px; }
      .pimpinan-stats p { font-size: 1.1em; }
      .table-header { display: flex; justify-content: space-between; align-items: center; }
      #printPdfBtn { padding: 8px 16px; background-color: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer; }
      #pimpinanTransaksiTable { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 0.9em; }
      #pimpinanTransaksiTable th, #pimpinanTransaksiTable td { border: 1px solid #ddd; padding: 10px; text-align: left; }
      #pimpinanTransaksiTable th { background-color: #f2f2f2; }
      .pagination-controls { margin-top: 20px; display: flex; justify-content: space-between; align-items: center; }
      .pagination-controls button { padding: 8px 16px; cursor: pointer; }
      .pagination-controls button:disabled { cursor: not-allowed; opacity: 0.5; }
    </style>
    <section style="padding: 20px;">
      <h2>Laporan Pimpinan</h2>
      <p id="loading-message">Memuat data laporan...</p>
      
      <div id="pimpinan-content" style="display: none;">
        <div class="pimpinan-stats">
          <p><strong>Total Transaksi:</strong> <span id="totalTransaksi">0</span></p>
          <p><strong>Total Tiket Terjual:</strong> <span id="totalTiket">0</span></p>
        </div>

        <hr>
        
        <!-- PENAMBAHAN: Header untuk tabel dengan tombol cetak -->
        <div class="table-header">
            <h3>Riwayat Seluruh Transaksi</h3>
            <button id="printPdfBtn">Cetak Halaman Ini (PDF)</button>
        </div>

        <table id="pimpinanTransaksiTable">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nama Pemesan</th>
              <th>Tgl Kunjungan</th>
              <th>Jumlah</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody id="transaksiBody"></tbody>
        </table>
        <div class="pagination-controls">
            <button id="prevPageBtn" disabled>Sebelumnya</button>
            <span id="pageIndicator">Halaman 1 dari 1</span>
            <button id="nextPageBtn" disabled>Berikutnya</button>
        </div>
      </div>
    </section>
  `;

  // --- State dan Variabel ---
  let allTransactions = [];
  let currentPage = 1;
  const rowsPerPage = 10;

  // --- Fungsi Render ---
  const renderPage = () => {
    const tbody = div.querySelector("#transaksiBody");
    const pageIndicator = div.querySelector("#pageIndicator");
    const prevBtn = div.querySelector("#prevPageBtn");
    const nextBtn = div.querySelector("#nextPageBtn");
    
    tbody.innerHTML = ""; // Kosongkan tabel

    const totalPages = Math.ceil(allTransactions.length / rowsPerPage);
    pageIndicator.textContent = `Halaman ${currentPage} dari ${totalPages || 1}`;

    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const pageData = allTransactions.slice(startIndex, endIndex);

    pageData.forEach(trx => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${trx.id_transaksi}</td>
        <td>${trx.nama_pemesan || 'N/A'}</td>
        <td>${new Date(trx.tanggal_kunjungan).toLocaleDateString('id-ID')}</td>
        <td>${trx.jumlah}</td>
        <td>Rp ${Number(trx.total).toLocaleString('id-ID')}</td>
        <td>${trx.status}</td>
      `;
      tbody.appendChild(tr);
    });

    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage >= totalPages;
  };

  // --- PENAMBAHAN: Fungsi untuk mencetak PDF ---
  const printPDF = () => {
    const element = div.querySelector("#pimpinanTransaksiTable");
    const opt = {
      margin:       0.5,
      filename:     `laporan-transaksi-halaman-${currentPage}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    // Panggil library html2pdf untuk membuat dan menyimpan PDF
    html2pdf().from(element).set(opt).save();
  };

  // --- Fungsi API ---
  const fetchData = async () => {
    try {
      const response = await fetch('/.netlify/functions/get-admin-data');
      if (!response.ok) throw new Error('Gagal mengambil data dari server');
      const data = await response.json();
      allTransactions = data.transaksi;
      
      div.querySelector("#totalTransaksi").textContent = allTransactions.length;
      div.querySelector("#totalTiket").textContent = allTransactions.reduce((sum, trx) => sum + (trx.jumlah || 0), 0);
      
      renderPage();

      div.querySelector("#loading-message").style.display = 'none';
      div.querySelector("#pimpinan-content").style.display = 'block';
    } catch (error) {
      div.querySelector("#loading-message").textContent = `Error: ${error.message}`;
    }
  };

  // --- Event Listeners untuk Paginasi dan Cetak ---
  const setupEventListeners = () => {
    div.querySelector("#prevPageBtn").addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderPage();
        }
    });

    div.querySelector("#nextPageBtn").addEventListener('click', () => {
        const totalPages = Math.ceil(allTransactions.length / rowsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderPage();
        }
    });

    // PENAMBAHAN: Event listener untuk tombol cetak
    div.querySelector("#printPdfBtn").addEventListener('click', printPDF);
  };

  // --- Inisialisasi ---
  fetchData();
  setupEventListeners();

  return div;
}
