// components/Pemesanan.js

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
      
      const form = div.querySelector("#formPemesanan");
      const today = new Date().toISOString().split("T")[0];
      form.innerHTML = `
        <label for="namaPemesan">Nama Pemesan:</label><br>
        <input type="text" id="namaPemesan" name="namaPemesan" placeholder="Masukkan nama lengkap Anda" required><br><br>

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
      
      div.querySelector("#loadingMessage").style.display = 'none';
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
        
        // --- PENAMBAHAN: Validasi Client-side ---
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
            submitButton.textContent = "Lanjut Transaksi";
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
          nama_pemesan: namaPemesan, // Menggunakan variabel yang sudah divalidasi
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

          // --- PENAMBAHAN: Penanganan Error yang Lebih Detail ---
          if (!saveResponse.ok) {
            let errorMsg = 'Gagal menyimpan transaksi.';
            try {
              // Coba dapatkan pesan error spesifik dari backend
              const errorData = await saveResponse.json();
              errorMsg = `Error dari server: ${errorData.details || errorData.error || 'Terjadi kesalahan tidak diketahui.'}`;
            } catch (parseError) {
              // Jika backend tidak mengirim JSON (misalnya error 502 atau timeout)
              errorMsg = `Gagal menyimpan transaksi. Status: ${saveResponse.status} ${saveResponse.statusText}`;
            }
            throw new Error(errorMsg);
          }

          console.log('Transaksi berhasil disimpan!');
          if (navigateToTransaksi) navigateToTransaksi();

        } catch (error) {
          // Menampilkan pesan error yang lebih informatif kepada pengguna
          messageDiv.textContent = error.message;
          console.error("Detail error saat submit:", error); // Juga log ke console untuk debugging
        } finally {
          submitButton.disabled = false;
          submitButton.textContent = "Lanjut Transaksi";
        }
      });

      updateHarga();

    } catch (error) {
      div.querySelector("#loadingMessage").textContent = `Error: ${error.message}`;
      div.querySelector("#loadingMessage").style.color = 'red';
    }
  })();

  return div;
}
