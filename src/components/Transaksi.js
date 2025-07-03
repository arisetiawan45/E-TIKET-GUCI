// components/Transaksi.js

// Komponen ini sekarang memiliki fitur lengkap: sorting, paginasi, search, dan print.
// Menerima 'props' untuk menentukan cakupan data (scope) dan apakah fitur admin harus aktif.
export default function Transaksi(props = { scope: 'user', adminFeatures: false, initialData: null }) {
  const { scope, adminFeatures, initialData } = props;
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
      #printPdfBtn:disabled { background-color: #5a9ed8; cursor: not-allowed; }
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

  // --- PERBAIKAN: Fungsi Cetak PDF ---
  const printPDF = () => {
    const printBtn = div.querySelector('#printPdfBtn');
    if (!printBtn) return;

    printBtn.disabled = true;
    printBtn.textContent = 'Mempersiapkan...';

    const printElement = document.createElement('div');
    printElement.style.padding = '20px';
    printElement.style.fontFamily = 'sans-serif';

    const reportTitle = document.createElement('h2');
    reportTitle.textContent = 'Laporan Riwayat Transaksi';
    const reportDate = document.createElement('p');
    reportDate.textContent = `Dicetak pada: ${new Date().toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'long' })}`;
    reportDate.style.marginBottom = '20px';
    printElement.appendChild(reportTitle);
    printElement.appendChild(reportDate);

    const printTable = document.createElement('table');
    printTable.style.width = '100%';
    printTable.style.borderCollapse = 'collapse';
    printTable.innerHTML = `
      <thead style="background-color: #f2f2f2;">
        <tr>
          <th style="border: 1px solid #ddd; padding: 8px;">ID</th>
          <th style="border: 1px solid #ddd; padding: 8px;">Nama Pemesan</th>
          <th style="border: 1px solid #ddd; padding: 8px;">Tgl Kunjungan</th>
          <th style="border: 1px solid #ddd; padding: 8px;">Waktu Transaksi</th>
          <th style="border: 1px solid #ddd; padding: 8px;">Jumlah</th>
          <th style="border: 1px solid #ddd; padding: 8px;">Total</th>
          <th style="border: 1px solid #ddd; padding: 8px;">Status</th>
        </tr>
      </thead>
      <tbody></tbody>
    `;
    const printTbody = printTable.querySelector('tbody');
    
    const sortedData = [...filteredTransactions].sort((a, b) => {
        const valA = a[sortColumn]; const valB = b[sortColumn];
        let comparison = 0;
        if (valA > valB) comparison = 1; else if (valA < valB) comparison = -1;
        return sortDirection === 'desc' ? comparison * -1 : comparison;
    });

    sortedData.forEach(trx => {
        const tr = document.createElement('tr');
        const waktuTransaksi = trx.tanggal_transaksi ? new Date(trx.tanggal_transaksi).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'N/A';
        tr.innerHTML = `
            <td style="border: 1px solid #ddd; padding: 8px;">${trx.id_transaksi}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${trx.nama_pemesan || 'N/A'}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${new Date(trx.tanggal_kunjungan).toLocaleDateString('id-ID')}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${waktuTransaksi}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${trx.jumlah}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">Rp ${Number(trx.total).toLocaleString('id-ID')}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${trx.status}</td>
        `;
        printTbody.appendChild(tr);
    });

    printElement.appendChild(printTable);

    printElement.style.position = 'absolute';
    printElement.style.left = '-9999px';
    document.body.appendChild(printElement);

    const opt = {
      margin:       0.5,
      filename:     `laporan-transaksi.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'landscape' }
    };

    // Memberi jeda singkat agar browser bisa merender elemen sebelum dicetak
    setTimeout(() => {
        html2pdf().from(printElement).set(opt).save().then(() => {
            document.body.removeChild(printElement);
            printBtn.disabled = false;
            printBtn.textContent = 'Cetak Laporan';
        }).catch(err => {
            console.error("Gagal membuat PDF:", err);
            document.body.removeChild(printElement);
            printBtn.disabled = false;
            printBtn.textContent = 'Cetak Laporan';
        });
    }, 100);
  };

  const renderTable = () => {
    filteredTransactions = transactions.filter(trx =>
      (trx.nama_pemesan || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const sortedTransactions = [...filteredTransactions].sort((a, b) => {
      const valA = a[sortColumn];
      const valB = b[sortColumn];
      let comparison = 0;
      if (valA > valB) comparison = 1;
      else if (valA < valB) comparison = -1;
      return sortDirection === 'desc' ? comparison * -1 : comparison;
    });
    
    const totalPages = Math.ceil(sortedTransactions.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const pageData = sortedTransactions.slice(startIndex, startIndex + rowsPerPage);

    tbody.innerHTML = "";
    if (pageData.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align: center;">Tidak ada data yang cocok.</td></tr>`;
    } else {
      pageData.forEach(trx => {
        const tr = document.createElement("tr");
        const waktuTransaksi = trx.tanggal_transaksi ? new Date(trx.tanggal_transaksi).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'N/A';
        tr.innerHTML = `
          <td>${trx.id_transaksi}</td>
          <td>${trx.nama_pemesan || 'N/A'}</td>
          <td>${new Date(trx.tanggal_kunjungan).toLocaleDateString('id-ID')}</td>
          <td>${waktuTransaksi}</td>
          <td>${trx.jumlah}</td>
          <td>Rp ${Number(trx.total).toLocaleString('id-ID')}</td>
          <td>${trx.status}</td>
        `;
        tbody.appendChild(tr);
      });
    }

    div.querySelector("#pageIndicator").textContent = `Halaman ${currentPage} dari ${totalPages || 1}`;
    div.querySelector("#prevPageBtn").disabled = currentPage === 1;
    div.querySelector("#nextPageBtn").disabled = currentPage >= totalPages;

    div.querySelectorAll('#transaksiTable th').forEach(th => {
      const indicator = th.querySelector('.sort-indicator');
      indicator.textContent = th.dataset.sort === sortColumn ? (sortDirection === 'asc' ? '▲' : '▼') : '';
    });
  };

  const fetchData = async () => {
    try {
      if (initialData) {
        transactions = initialData;
      } else {
        const user = netlifyIdentity.currentUser();
        if (!user) throw new Error('Otorisasi gagal.');

        const endpoint = `/.netlify/functions/get-history-data?scope=${scope}`;
        const headers = { 'Authorization': `Bearer ${user.token.access_token}` };
        const response = await fetch(endpoint, { headers });
        
        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.error || 'Gagal memuat data.');
        }
        
        const data = await response.json();
        transactions = (scope === 'user') ? data : data.transaksi;
      }

      loadingMessage.style.display = 'none';
      contentDiv.style.display = 'block';
      renderTable();
    } catch (error) {
      loadingMessage.textContent = `Error: ${error.message}`;
      loadingMessage.style.color = 'red';
    }
  };

  // Event Listeners
  div.querySelectorAll('#transaksiTable th[data-sort]').forEach(header => {
    header.addEventListener('click', () => {
      const newSortColumn = header.dataset.sort;
      if (sortColumn === newSortColumn) {
        sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        sortColumn = newSortColumn;
        sortDirection = 'asc';
      }
      currentPage = 1;
      renderTable();
    });
  });

  div.querySelector("#prevPageBtn").addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        renderTable();
    }
  });
  div.querySelector("#nextPageBtn").addEventListener('click', () => {
    const totalPages = Math.ceil(filteredTransactions.length / rowsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        renderTable();
    }
  });

  if (adminFeatures) {
    div.querySelector('#searchInput').addEventListener('input', (e) => {
        searchTerm = e.target.value;
        currentPage = 1;
        renderTable();
    });
    div.querySelector('#printPdfBtn').addEventListener('click', printPDF);
  }

  fetchData();
  return div;
}
