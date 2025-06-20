export function AdminPage(navigateToDashboard) {
    const div = document.createElement('div');
  
    const transaksiData = JSON.parse(localStorage.getItem('transaksi')) || [];
  
    const totalTransaksi = transaksiData.length;
    const totalTiket = transaksiData.reduce((total, trx) => total + parseInt(trx.jumlah), 0);
  
    div.innerHTML = `
      <section style="padding: 20px;">
        <h2>Halaman Admin</h2>
        <p>Selamat datang, Admin!</p>
  
        <div style="margin-top: 20px;">
          <p><strong>Total Transaksi:</strong> ${totalTransaksi}</p>
          <p><strong>Total Tiket Terjual:</strong> ${totalTiket}</p>
        </div>
  
        <button id="btnDashboard" style="margin-top: 20px;">Kembali ke Dashboard</button>
      </section>
    `;
  
    div.querySelector('#btnDashboard').addEventListener('click', () => {
      navigateToDashboard();
    });
  
    return div;
  }
  