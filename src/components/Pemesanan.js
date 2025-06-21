export default function Pemesanan(onSubmitCallback) {
  const div = document.createElement("div");
  div.className = "pemesanan-container";

  const today = new Date().toISOString().split("T")[0];

  div.innerHTML = `
    <h2>Form Pemesanan Tiket</h2>
    <form id="formPemesanan">
      <label>Tanggal:</label><br>
      <input type="date" id="tanggal" name="tanggal" min="${today}" required><br><br>

      <label>Jenis Tiket:</label><br>
      <select name="jenis" id="jenisTiket" required>
        <option value="biasa">Biasa</option>
        <option value="paket">Paket</option>
      </select><br><br>

      <div id="destinasiWrapper">
        <label>Destinasi Wisata:</label><br>
        <select name="destinasi" id="destinasiSelect" required>
          <option value="Curug Guci">Curug Guci</option>
          <option value="Pemandian Air Panas">Pemandian Air Panas</option>
          <option value="Gunung Slamet">Gunung Slamet</option>
        </select><br><br>
      </div>

      <div id="paketWrapper">
        <label>Pilih Paket Wisata:</label><br>
        <select name="paket" id="paketSelect">
          <option value="paket1">Paket 1 - Curug + Air Panas</option>
          <option value="paket2">Paket 2 - Gunung + Air Panas</option>
        </select><br><br>
      </div>

      <label>Jumlah Tiket:</label><br>
      <input type="number" name="jumlah" min="1" required><br><br>

      <button type="submit">Lanjut Transaksi</button>
    </form>
    <br>
    <button id="btnKembaliDashboard">Kembali ke Dashboard</button>
  `;

  const form = div.querySelector("#formPemesanan");
  const jenisTiket = div.querySelector("#jenisTiket");
  const paketWrapper = div.querySelector("#paketWrapper");

  // Tampilkan/sembunyikan opsi paket
  jenisTiket.addEventListener("change", () => {
    paketWrapper.style.display = jenisTiket.value === "paket" ? "block" : "none";
  });

  // Inisialisasi
  paketWrapper.style.display = "none";

  // Tombol kembali ke dashboard
  div.querySelector("#btnKembaliDashboard").addEventListener("click", () => {
    location.hash = "#dashboard";
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = {
      tanggal: form.tanggal.value,
      jenis: form.jenis.value,
      destinasi: form.destinasi.value,
      jumlah: parseInt(form.jumlah.value),
      paket: form.jenis.value === "paket" ? form.paket.value : null,
    };

    localStorage.setItem("pemesanan", JSON.stringify(data));

    if (onSubmitCallback) onSubmitCallback(data);
  });

  return div;
}
