export default function Pemesanan(onSubmitCallback, navigateToDashboard) {
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
        <select name="destinasi" id="destinasiSelect"></select><br><br>
      </div>

      <div id="paketWrapper" style="display: none;">
        <label>Pilih Paket Wisata:</label><br>
        <select name="paket" id="paketSelect"></select><br><br>
      </div>

      <label>Jumlah Tiket:</label><br>
      <input type="number" name="jumlah" id="jumlahTiket" min="1" value="1" required><br><br>

      <p><strong>Total Harga: </strong><span id="totalHarga">Rp 0</span></p>

      <button type="submit" id="btnSubmit">Lanjut Transaksi</button>
    </form>

    <div id="formMessage" style="margin-top: 15px; font-weight: bold; color: red;"></div>
    <br>
    <button id="btnKembaliDashboard">Kembali ke Dashboard</button>
  `;

  // Elemen
  const form = div.querySelector("#formPemesanan");
  const jenisTiket = div.querySelector("#jenisTiket");
  const destinasiSelect = div.querySelector("#destinasiSelect");
  const paketSelect = div.querySelector("#paketSelect");
  const jumlahInput = div.querySelector("#jumlahTiket");
  const totalHargaSpan = div.querySelector("#totalHarga");
  const submitButton = div.querySelector("#btnSubmit");
  const messageDiv = div.querySelector("#formMessage");

  // Ambil data dari localStorage
  const hargaList = JSON.parse(localStorage.getItem("hargaList")) || {};
  const destinasiList = JSON.parse(localStorage.getItem("destinasiList")) || [];
  const paketList = JSON.parse(localStorage.getItem("paketList")) || [];

  destinasiList.forEach(dest => {
    const option = document.createElement("option");
    option.value = dest;
    option.textContent = dest;
    destinasiSelect.appendChild(option);
  });

  paketList.forEach(paket => {
    const option = document.createElement("option");
    option.value = paket;
    option.textContent = paket;
    paketSelect.appendChild(option);
  });

  // Hitung harga otomatis
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

  updateHarga();

  // Tombol kembali
  div.querySelector("#btnKembaliDashboard").addEventListener("click", () => {
    if (navigateToDashboard) navigateToDashboard();
  });

  // Submit
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    submitButton.disabled = true;
    messageDiv.textContent = "";

    const isPaket = jenisTiket.value === "paket";
    const jumlah = parseInt(jumlahInput.value);
    const namaDipilih = isPaket ? paketSelect.value : destinasiSelect.value;
    const hargaSatuan = hargaList[namaDipilih] || 0;

    const data = {
      tanggal: form.tanggal.value,
      jenis: jenisTiket.value,
      destinasi: isPaket ? null : destinasiSelect.value,
      paket: isPaket ? paketSelect.value : null,
      jumlah,
      hargaSatuan,
      total: jumlah * hargaSatuan,
    };

    // Simpan ke localStorage
    const transaksiList = JSON.parse(localStorage.getItem("transaksi")) || [];
    transaksiList.push({
      id: transaksiList.length + 1,
      ...data,
      tanggal_transaksi: new Date().toLocaleDateString("id-ID"),
    });
    localStorage.setItem("transaksi", JSON.stringify(transaksiList));
    localStorage.setItem("pemesanan", JSON.stringify(data));

    if (onSubmitCallback) onSubmitCallback(data);
    submitButton.disabled = false;
  });

  return div;
}
