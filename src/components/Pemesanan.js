export function Pemesanan(navigateBack, navigateToTransaksi) {
    const form = document.createElement('div');
    form.innerHTML = `
      <section style="padding: 20px;">
        <h2>Form Pemesanan Tiket</h2>
        <form id="formPemesanan">
          <label for="nama">Nama Lengkap:</label><br>
          <input type="text" id="nama" name="nama" required><br><br>
  
          <label for="paket">Paket Wisata:</label><br>
          <select id="paket" name="paket" required>
            <option value="">--Pilih Paket--</option>
            <option value="paket1">Paket 1 - Kolam Renang</option>
            <option value="paket2">Paket 2 - Pemandian Air Panas</option>
            <option value="paket3">Paket 3 - Terusan Komplit</option>
          </select><br><br>
  
          <label for="jumlah">Jumlah Tiket:</label><br>
          <input type="number" id="jumlah" name="jumlah" min="1" required><br><br>
  
          <label for="tanggal">Tanggal Kunjungan:</label><br>
          <input type="date" id="tanggal" name="tanggal" required><br><br>
  
          <button type="submit" style="padding: 10px 20px;">Pesan Tiket</button>
        </form>
  
        <button id="btnKembali" style="margin-top: 20px;">Kembali ke Dashboard</button>
      </section>
    `;
  
    // Tangani submit form
    form.querySelector('#formPemesanan').addEventListener('submit', (e) => {
      e.preventDefault();
  
      const nama = form.querySelector('#nama').value;
      const paket = form.querySelector('#paket').value;
      const jumlah = form.querySelector('#jumlah').value;
      const tanggal = form.querySelector('#tanggal').value;
  
      const transaksi = {
        id: Date.now(),
        nama,
        paket,
        jumlah,
        tanggal
      };
  
      const semuaTransaksi = JSON.parse(localStorage.getItem('transaksi')) || [];
      semuaTransaksi.push(transaksi);
      localStorage.setItem('transaksi', JSON.stringify(semuaTransaksi));
  
      alert(`Tiket berhasil dipesan!`);
      navigateToTransaksi(); // langsung arahkan ke halaman transaksi
    });
  
    // Tombol kembali
    form.querySelector('#btnKembali').addEventListener('click', () => {
      navigateBack();
    });
  
    return form;
  }
  