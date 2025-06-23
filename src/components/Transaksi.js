export default function TransaksiPage(navigateToDashboard) {
  const container = document.createElement("div");

  const transaksi = JSON.parse(localStorage.getItem("transaksi") || "[]");

  container.innerHTML = `
    <h2>Data Transaksi</h2>
    <table border="1" cellpadding="5" cellspacing="0">
      <thead>
        <tr>
          <th>ID Transaksi</th>
          <th>ID Pemesanan</th>
          <th>Total Harga</th>
          <th>Tanggal Kunjungan</th>
        </tr>
      </thead>
      <tbody id="tbodyTransaksi"></tbody>
    </table>
    <br>
    <button id="btnKembali">Kembali ke Dashboard</button>
  `;

  const tbody = container.querySelector("#tbodyTransaksi");

  transaksi.forEach((trx, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>TRX-${trx.id}</td>
      <td>${index + 1}</td>
      <td>Rp${trx.total}</td>
      <td>${trx.tanggal}</td>
    `;
    tbody.appendChild(tr);
  });

  container.querySelector("#btnKembali").addEventListener("click", () => {
    if (navigateToDashboard) {
      navigateToDashboard();
    } else {
      window.history.back(); // fallback
    }
  });

  return container;
}
