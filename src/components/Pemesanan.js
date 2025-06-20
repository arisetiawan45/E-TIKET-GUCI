export function Pemesanan(navigateBack, navigateToTransaksi) {
  const formContainer = document.createElement('div');
  formContainer.innerHTML = `
    <section style="padding: 20px; max-width: 500px; margin: auto;">
      <h2>Form Pemesanan Tiket</h2>
      <form id="formPemesanan" style="display: flex; flex-direction: column; gap: 15px;">
        <div>
          <label for="nama">Nama Lengkap:</label><br>
          <input type="text" id="nama" name="nama" required style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #ccc;">
        </div>
  
        <div>
          <label for="paket">Paket Wisata:</label><br>
          <select id="paket" name="paket" required style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #ccc;">
            <option value="">--Pilih Paket--</option>
            <option value="paket1">Paket 1 - Kolam Renang</option>
            <option value="paket2">Paket 2 - Pemandian Air Panas</option>
            <option value="paket3">Paket 3 - Terusan Komplit</option>
          </select>
        </div>
  
        <div>
          <label for="jumlah">Jumlah Tiket:</label><br>
          <input type="number" id="jumlah" name="jumlah" min="1" required style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #ccc;">
        </div>
  
        <div>
          <label for="tanggal">Tanggal Kunjungan:</label><br>
          <input type="date" id="tanggal" name="tanggal" required style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #ccc;">
        </div>
  
        <button type="submit" id="btnSubmit" style="padding: 12px 20px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">
          Pesan Tiket
        </button>
      </form>
  
      <!-- Elemen untuk menampilkan pesan error atau sukses -->
      <div id="formMessage" style="margin-top: 15px; font-weight: bold;"></div>

      <button id="btnKembali" style="margin-top: 20px; background: #6c757d; color: white;">Kembali ke Dashboard</button>
    </section>
  `;

  // --- LOGIKA FORM ---

  const formElement = formContainer.querySelector('#formPemesanan');
  const submitButton = formContainer.querySelector('#btnSubmit');
  const messageDiv = formContainer.querySelector('#formMessage');

  // Mengubah event listener menjadi 'async' untuk bisa menggunakan 'await'
  formElement.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Memberi umpan balik ke pengguna dan mencegah klik ganda
    submitButton.disabled = true;
    submitButton.textContent = 'Memproses...';
    messageDiv.textContent = ''; // Bersihkan pesan sebelumnya

    // 1. Kumpulkan data dari form ke dalam sebuah objek (payload)
    const payload = {
      nama: formContainer.querySelector('#nama').value,
      paket: formContainer.querySelector('#paket').value,
      jumlah: formContainer.querySelector('#jumlah').value,
      tanggal: formContainer.querySelector('#tanggal').value
    };

    try {
      // 2. Kirim data ke Netlify Function menggunakan fetch
      const response = await fetch('/.netlify/functions/createPemesanan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      // 3. Tangani respons dari server
      if (!response.ok) {
        // Jika respons tidak sukses (status 4xx atau 5xx), baca pesan error
        const errorData = await response.json();
        throw new Error(errorData.error || 'Terjadi kesalahan pada server.');
      }

      // Jika sukses
      alert(`Tiket berhasil dipesan!`);
      navigateToTransaksi(); // Arahkan ke halaman transaksi

    } catch (error) {
      // 4. Tangani jika terjadi error koneksi atau dari blok 'throw' di atas
      console.error('Gagal saat mengirim pesanan:', error);
      messageDiv.textContent = `Error: ${error.message}`;
      messageDiv.style.color = 'red';
    
    } finally {
      // 5. Apapun hasilnya (sukses atau gagal), aktifkan kembali tombol submit
      submitButton.disabled = false;
      submitButton.textContent = 'Pesan Tiket';
    }
  });

  // Event listener untuk tombol kembali
  formContainer.querySelector('#btnKembali').addEventListener('click', () => {
    navigateBack();
  });

  return formContainer;
}
