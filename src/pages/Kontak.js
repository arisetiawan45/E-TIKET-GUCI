export default function Kontak(navigateBack) {
    const div = document.createElement('div');
    div.innerHTML = `
      <section style="padding: 20px;">
        <h2>Hubungi Kami</h2>
        <p>Silakan hubungi kami melalui informasi berikut:</p>
        <ul>
          <li>Email: <a href="mailto:info@gucitiket.com">info@gucitiket.com</a></li>
          <li>Telepon: (0283) 123-456</li>
          <li>WhatsApp: 0812-3456-7890</li>
          <li>Alamat: Jl. Wisata Guci No. 1, Tegal, Jawa Tengah</li>
        </ul>
        <button id="btnKembali">Kembali ke Dashboard</button>
      </section>
    `;
    div.querySelector('#btnKembali').addEventListener('click', navigateBack);
    return div;
  }
  