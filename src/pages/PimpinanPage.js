export function PimpinanPage(navigateToDashboard) {
    const div = document.createElement('div');
  
    const transaksiData = JSON.parse(localStorage.getItem('transaksi')) || [];
    const totalTiket = transaksiData.reduce((total, trx) => total + parseInt(trx.jumlah), 0);
  
    div.innerHTML = `
      <section style="padding: 20px;">
        <h2>Halaman Pimpinan</h2>
        <p>Selamat datang, Pimpinan!</p>
  
        <p>Berikut ringkasan performa penjualan tiket wisata:</p>
        <ul>
          <li><strong>Total Transaksi:</strong> ${transaksiData.length}</li>
          <li><strong>Total Tiket Terjual:</strong> ${totalTiket}</li>
        </ul>
  
        <button id="btnKembaliPimpinan" style="margin-top: 20px;">Kembali ke Dashboard</button>
      </section>
    `;
  
    div.querySelector('#btnKembaliPimpinan').addEventListener('click', () => {
      navigateToDashboard();
    });
  
    return div;
  }
  