// src/pages/AdminPage.js
import Transaksi from '../components/Transaksi'; // 1. Impor komponen Transaksi yang reusable

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
      .stats-container { display: flex; flex-wrap: wrap; gap: 40px; }
      .stats-container p { font-size: 1.1rem; margin: 0; }
      .management-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
      .admin-form { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 15px; align-items: center; }
      .admin-form input { padding: 10px; border: 1px solid #ccc; border-radius: 5px; flex-grow: 1; font-size: 0.9rem;}
      .admin-form button { padding: 10px 15px; cursor: pointer; background-color: #007bff; color: white; border: none; border-radius: 5px; font-weight: 500;}
      .admin-list { list-style: none; padding: 0; }
      .admin-list li { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #f0f0f0; }
      .admin-list .item-info p { margin: 4px 0 0 0; font-size: 0.85em; color: #666; }
      .delete-btn { background-color: #dc3545; color: white; border: none; padding: 6px 10px; border-radius: 4px; cursor: pointer; }
      
      @media (max-width: 768px) {
        .management-grid { grid-template-columns: 1fr; }
        .stats-container { flex-direction: column; gap: 10px; }
      }
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

        <!-- 2. Area untuk menampilkan komponen Transaksi -->
        <div id="transaksi-component-wrapper"></div>
      
      </div>
    </section>
  `;

  // --- State Aplikasi (disederhanakan) ---
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
  
  // --- Fungsi API (disederhanakan) ---
  const fetchData = async () => {
    const loadingMessage = div.querySelector("#loading-message");
    const adminContent = div.querySelector("#admin-content");
    try {
      const user = netlifyIdentity.currentUser();
      if (!user) throw new Error('Otorisasi gagal. Silakan login kembali.');

      const headers = { 'Authorization': `Bearer ${user.token.access_token}` };
      const response = await fetch('/.netlify/functions/get-history-data?scope=admin', { headers });
      if (!response.ok) throw new Error('Gagal mengambil data dari server');
      const data = await response.json();

      destinasiList = data.destinasi;
      paketList = data.paket;
      
      div.querySelector("#totalTransaksi").textContent = data.transaksi.length;
      div.querySelector("#totalTiket").textContent = data.transaksi.reduce((sum, trx) => sum + (trx.jumlah || 0), 0);

      reRenderAll();

      loadingMessage.style.display = 'none';
      adminContent.style.display = 'block';

      // Panggil komponen Transaksi setelah data utama dimuat
      const transaksiWrapper = div.querySelector("#transaksi-component-wrapper");
      transaksiWrapper.innerHTML = ''; // Bersihkan wrapper
      transaksiWrapper.appendChild(
        Transaksi({ 
          initialData: data.transaksi, 
          adminFeatures: true, 
          scope: 'admin' 
        })
      );

    } catch (error) {
      loadingMessage.textContent = `Error: ${error.message}`;
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
  };

  // --- Inisialisasi ---
  fetchData();
  setupEventListeners();

  return div;
}