export default function Pemesanan(onSubmitCallback) {
  const div = document.createElement("div");
  div.className = "pemesanan-container";

  const today = new Date().toISOString().split("T")[0];

  div.innerHTML = `
    <h2>Form Pemesanan Tiket</h2>
    <form id="formPemesanan">
      <label>Tanggal Kunjungan:</label><br>
      <input type="date" id="tanggal" name="tanggal" min="${today}" required><br><br>

      <label>Jenis Tiket:</label><br>
      <select name="jenis" id="jenisTiket" required>
        <option value="biasa">Biasa (Per Destinasi)</option>
        <option value="paket">Paket Terusan</option>
      </select><br><br>

      <div id="destinasiWrapper">
        <label>Destinasi Wisata:</label><br>
        <select name="destinasi" id="destinasiSelect">
          <option value="Curug Guci">Curug Guci</option>
          <option value="Pemandian Air Panas">Pemandian Air Panas</option>
          <option value="Gunung Slamet">Gunung Slamet</option>
        </select><br><br>
      </div>

      <div id="paketWrapper" style="display: none;">
        <label>Pilih Paket Wisata:</label><br>
        <select name="paket" id="paketSelect">
          <option value="paket1">Paket 1 - Curug + Air Panas</option>
          <option value="paket2">Paket 2 - Gunung + Air Panas</option>
        </select><br><br>
      </div>

      <label>Jumlah Tiket:</label><br>
      <input type="number" name="jumlah" min="1" required><br><br>

      <button type="submit" id="btnSubmit">Lanjut Transaksi</button>
    </form>
    
    <!-- Elemen untuk menampilkan pesan error -->
    <div id="formMessage" style="margin-top: 15px; font-weight: bold; color: red;"></div>

    <br>
    <button id="btnKembaliDashboard">Kembali ke Dashboard</button>
  `;

  // --- Ambil Referensi Elemen ---
  const form = div.querySelector("#formPemesanan");
  const jenisTiket = div.querySelector("#jenisTiket");
  const destinasiWrapper = div.querySelector("#destinasiWrapper");
  const paketWrapper = div.querySelector("#paketWrapper");
  const submitButton = div.querySelector("#btnSubmit");
  const messageDiv = div.querySelector("#formMessage");

  // --- Logika Tampilan Form ---
  const toggleTicketType = () => {
    const isPaket = jenisTiket.value === "paket";
    paketWrapper.style.display = isPaket ? "block" : "none";
    destinasiWrapper.style.display = isPaket ? "none" : "block";

    // Membuat input opsional/wajib berdasarkan pilihan
    div.querySelector("#paketSelect").required = isPaket;
    div.querySelector("#destinasiSelect").required = !isPaket;
  };

  jenisTiket.addEventListener("change", toggleTicketType);
  toggleTicketType(); // Inisialisasi tampilan saat komponen dimuat

  // --- Logika Tombol Kembali ---
  div.querySelector("#btnKembaliDashboard").addEventListener("click", () => {
    location.hash = "#dashboard";
  });

  // --- Logika Submit Form (Sudah Disesuaikan) ---
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Memberi umpan balik ke pengguna
    submitButton.disabled = true;
    submitButton.textContent = "Memproses...";
    messageDiv.textContent = "";

    const isPaket = form.jenis.value === "paket";
    
    // 1. Kumpulkan data dari form
    const data = {
      tanggal: form.tanggal.value,
      jenis: form.jenis.value,
      // Jika paket, destinasi null. Jika biasa, paket null.
      destinasi: !isPaket ? form.destinasi.value : null,
      paket: isPaket ? form.paket.value : null,
      jumlah: parseInt(form.jumlah.value),
    };

    try {
      // 2. Ganti localStorage dengan fetch ke Netlify Function
      const response = await fetch('/.netlify/functions/createPemesanan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      // 3. Tangani respons dari server
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Terjadi kesalahan pada server.');
      }
      
      const result = await response.json();
      console.log('Pesanan berhasil dibuat:', result);
      
      // Simpan data ke localStorage untuk digunakan di halaman transaksi berikutnya
      localStorage.setItem("pemesanan", JSON.stringify(data));

      // 4. Panggil callback jika pemesanan sukses
      if (onSubmitCallback) onSubmitCallback(data);

    } catch (error) {
      // 5. Tangani jika terjadi error
      console.error('Gagal saat mengirim pesanan:', error);
      messageDiv.textContent = `Error: ${error.message}`;

    } finally {
      // 6. Aktifkan kembali tombol apapun hasilnya
      submitButton.disabled = false;
      submitButton.textContent = 'Lanjut Transaksi';
    }
  });

  return div;
}