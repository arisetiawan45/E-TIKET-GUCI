// src/pages/AdminPage.js

export function AdminPage(navigateToDashboard) {
  const div = document.createElement("div");
  div.className = "admin-container";

  const transaksiData = JSON.parse(localStorage.getItem("transaksi")) || [];
  const totalTransaksi = transaksiData.length;
  const totalTiket = transaksiData.reduce(
    (total, trx) => total + parseInt(trx.jumlah),
    0
  );

  let destinasiList = JSON.parse(localStorage.getItem("destinasiList")) || [
    "Curug Guci",
    "Pemandian Air Panas",
    "Gunung Slamet"
  ];

  let paketList = JSON.parse(localStorage.getItem("paketList")) || [
    "Paket 1 - Curug + Air Panas",
    "Paket 2 - Gunung + Air Panas"
  ];

  let hargaList = JSON.parse(localStorage.getItem("hargaList")) || {};

  div.innerHTML = `
    <section style="padding: 20px;">
      <h2>Halaman Admin</h2>
      <p>Selamat datang, Admin!</p>

      <div style="margin-top: 20px;">
        <p><strong>Total Transaksi:</strong> ${totalTransaksi}</p>
        <p><strong>Total Tiket Terjual:</strong> ${totalTiket}</p>
      </div>

      <hr>
      <h3>Kelola Destinasi Wisata</h3>
      <form id="formDestinasi">
        <input type="text" id="inputDestinasi" placeholder="Nama Destinasi" required>
        <button type="submit">Tambah</button>
      </form>
      <ul id="daftarDestinasi"></ul>

      <hr>
      <h3>Kelola Paket Wisata</h3>
      <form id="formPaket">
        <input type="text" id="inputPaket" placeholder="Nama Paket" required>
        <button type="submit">Tambah</button>
      </form>
      <ul id="daftarPaket"></ul>

      <hr>
      <h3>Kelola Harga Tiket</h3>
      <form id="formHarga">
        <input type="text" id="inputHargaNama" placeholder="Nama Destinasi/Paket" required>
        <input type="number" id="inputHargaNilai" placeholder="Harga (Rp)" required>
        <button type="submit">Simpan</button>
      </form>
      <ul id="daftarHarga"></ul>

      <br>
      <button id="btnDashboard">Kembali ke Dashboard</button>
    </section>
  `;

  function renderList(list, containerId, key) {
    const ul = div.querySelector(containerId);
    ul.innerHTML = "";
    list.forEach((item, index) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <span>${item}</span>
        <button data-index="${index}" data-type="edit">Edit</button>
        <button data-index="${index}" data-type="delete">Hapus</button>
      `;
      ul.appendChild(li);
    });
  }

  function saveAndRender(list, key, containerId) {
    localStorage.setItem(key, JSON.stringify(list));
    renderList(list, containerId, key);
  }

  function renderHarga() {
    const ul = div.querySelector("#daftarHarga");
    ul.innerHTML = "";
    Object.entries(hargaList).forEach(([nama, harga], index) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <span>${nama} - Rp${parseInt(harga).toLocaleString('id-ID')}</span>
        <button data-nama="${nama}" data-type="hapusHarga">Hapus</button>
      `;
      ul.appendChild(li);
    });
  }

  div.querySelector("#formDestinasi").addEventListener("submit", e => {
    e.preventDefault();
    const input = div.querySelector("#inputDestinasi").value.trim();
    if (input && !destinasiList.includes(input)) {
      destinasiList.push(input);
      saveAndRender(destinasiList, "destinasiList", "#daftarDestinasi");
      e.target.reset();
    }
  });

  div.querySelector("#formPaket").addEventListener("submit", e => {
    e.preventDefault();
    const input = div.querySelector("#inputPaket").value.trim();
    if (input && !paketList.includes(input)) {
      paketList.push(input);
      saveAndRender(paketList, "paketList", "#daftarPaket");
      e.target.reset();
    }
  });

  div.querySelector("#formHarga").addEventListener("submit", e => {
    e.preventDefault();
    const nama = div.querySelector("#inputHargaNama").value.trim();
    const nilai = parseInt(div.querySelector("#inputHargaNilai").value);
    if (nama && nilai > 0) {
      hargaList[nama] = nilai;
      localStorage.setItem("hargaList", JSON.stringify(hargaList));
      renderHarga();
      e.target.reset();
    }
  });

  div.addEventListener("click", e => {
    const type = e.target.dataset.type;
    const index = parseInt(e.target.dataset.index);
    const nama = e.target.dataset.nama;
    const parentUl = e.target.closest("ul");

    if (type === "hapusHarga" && nama) {
      delete hargaList[nama];
      localStorage.setItem("hargaList", JSON.stringify(hargaList));
      renderHarga();
    } else if (type && !isNaN(index)) {
      let list, key, containerId;
      if (parentUl.id === "daftarDestinasi") {
        list = destinasiList;
        key = "destinasiList";
        containerId = "#daftarDestinasi";
      } else {
        list = paketList;
        key = "paketList";
        containerId = "#daftarPaket";
      }

      if (type === "delete") {
        list.splice(index, 1);
      } else if (type === "edit") {
        const newValue = prompt("Edit item:", list[index]);
        if (newValue) list[index] = newValue.trim();
      }
      saveAndRender(list, key, containerId);
    }
  });

  renderList(destinasiList, "#daftarDestinasi", "destinasiList");
  renderList(paketList, "#daftarPaket", "paketList");
  renderHarga();

  div.querySelector("#btnDashboard").addEventListener("click", () => {
    navigateToDashboard();
  });

  return div;
}