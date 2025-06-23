export default function Pembayaran(onSubmitCallback) {
    const div = document.createElement("div");
    div.className = "pembayaran-container";
  
    div.innerHTML = `
      <h2>Form Pembayaran</h2>
      <form id="formPembayaran">
        <label>Metode Pembayaran:</label><br>
        <select name="metode" required>
          <option value="QRIS">QRIS</option>
          <option value="Transfer">Transfer Bank</option>
          <option value="COD">Cash on Delivery</option>
        </select><br><br>
  
        <label>Status:</label><br>
        <select name="status" required>
          <option value="Lunas">Lunas</option>
          <option value="Pending">Pending</option>
        </select><br><br>
  
        <label>Tanggal Pembayaran:</label><br>
        <input type="date" name="tanggal" required><br><br>
  
        <button type="submit">Simpan</button>
      </form>
    `;
  
    const form = div.querySelector("#formPembayaran");
  
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = {
        metode: form.metode.value,
        status: form.status.value,
        tanggal: form.tanggal.value,
      };
  
      // Simpan ke localStorage (bisa diganti nanti ke fetch API)
      let pembayaran = JSON.parse(localStorage.getItem("pembayaran")) || [];
      data.id = pembayaran.length + 1; // sementara pakai auto increment lokal
      pembayaran.push(data);
      localStorage.setItem("pembayaran", JSON.stringify(pembayaran));
  
      alert("Pembayaran berhasil disimpan.");
  
      if (onSubmitCallback) onSubmitCallback(data);
    });
  
    return div;
  }
  