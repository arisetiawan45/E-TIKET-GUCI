export default function AdminPage() {
  const div = document.createElement("div");
  div.className = "admin-container";
  // Menambahkan styling dasar agar lebih rapi
  div.innerHTML = `
    <style>
      .admin-form { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 10px; align-items: center; }
      .admin-form input { padding: 8px; border: 1px solid #ccc; border-radius: 4px; }
      .admin-form button { padding: 8px 12px; cursor: pointer; background-color: #28a745; color: white; border: none; border-radius: 4px;}
      .admin-list li { display: flex; justify-content: space-between; align-items: center; padding: 10px; border-bottom: 1px solid #eee; }
      .admin-list .item-info p { margin: 5px 0 0 0; font-size: 0.9em; color: #555; }
      .delete-btn { background-color: #dc3545; color: white; border: none; }
      #transaksiTable { width: 100%; border-collapse: collapse; margin-top: 20px; }
      #transaksiTable th, #transaksiTable td { border: 1px solid #ddd; padding: 8px; text-align: left; }
      #transaksiTable th { background-color: #f2f2f2; }
      .status-select { padding: 5px; border-radius: 4px; }
    </style>
    <section style="padding: 20px;">
      <h2>Halaman Admin</h2>
      <p id="loading-message">Memuat data admin...</p>
      
      <div id="admin-content" style="display: none;">
        <div style="margin-top: 20px; display: flex; gap: 40px;">
          <p><strong>Total Transaksi:</strong> <span id="totalTransaksi">0</span></p>
          <p><strong>Total Tiket Terjual:</strong> <span id="totalTiket">0</span></p>
        </div>

        <hr>
        <h3>Kelola Destinasi & Paket</h3>
        <div style="display: flex; gap: 50px;">
          <div style="flex: 1;">
            <h4>Destinasi Wisata</h4>
            <form id="formDestinasi" class="admin-form">
              <input type="text" name="nama" placeholder="Nama Destinasi" required>
              <input type="text" name="deskripsi" placeholder="Deskripsi Singkat">
              <input type="number" name="harga" placeholder="Harga (Rp)" required min="0">
              <button type="submit">Tambah</button>
            </form>
            <ul id="daftarDestinasi" class="admin-list"></ul>
          </div>
          <div style="flex: 1;">
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

        <hr>
        <h3>Kelola Transaksi</h3>
        <table id="transaksiTable">
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

      </div>
    </section>
  `;

  // --- State Aplikasi ---
  let destinasiList = [];
  let paketList = [];
  let transaksiList = [];

  // --- Fungsi Render ---
  const renderList = (list, containerId, type) => { /* ... (fungsi renderList tetap sama) ... */ };
  const reRenderAll = () => { /* ... (fungsi reRenderAll tetap sama) ... */ };

  const renderTransaksi = () => {
    const tbody = div.querySelector("#transaksiBody");
    tbody.innerHTML = "";
    transaksiList.forEach(trx => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${trx.id_transaksi}</td>
        <td>${trx.nama_pemesan}</td>
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
    // ... (listener untuk form dan CRUD item tetap sama) ...
    
    // Listener untuk mengubah status transaksi
    div.querySelector("#transaksiTable").addEventListener('change', async (e) => {
        if (e.target.classList.contains('status-select')) {
            const id = e.target.dataset.id;
            const status = e.target.value;
            
            e.target.disabled = true; // Nonaktifkan sementara
            try {
                const response = await fetch('/.netlify/functions/update-transaction-status', {
                    method: 'PUT',
                    body: JSON.stringify({ id, status })
                });
                if (!response.ok) throw new Error('Gagal mengupdate status');
                // Status berhasil diupdate di server
            } catch (error) {
                alert(error.message);
                e.target.value = transaksiList.find(t => t.id_transaksi == id).status; // Kembalikan ke nilai semula jika gagal
            } finally {
                e.target.disabled = false;
            }
        }
    });
  };

  // --- Inisialisasi ---
  fetchData();
  setupEventListeners();

  return div;
}
