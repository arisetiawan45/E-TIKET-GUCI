// src/pages/AdminPage.js

export default function AdminPage() {
  const div = document.createElement("div");
  div.className = "admin-container";
  // Menambahkan styling dasar agar lebih rapi
  div.innerHTML = `
    <style>
      .admin-card {
        background-color: #ffffff;
        padding: 25px;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        margin-bottom: 30px;
      }
      .admin-card h3 {
        margin-top: 0;
        font-size: 1.5rem;
        color: #333;
        border-bottom: 1px solid #eee;
        padding-bottom: 15px;
        margin-bottom: 20px;
      }
      .stats-container { display: flex; gap: 40px; }
      .stats-container p { font-size: 1.1rem; margin: 0; }
      .management-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
      .admin-form { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 15px; align-items: center; }
      .admin-form input { padding: 10px; border: 1px solid #ccc; border-radius: 5px; flex-grow: 1; font-size: 0.9rem;}
      .admin-form button { padding: 10px 15px; cursor: pointer; background-color: #007bff; color: white; border: none; border-radius: 5px; font-weight: 500;}
      .admin-list { list-style: none; padding: 0; }
      .admin-list li { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #f0f0f0; }
      .admin-list li:last-child { border-bottom: none; }
      .admin-list .item-info p { margin: 4px 0 0 0; font-size: 0.85em; color: #666; }
      .admin-list .actions button { margin-left: 8px; }
      .delete-btn { background-color: #dc3545; color: white; border: none; padding: 6px 10px; border-radius: 4px; cursor: pointer; }
      #transaksiTable { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 0.9em; }
      #transaksiTable th, #transaksiTable td { border: 1px solid #ddd; padding: 12px; text-align: left; }
      #transaksiTable th { 
        background-color: #f8f9fa; 
        cursor: pointer; 
        -webkit-user-select: none; /* PERBAIKAN: Untuk Safari */
        user-select: none; 
      }
      #transaksiTable th:hover { background-color: #e9ecef; }
      .sort-indicator { margin-left: 5px; font-size: 0.8em; }
      .status-select { padding: 5px; border-radius: 4px; border: 1px solid #ccc; }
      .pagination-controls { margin-top: 20px; display: flex; justify-content: space-between; align-items: center; }
      .pagination-buttons button { padding: 8px 16px; cursor: pointer; }
      .pagination-buttons button:disabled { cursor: not-allowed; opacity: 0.5; }
      .search-bar { margin-bottom: 20px; }
      .search-bar input { width: 300px; padding: 10px; border: 1px solid #ccc; border-radius: 5px; }
    </style>
    <section style="padding: 20px 0;">
      <h2>Halaman Admin</h2>
      <p id="loading-message">Memuat data admin...</p>
      
      <div id="admin-content" style="display: none;">
        
        <div class="admin-card">
          <h3>Statistik Situs</h3>
          <div class="stats-container">
            <p><strong>Total Transaksi:</strong> <span id="totalTransaksi">0</span></p>
            <p><strong>Total Tiket Terjual:</strong> <span id="totalTiket">0</span></p>
          </div>
        </div>

        <div class="admin-card">
            <h3>Kelola Destinasi & Paket</h3>
            <div class="management-grid">
                <div>
                    <h4>Destinasi Wisata</h4>
                    <form id="formDestinasi" class="admin-form">
                        <input type="text" name="nama" placeholder="Nama Destinasi" required>
                        <input type="text" name="deskripsi" placeholder="Deskripsi Singkat">
                        <input type="number" name="harga" placeholder="Harga (Rp)" required min="0">
                        <button type="submit">Tambah</button>
                    </form>
                    <ul id="daftarDestinasi" class="admin-list"></ul>
                </div>
                <div>
                    <h4>Paket Wisata</h4>
                    <form id="formPaket" class="admin-form">
                        <input type="text" name="nama" placeholder="Nama Paket" required>
                        <input type="text" name="deskripsi" placeholder="Deskripsi Singkat">
                        <input type="number" name="harga" placeholder="Harga (Rp)" required min="0">
                        <button type="submit">Tambah</button>
                    </form>
                    <ul id="daftarPaket" class="admin-list"></ul>
                </div>
            </div>
        </div>

        <div class="admin-card">
            <h3>Kelola Transaksi</h3>
            <div class="search-bar">
              <input type="search" id="searchInput" placeholder="Cari nama pemesan...">
            </div>
            <table id="transaksiTable">
                <thead>
                    <tr>
                      <th data-sort="id_transaksi">ID <span class="sort-indicator"></span></th>
                      <th data-sort="nama_pemesan">Nama Pemesan <span class="sort-indicator"></span></th>
                      <th data-sort="tanggal_kunjungan">Tgl Kunjungan <span class="sort-indicator"></span></th>
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
    </section>
  `;

  // --- State Aplikasi ---
  let destinasiList = [];
  let paketList = [];
  let transaksiList = []; // Data asli dari server
  let filteredTransaksi = []; // Data yang akan ditampilkan setelah filter, sort, dll.
  let currentPage = 1;
  const rowsPerPage = 10;
  let sortColumn = 'id_transaksi';
  let sortDirection = 'desc';
  let searchTerm = '';

  // --- Fungsi Render ---
  const renderList = (list, containerId, type) => {
    const ul = div.querySelector(containerId);
    ul.innerHTML = "";
    list.forEach(item => {
      const li = document.createElement("li");
      li.innerHTML = `
        <div class="item-info">
          <strong>${item.nama}</strong> - <span>Rp ${Number(item.harga).toLocaleString('id-ID')}</span>
          <p>${item.deskripsi || 'Tidak ada deskripsi'}</p>
        </div>
        <div class="actions">
          <button data-id="${item.id}" data-type="${type}" data-action="edit">Edit</button>
          <button data-id="${item.id}" data-type="${type}" data-action="delete" class="delete-btn">Hapus</button>
        </div>
      `;
      ul.appendChild(li);
    });
  };
  const reRenderAll = () => {
    renderList(destinasiList, "#daftarDestinasi", "destinasi");
    renderList(paketList, "#daftarPaket", "paket");
  };
  
  const renderTransaksi = () => {
    const tbody = div.querySelector("#transaksiBody");
    const pageIndicator = div.querySelector("#pageIndicator");
    const prevBtn = div.querySelector("#prevPageBtn");
    const nextBtn = div.querySelector("#nextPageBtn");
    tbody.innerHTML = "";

    // 1. Lakukan Pencarian (Filtering)
    filteredTransaksi = transaksiList.filter(trx => 
        trx.nama_pemesan.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 2. Lakukan Penyortiran (Sorting) pada data yang sudah difilter
    const sortedTransaksi = [...filteredTransaksi].sort((a, b) => {
        const valA = a[sortColumn];
        const valB = b[sortColumn];
        let comparison = 0;
        if (valA > valB) {
            comparison = 1;
        } else if (valA < valB) {
            comparison = -1;
        }
        return sortDirection === 'desc' ? comparison * -1 : comparison;
    });

    // 3. Lakukan Paginasi pada data yang sudah disortir
    const totalPages = Math.ceil(sortedTransaksi.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const pageData = sortedTransaksi.slice(startIndex, startIndex + rowsPerPage);

    // Render baris tabel untuk halaman saat ini
    pageData.forEach(trx => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${trx.id_transaksi}</td>
        <td>${trx.nama_pemesan || 'N/A'}</td>
        <td>${new Date(trx.tanggal_kunjungan).toLocaleDateString('id-ID')}</td>
        <td>${trx.jumlah}</td>
        <td>Rp ${Number(trx.total).toLocaleString('id-ID')}</td>
        <td>
          <select class="status-select" data-id="${trx.id_transaksi}">
            <option value="Pending" ${trx.status === 'Pending' ? 'selected' : ''}>Pending</option>
            <option value="Dibayar" ${trx.status === 'Dibayar' ? 'selected' : ''}>Dibayar</option>
          </select>
        </td>
      `;
      tbody.appendChild(tr);
    });
    
    // Update kontrol paginasi
    pageIndicator.textContent = `Halaman ${currentPage} dari ${totalPages || 1}`;
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage >= totalPages;

    // Update indikator sort
    div.querySelectorAll('#transaksiTable th').forEach(th => {
        const indicator = th.querySelector('.sort-indicator');
        if (th.dataset.sort === sortColumn) {
            indicator.textContent = sortDirection === 'asc' ? '▲' : '▼';
        } else {
            indicator.textContent = '';
        }
    });
  };

  // --- Fungsi API ---
  const fetchData = async () => {
    try {
      const response = await fetch('/.netlify/functions/get-admin-data');
      if (!response.ok) throw new Error('Gagal mengambil data dari server');
      const data = await response.json();

      destinasiList = data.destinasi;
      paketList = data.paket;
      transaksiList = data.transaksi;
      
      div.querySelector("#totalTransaksi").textContent = transaksiList.length;
      div.querySelector("#totalTiket").textContent = transaksiList.reduce((sum, trx) => sum + (trx.jumlah || 0), 0);

      reRenderAll();
      renderTransaksi();

      div.querySelector("#loading-message").style.display = 'none';
      div.querySelector("#admin-content").style.display = 'block';
    } catch (error) {
      div.querySelector("#loading-message").textContent = `Error: ${error.message}`;
    }
  };

  // --- Event Listeners ---
  const setupEventListeners = () => {
    const handleFormSubmit = async (e, type) => {
      e.preventDefault();
      const form = e.target;
      const nama = form.nama.value.trim();
      const deskripsi = form.deskripsi.value.trim();
      const harga = parseInt(form.harga.value);
      if (!nama || isNaN(harga) || harga < 0) {
        alert('Nama dan Harga harus diisi dengan benar.');
        return;
      }
      try {
        const response = await fetch('/.netlify/functions/add-item', {
          method: 'POST',
          body: JSON.stringify({ type, nama, deskripsi, harga })
        });
        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.error || `Gagal menambah ${type}`);
        }
        const newItem = await response.json();
        
        if (type === 'destinasi') destinasiList.push(newItem);
        else paketList.push(newItem);
        
        reRenderAll();
        form.reset();
      } catch (error) {
        alert(error.message);
      }
    };

    div.querySelector("#formDestinasi").addEventListener("submit", (e) => handleFormSubmit(e, 'destinasi'));
    div.querySelector("#formPaket").addEventListener("submit", (e) => handleFormSubmit(e, 'paket'));
    
    div.addEventListener('click', async (e) => {
      const { id, type, action } = e.target.dataset;
      if (!id || !type || !action) return;

      if (action === 'delete') {
        if (!confirm('Apakah Anda yakin ingin menghapus item ini?')) return;
        try {
          const response = await fetch(`/.netlify/functions/delete-item?type=${type}&id=${id}`, { method: 'DELETE' });
          if (!response.ok) throw new Error('Gagal menghapus item');
          
          if (type === 'destinasi') destinasiList = destinasiList.filter(item => item.id != id);
          if (type === 'paket') paketList = paketList.filter(item => item.id != id);
          reRenderAll();
        } catch (error) {
          alert(error.message);
        }
      }

      if (action === 'edit') {
        const list = type === 'destinasi' ? destinasiList : paketList;
        const item = list.find(i => i.id == id);
        
        const newName = prompt('Masukkan nama baru:', item.nama);
        const newDesc = prompt('Masukkan deskripsi baru:', item.deskripsi || '');
        const newHarga = prompt('Masukkan harga baru:', item.harga);

        if (newName === null || newDesc === null || newHarga === null) return;
        const hargaInt = parseInt(newHarga);
        if (!newName.trim() || isNaN(hargaInt) || hargaInt < 0) {
          alert('Input tidak valid');
          return;
        }
        try {
          const response = await fetch('/.netlify/functions/update-item', {
            method: 'PUT',
            body: JSON.stringify({ type, id, nama: newName.trim(), deskripsi: newDesc.trim(), harga: hargaInt })
          });
          if (!response.ok) throw new Error('Gagal mengupdate item');
          const updatedItem = await response.json();
          
          const index = list.findIndex(i => i.id == id);
          list[index] = updatedItem;
          reRenderAll();
        } catch(error) {
          alert(error.message);
        }
      }
    });

    div.querySelector("#transaksiTable").addEventListener('change', async (e) => {
        if (e.target.classList.contains('status-select')) {
            const id = e.target.dataset.id;
            const status = e.target.value;
            
            e.target.disabled = true;
            try {
                const response = await fetch('/.netlify/functions/update-transaction-status', {
                    method: 'PUT',
                    body: JSON.stringify({ id, status })
                });
                if (!response.ok) throw new Error('Gagal mengupdate status');
            } catch (error) {
                alert(error.message);
                e.target.value = transaksiList.find(t => t.id_transaksi == id).status;
            } finally {
                e.target.disabled = false;
            }
        }
    });
    // Listener untuk Paginasi
    div.querySelector("#prevPageBtn").addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderTransaksi();
        }
    });
    div.querySelector("#nextPageBtn").addEventListener('click', () => {
        const totalPages = Math.ceil(filteredTransaksi.length / rowsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderTransaksi();
        }
    });

    // Listener untuk Sorting
    div.querySelectorAll('#transaksiTable th[data-sort]').forEach(header => {
        header.addEventListener('click', () => {
            const newSortColumn = header.dataset.sort;
            if (sortColumn === newSortColumn) {
                sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
            } else {
                sortColumn = newSortColumn;
                sortDirection = 'asc';
            }
            currentPage = 1; // Kembali ke halaman pertama setelah sort
            renderTransaksi();
        });
    });

    // Listener untuk Search Input
    div.querySelector('#searchInput').addEventListener('input', (e) => {
        searchTerm = e.target.value;
        currentPage = 1; // Selalu kembali ke halaman pertama saat mencari
        renderTransaksi();
    });
  };

  // --- Inisialisasi ---
  fetchData();
  setupEventListeners();

  return div;
}
