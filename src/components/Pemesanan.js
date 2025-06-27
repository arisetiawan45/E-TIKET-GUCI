// components/Pemesanan.js

// Parameter disesuaikan menjadi navigateToTransaksi untuk navigasi setelah sukses
export default function Pemesanan(navigateToTransaksi) {
  const div = document.createElement("div");
  div.className = "pemesanan-container";

  // Tampilkan pesan loading awal
  div.innerHTML = `
    <h2>Form Pemesanan Tiket</h2>
    <p id="loadingMessage">Memuat data destinasi dan paket...</p>
    <form id="formPemesanan" style="display: none;"></form>
  `;

  // Gunakan IIFE (Immediately Invoked Function Expression) async untuk memuat data
  (async () => {
    try {
      // 1. Ambil data dari Netlify Function
      const response = await fetch('/.netlify/functions/get-initial-data');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Gagal memuat data dari server.');
      }
      const initialData = await response.json();

      // Olah data yang diterima dari Neon DB
      const destinasiList = initialData.destinasi;
      const paketList = initialData.paket;
      
      const hargaList = {};
      destinasiList.forEach(item => { hargaList[item.nama] = item.harga; });
      paketList.forEach(item => { hargaList[item.nama] = item.harga; });
      
      // Setelah data diterima, bangun sisa form
      const form = div.querySelector("#formPemesanan");
      const today = new Date().toISOString().split("T")[0];
      form.innerHTML = `
        <label for="namaPemesan">Nama Pemesan:</label><br>
        <input type="text" id="namaPemesan" name="nama" placeholder="Masukkan nama lengkap Anda" required><br><br>

        <label for="tanggal">Tanggal Kunjungan:</label><br>
        <input type="date" id="tanggal" name="tanggal" min="${today}" required><br><br>
        
        <label for="jenisTiket">Jenis Tiket:</label><br>
        <select name="jenis" id="jenisTiket" required>
          <option value="biasa">Biasa (Per Destinasi)</option>
          <option value="paket">Paket Terusan</option>
        </select><br><br>
        
        <div id="destinasiWrapper">
          <label for="destinasiSelect">Destinasi Wisata:</label><br>
          <select name="destinasi" id="destinasiSelect"></select><br><br>
        </div>
        <div id="paketWrapper" style="display: none;">
          <label for="paketSelect">Pilih Paket Wisata:</label><br>
          <select name="paket" id="paketSelect"></select><br><br>
        </div>
        
        <label for="jumlahTiket">Jumlah Tiket:</label><br>
        <input type="number" name="jumlah" id="jumlahTiket" min="1" value="1" required><br><br>
        
        <p><strong>Total Harga: </strong><span id="totalHarga">Rp 0</span></p>
        
        <button type="submit" id="btnSubmit">Lanjut Transaksi</button>
      `;
      
      const messageDiv = document.createElement('div');
      messageDiv.id = "formMessage";
      messageDiv.style.cssText = "margin-top: 15px; font-weight: bold; color: red;";
      form.insertAdjacentElement('afterend', messageDiv);
      
      // Sembunyikan pesan loading dan tampilkan form
      div.querySelector("#loadingMessage").style.display = 'none';
      form.style.display = 'block';

      // Elemen
      const jenisTiket = div.querySelector("#jenisTiket");
      const destinasiSelect = div.querySelector("#destinasiSelect");
      const paketSelect = div.querySelector("#paketSelect");
      const jumlahInput = div.querySelector("#jumlahTiket");
      const totalHargaSpan = div.querySelector("#totalHarga");
      const submitButton = div.querySelector("#btnSubmit");

      destinasiList.forEach(dest => {
        const option = document.createElement("option");
        option.value = dest.nama;
        option.textContent = `${dest.nama} (Rp ${Number(dest.harga).toLocaleString('id-ID')})`;
        destinasiSelect.appendChild(option);
      });

      paketList.forEach(paket => {
        const option = document.createElement("option");
        option.value = paket.nama;
        option.textContent = `${paket.nama} (Rp ${Number(paket.harga).toLocaleString('id-ID')})`;
        paketSelect.appendChild(option);
      });

      // Logika untuk menghitung total harga
      function updateHarga() {
        const jumlah = parseInt(jumlahInput.value) || 0;
        const isPaket = jenisTiket.value === "paket";
        const namaDipilih = isPaket ? paketSelect.value : destinasiSelect.value;
        const hargaSatuan = hargaList[namaDipilih] || 0;
        const total = jumlah * hargaSatuan;
        totalHargaSpan.textContent = `Rp ${total.toLocaleString("id-ID")}`;
      }
      
      // Event listeners untuk update harga otomatis
      jenisTiket.addEventListener("change", () => {
        const isPaket = jenisTiket.value === "paket";
        div.querySelector("#paketWrapper").style.display = isPaket ? "block" : "none";
        div.querySelector("#destinasiWrapper").style.display = isPaket ? "none" : "block";
        updateHarga();
      });

      jumlahInput.addEventListener("input", updateHarga);
      destinasiSelect.addEventListener("change", updateHarga);
      paketSelect.addEventListener("change", updateHarga);

      // Logika untuk submit form
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        submitButton.disabled = true;
        submitButton.textContent = "Memproses...";
        messageDiv.textContent = "";

        const isPaket = jenisTiket.value === "paket";
        const jumlah = parseInt(jumlahInput.value);
        const hargaSatuan = hargaList[isPaket ? paketSelect.value : destinasiSelect.value] || 0;

        // Menyesuaikan properti objek data dengan yang diharapkan backend
        const data = {
          nama_pemesan: form.nama.value,
          tanggal_kunjungan: form.tanggal.value,
          jenis_tiket: jenisTiket.value,
          jumlah_tiket: jumlah,
          total_harga: jumlah * hargaSatuan,
        };
        
        try {
          // PERBAIKAN: Endpoint disesuaikan menjadi 'create-transaction'
          const saveResponse = await fetch('/.netlify/functions/create-transaction', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          });

          if (!saveResponse.ok) {
            const errorData = await saveResponse.json();
            throw new Error(errorData.details || errorData.error || 'Gagal menyimpan transaksi ke server.');
          }

          console.log('Transaksi berhasil disimpan!');

          // Memanggil fungsi navigasi yang benar
          if (navigateToTransaksi) navigateToTransaksi();

        } catch (error) {
          messageDiv.textContent = error.message;
        } finally {
          submitButton.disabled = false;
          submitButton.textContent = "Lanjut Transaksi";
        }
      });

      // Panggil updateHarga untuk pertama kali
      updateHarga();

    } catch (error) {
      // Tangani error jika gagal memuat data awal
      div.querySelector("#loadingMessage").textContent = `Error: ${error.message}`;
      div.querySelector("#loadingMessage").style.color = 'red';
    }
  })();

  return div;
}