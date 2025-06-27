// src/pages/AdminPage.js

export default function AdminPage() {
  const div = document.createElement("div");
  div.className = "admin-container";
  // Menambahkan styling dasar agar lebih rapi
  div.innerHTML = `
    <style>
      .admin-form { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 10px; align-items: center; }
      .admin-form input { padding: 8px; border: 1px solid #ccc; border-radius: 4px; flex-grow: 1; }
      .admin-form button { padding: 8px 12px; cursor: pointer; background-color: #28a745; color: white; border: none; border-radius: 4px;}
      .admin-list { list-style: none; padding: 0; }
      .admin-list li { display: flex; justify-content: space-between; align-items: center; padding: 10px; border-bottom: 1px solid #eee; }
      .admin-list .item-info p { margin: 5px 0 0 0; font-size: 0.9em; color: #555; }
      .delete-btn { background-color: #dc3545; color: white; border: none; }
      #transaksiTable { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 0.9em; }
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
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 50px;">
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

  // --- State Aplikasi (data dari server) ---
  let destinasiList = [];
  let paketList = [];
  let transaksiList = [];

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
    tbody.innerHTML = "";
    transaksiList.forEach(trx => {
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
  };

  // --- Inisialisasi ---
  fetchData();
  setupEventListeners();

  return div;
}
