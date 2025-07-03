
export default function Pemesanan(navigateToTransaksi) {
    const div = document.createElement("div");
    div.innerHTML = `
    <style>
      .pemesanan-card { max-width: 700px; margin: 20px auto; padding: 30px 40px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.1); }
      .pemesanan-card h2 { text-align: center; margin-top: 0; margin-bottom: 30px; font-size: 1.8rem; color: #333; }
      .form-group { margin-bottom: 20px; }
      .form-group label { display: block; margin-bottom: 8px; font-weight: 500; color: #555; }
      .form-group input, .form-group select { width: 100%; padding: 12px; border: 1px solid #ccc; border-radius: 5px; box-sizing: border-box; font-size: 1rem; }
      .total-price-display { text-align: right; font-size: 1.2rem; font-weight: bold; margin: 30px 0; }
      #btnSubmit { width: 100%; padding: 15px; font-size: 1.1rem; font-weight: bold; color: white; background-color: #28a745; border: none; border-radius: 5px; cursor: pointer; transition: background-color 0.2s; }
      #btnSubmit:hover { background-color: #218838; }
      #btnSubmit:disabled { background-color: #5a9d6a; cursor: not-allowed; }
      #formMessage { text-align: center; }
      /* --- Media Query untuk HP --- */
      @media (max-width: 768px) {
        .pemesanan-card { margin: 20px 10px; padding: 20px; }
        .pemesanan-card h2 { font-size: 1.5rem; }
      }
    </style>
    <div class="pemesanan-card">
      <p id="loadingMessage" style="text-align: center;">Memuat data destinasi dan paket...</p>
      <form id="formPemesanan" style="display: none;">
        <h2>Formulir Pemesanan Tiket</h2>
        <div class="form-group">
          <label for="namaPemesan">Nama Pemesan</label>
          <input type="text" id="namaPemesan" name="namaPemesan" placeholder="Masukkan nama lengkap Anda" required>
        </div>
        <div class="form-group">
          <label for="tanggal">Tanggal Kunjungan</label>
          <input type="date" id="tanggal" name="tanggal" required>
        </div>
        <div class="form-group">
          <label for="jenisTiket">Jenis Tiket</label>
          <select name="jenis" id="jenisTiket" required>
            <option value="biasa">Biasa (Per Destinasi)</option>
            <option value="paket">Paket Terusan</option>
          </select>
        </div>
        <div id="destinasiWrapper" class="form-group">
          <label for="destinasiSelect">Pilih Destinasi Wisata</label>
          <select name="destinasi" id="destinasiSelect"></select>
        </div>
        <div id="paketWrapper" class="form-group" style="display: none;">
          <label for="paketSelect">Pilih Paket Wisata</label>
          <select name="paket" id="paketSelect"></select>
        </div>
        <div class="form-group">
          <label for="jumlahTiket">Jumlah Tiket</label>
          <input type="number" name="jumlah" id="jumlahTiket" min="1" value="1" required>
        </div>
        <div class="total-price-display">
          Total Harga: <span id="totalHarga">Rp 0</span>
        </div>
        <button type="submit" id="btnSubmit">Lanjut ke Pembayaran</button>
        <div id="formMessage" style="margin-top: 15px; font-weight: bold; color: red;"></div>
      </form>
    </div>
  `;

  // Gunakan IIFE (Immediately Invoked Function Expression) async untuk memuat data
  (async () => {
    const loadingMessage = div.querySelector("#loadingMessage");
    const form = div.querySelector("#formPemesanan");
    const messageDiv = div.querySelector("#formMessage");
    const tanggalInput = div.querySelector("#tanggal");

    // Set tanggal minimum ke hari ini
    const today = new Date().toISOString().split("T")[0];
    tanggalInput.min = today;

    try {
      const response = await fetch('/.netlify/functions/get-initial-data');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Gagal memuat data dari server.');
      }
      const initialData = await response.json();

      const destinasiList = initialData.destinasi;
      const paketList = initialData.paket;
      
      const hargaList = {};
      destinasiList.forEach(item => { hargaList[item.nama] = item.harga; });
      paketList.forEach(item => { hargaList[item.nama] = item.harga; });
      
      loadingMessage.style.display = 'none';
      form.style.display = 'block';

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

      function updateHarga() {
        const jumlah = parseInt(jumlahInput.value) || 0;
        const isPaket = jenisTiket.value === "paket";
        const namaDipilih = isPaket ? paketSelect.value : destinasiSelect.value;
        const hargaSatuan = hargaList[namaDipilih] || 0;
        const total = jumlah * hargaSatuan;
        totalHargaSpan.textContent = `Rp ${total.toLocaleString("id-ID")}`;
      }
      
      jenisTiket.addEventListener("change", () => {
        const isPaket = jenisTiket.value === "paket";
        div.querySelector("#paketWrapper").style.display = isPaket ? "block" : "none";
        div.querySelector("#destinasiWrapper").style.display = isPaket ? "none" : "block";
        updateHarga();
      });

      jumlahInput.addEventListener("input", updateHarga);
      destinasiSelect.addEventListener("change", updateHarga);
      paketSelect.addEventListener("change", updateHarga);

      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const namaPemesan = form.namaPemesan.value.trim();
        const tanggalKunjungan = form.tanggal.value;
        if (!namaPemesan || !tanggalKunjungan) {
            messageDiv.textContent = "Error: Nama pemesan dan tanggal kunjungan wajib diisi.";
            return;
        }

        submitButton.disabled = true;
        submitButton.textContent = "Memproses...";
        messageDiv.textContent = "";

        const user = netlifyIdentity.currentUser();
        if (!user || !user.token) {
            messageDiv.textContent = 'Error: Anda harus login untuk melanjutkan.';
            submitButton.disabled = false;
            submitButton.textContent = "Lanjut ke Pembayaran";
            return;
        }

        const headers = {
            'Authorization': `Bearer ${user.token.access_token}`,
            'Content-Type': 'application/json'
        };

        const isPaket = jenisTiket.value === "paket";
        const jumlah = parseInt(jumlahInput.value);
        const hargaSatuan = hargaList[isPaket ? paketSelect.value : destinasiSelect.value] || 0;

        const data = {
          nama_pemesan: namaPemesan,
          tanggal_kunjungan: tanggalKunjungan,
          jenis_tiket: jenisTiket.value,
          jumlah_tiket: jumlah,
          total_harga: jumlah * hargaSatuan,
        };
        
        try {
          const saveResponse = await fetch('/.netlify/functions/create-transaction', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data),
          });

          if (!saveResponse.ok) {
            let errorMsg = 'Gagal menyimpan transaksi.';
            try {
              const errorData = await saveResponse.json();
              errorMsg = `Error dari server: ${errorData.details || errorData.error || 'Terjadi kesalahan tidak diketahui.'}`;
            } catch (parseError) {
              errorMsg = `Gagal menyimpan transaksi. Status: ${saveResponse.status} ${saveResponse.statusText}`;
            }
            throw new Error(errorMsg);
          }

          console.log('Transaksi berhasil disimpan!');
          if (navigateToTransaksi) navigateToTransaksi();

        } catch (error) {
          messageDiv.textContent = error.message;
          console.error("Detail error saat submit:", error);
        } finally {
          submitButton.disabled = false;
          submitButton.textContent = "Lanjut ke Pembayaran";
        }
      });

      updateHarga();

    } catch (error) {
      loadingMessage.textContent = `Error: ${error.message}`;
    }
  })();

  return div;
}
