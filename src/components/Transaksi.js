// components/Transaksi.js

export default function Transaksi() {
  const div = document.createElement("div");
  // Menambahkan styling dasar
  div.innerHTML = `
    <style>
      #transaksiUserTable { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 0.9em; }
      #transaksiUserTable th, #transaksiUserTable td { border: 1px solid #ddd; padding: 10px; text-align: left; }
      #transaksiUserTable th { background-color: #f2f2f2; }
    </style>
    <section style="padding: 20px;">
      <h2>Riwayat Transaksi Anda</h2>
      <p id="loadingMessage">Memuat riwayat transaksi...</p>
      <table id="transaksiUserTable" style="display: none;">
        <thead>
          <tr>
            <th>ID Transaksi</th>
            <th>Nama Pemesan</th>
            <th>Tanggal Kunjungan</th>
            <th>Jumlah Tiket</th>
            <th>Total Harga</th>
            <th>Status Pembayaran</th>
          </tr>
        </thead>
        <tbody id="transaksiBody"></tbody>
      </table>
    </section>
  `;

  // Gunakan IIFE async untuk memuat data
  (async () => {
    const loadingMessage = div.querySelector("#loadingMessage");
    const table = div.querySelector("#transaksiUserTable");
    const tbody = div.querySelector("#transaksiBody");

    try {
      // --- PERBAIKAN DI SINI ---
      const user = netlifyIdentity.currentUser();
      if (!user || !user.token) {
          throw new Error('Anda harus login untuk melihat riwayat transaksi.');
      }

      // Siapkan header dengan token otorisasi
      const headers = {
          'Authorization': `Bearer ${user.token.access_token}`
      };

      // Panggil fungsi Netlify yang baru dengan menyertakan header
      const response = await fetch('/.netlify/functions/get-user-transactions', { headers });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Gagal memuat data.');
      }
      
      const transactions = await response.json();

      // Sembunyikan pesan loading dan tampilkan tabel
      loadingMessage.style.display = 'none';
      table.style.display = 'table';

      if (transactions.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Anda belum memiliki riwayat transaksi.</td></tr>';
        return;
      }

      // Render setiap baris transaksi
      transactions.forEach(trx => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>TRX-${trx.id_transaksi}</td>
          <td>${trx.nama_pemesan}</td>
          <td>${new Date(trx.tanggal_kunjungan).toLocaleDateString('id-ID')}</td>
          <td>${trx.jumlah}</td>
          <td>Rp ${Number(trx.total).toLocaleString('id-ID')}</td>
          <td>${trx.status}</td>
        `;
        tbody.appendChild(tr);
      });

    } catch (error) {
      loadingMessage.textContent = `Error: ${error.message}`;
      loadingMessage.style.color = 'red';
    }
  })();

  return div;
}