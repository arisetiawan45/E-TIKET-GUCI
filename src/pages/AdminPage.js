// src/pages/AdminPage.js

export default function AdminPage() {
  const div = document.createElement("div");
  div.className = "admin-container";
  // Menambahkan styling dasar agar lebih rapi
  div.innerHTML = `
    <style>
      .admin-form { display: flex; gap: 10px; margin-bottom: 10px; align-items: center; }
      .admin-form input { padding: 8px; border: 1px solid #ccc; border-radius: 4px; }
      .admin-form button { padding: 8px 12px; cursor: pointer; }
      .admin-list li { display: flex; justify-content: space-between; align-items: center; padding: 10px; border-bottom: 1px solid #eee; }
      .admin-list .item-info p { margin: 5px 0 0 0; font-size: 0.9em; color: #555; }
      .delete-btn { background-color: #f44336; color: white; border: none; }
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
        <h3>Kelola Destinasi Wisata</h3>
        <form id="formDestinasi" class="admin-form">
          <input type="text" name="nama" placeholder="Nama Destinasi" required>
          <input type="text" name="deskripsi" placeholder="Deskripsi Singkat" required>
          <input type="number" name="harga" placeholder="Harga (Rp)" required min="0">
          <button type="submit">Tambah Destinasi</button>
        </form>
        <ul id="daftarDestinasi" class="admin-list"></ul>

        <hr>
        <h3>Kelola Paket Wisata</h3>
        <form id="formPaket" class="admin-form">
          <input type="text" name="nama" placeholder="Nama Paket" required>
          <input type="text" name="deskripsi" placeholder="Deskripsi Singkat" required>
          <input type="number" name="harga" placeholder="Harga (Rp)" required min="0">
          <button type="submit">Tambah Paket</button>
        </form>
        <ul id="daftarPaket" class="admin-list"></ul>
      </div>
    </section>
  `;

  // --- State Aplikasi (data dari server) ---
  let destinasiList = [];
  let paketList = [];

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

  // --- Fungsi API ---
  const fetchData = async () => {
    try {
      const response = await fetch('/.netlify/functions/get-admin-data');
      if (!response.ok) throw new Error('Gagal mengambil data dari server');
      const data = await response.json();

      destinasiList = data.destinasi;
      paketList = data.paket;
      
      div.querySelector("#totalTransaksi").textContent = data.transaksi.length;
      div.querySelector("#totalTiket").textContent = data.transaksi.reduce((sum, trx) => sum + (trx.jumlah_tiket || 0), 0);

      reRenderAll();

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
      if (!nama || !deskripsi || isNaN(harga) || harga < 0) {
        alert('Semua field (Nama, Deskripsi, Harga) harus diisi dengan benar.');
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
        const newDesc = prompt('Masukkan deskripsi baru:', item.deskripsi);
        const newHarga = prompt('Masukkan harga baru:', item.harga);

        if (newName === null || newDesc === null || newHarga === null) return;
        const hargaInt = parseInt(newHarga);
        if (!newName.trim() || !newDesc.trim() || isNaN(hargaInt) || hargaInt < 0) {
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
  };

  // --- Inisialisasi ---
  fetchData();
  setupEventListeners();

  return div;
}