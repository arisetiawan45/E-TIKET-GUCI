export function Transaksi() {
    const div = document.createElement('div');
    div.innerHTML = `
      <section style="padding: 20px;">
        <h2>Riwayat Transaksi Tiket</h2>
        <table border="1" cellspacing="0" cellpadding="10" style="width: 100%; margin-top: 20px;">
          <thead>
            <tr>
              <th>No</th>
              <th>Nama</th>
              <th>Paket Wisata</th>
              <th>Jumlah Tiket</th>
              <th>Tanggal Kunjungan</th>
              <th>Nota</th>
            </tr>
          </thead>
          <tbody id="transaksiBody">
          </tbody>
        </table>
      </section>
    `;
  
    const tbody = div.querySelector('#transaksiBody');
    const transaksiData = JSON.parse(localStorage.getItem('transaksi')) || [];
  
    if (transaksiData.length === 0) {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td colspan="6" style="text-align: center;">Belum ada transaksi</td>`;
      tbody.appendChild(tr);
    } else {
      transaksiData.forEach((trx, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${index + 1}</td>
          <td>${trx.nama}</td>
          <td>${trx.paket}</td>
          <td>${trx.jumlah}</td>
          <td>${trx.tanggal}</td>
          <td>TRX-${trx.id}</td>
        `;
        tbody.appendChild(tr);
      });
    }
  
    return div;
  }
  