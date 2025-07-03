// pages/Kontak.js

export default function KontakPage() {
  const div = document.createElement('div');
  
  div.innerHTML = `
    <style>
      .contact-container { max-width: 900px; margin: 40px auto; padding: 40px; font-family: sans-serif; background-color: #fff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
      .contact-header { text-align: center; margin-bottom: 40px; }
      .contact-header h2 { font-size: 2.5rem; color: #333; }
      .contact-header p { font-size: 1.1rem; color: #666; max-width: 600px; margin: 10px auto 0; }
      .contact-content { display: grid; grid-template-columns: 1fr 1.5fr; gap: 40px; align-items: flex-start; }
      .contact-info h3 { font-size: 1.5rem; border-bottom: 2px solid #007bff; padding-bottom: 10px; margin-bottom: 20px; }
      .contact-info p { display: flex; align-items: center; gap: 10px; margin-bottom: 15px; font-size: 1rem; }
      .contact-form h3 { font-size: 1.5rem; margin-bottom: 20px; }
      .contact-form .form-group { margin-bottom: 20px; }
      .contact-form label { display: block; margin-bottom: 5px; font-weight: 500; }
      .contact-form input, .contact-form textarea { width: 100%; padding: 12px; border: 1px solid #ccc; border-radius: 5px; box-sizing: border-box; }
      .contact-form button { width: 100%; padding: 15px; border: none; border-radius: 5px; background-color: #007bff; color: white; font-size: 1.1rem; cursor: pointer; transition: background-color 0.2s; }
      .contact-form button:disabled { background-color: #5a9ed8; cursor: not-allowed; }
      .form-message { margin-top: 15px; padding: 10px; border-radius: 5px; display: none; }
      .form-message.success { background-color: #d4edda; color: #155724; display: block; }
      .form-message.error { background-color: #f8d7da; color: #721c24; display: block; }
      .back-link-container { text-align: center; margin-top: 40px; }
      .back-link-container a { padding: 10px 20px; background-color: #6c757d; color: white; text-decoration: none; border-radius: 5px; }
      @media (max-width: 768px) {
        .contact-container { margin: 20px; padding: 20px; }
        .contact-content { grid-template-columns: 1fr; }
        .contact-header h2 { font-size: 2rem; }
      }
    </style>

    <div class="contact-container">
      <div class="contact-header">
        <h2>Hubungi Kami</h2>
        <p>Kami siap membantu. Kirimkan pesan melalui formulir di bawah ini dan kami akan segera merespons.</p>
      </div>
      <div class="contact-content">
        <div class="contact-info">
          <h3>Informasi Kontak</h3>
          <p><svg width="24" height="24" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg><span>Jl. Raya Guci No. 123, Tegal</span></p>
          <p><svg width="24" height="24" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg><span>(0283) 123-4567</span></p>
          <p><svg width="24" height="24" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg><span>info@tiketguci.com</span></p>
        </div>
        <div class="contact-form">
          <h3>Kirim Pesan</h3>
          <!-- PERBAIKAN: Form disederhanakan, tidak lagi menggunakan atribut Netlify -->
          <form id="formKontak">
            <div class="form-group">
              <label for="nama">Nama Anda</label>
              <input type="text" id="nama" name="nama" required>
            </div>
            <div class="form-group">
              <label for="email">Email Anda</label>
              <input type="email" id="email" name="email" required>
            </div>
            <div class="form-group">
              <label for="pesan">Pesan Anda</label>
              <textarea id="pesan" name="pesan" rows="5" required></textarea>
            </div>
            <button type="submit" id="submitBtn">Kirim</button>
            <div id="formMessage" class="form-message"></div>
          </form>
        </div>
      </div>
      <div class="back-link-container">
        <a href="#/">Kembali ke Halaman Utama</a>
      </div>
    </div>
  `;

  const form = div.querySelector('#formKontak');
  const submitBtn = div.querySelector('#submitBtn');
  const formMessage = div.querySelector('#formMessage');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    submitBtn.disabled = true;
    submitBtn.textContent = 'Mengirim...';
    formMessage.style.display = 'none';

    // Siapkan data untuk dikirim sebagai JSON
    const formData = {
        nama: form.nama.value,
        email: form.email.value,
        pesan: form.pesan.value,
    };
    
    try {
      // Kirim data ke fungsi backend yang baru
      const response = await fetch("/.netlify/functions/send-contact-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Gagal mengirim pesan. Silakan coba lagi nanti.');
      }

      formMessage.textContent = 'Terima kasih! Pesan Anda telah berhasil terkirim.';
      formMessage.className = 'form-message success';
      form.reset();

    } catch (error) {
      formMessage.textContent = `Terjadi kesalahan: ${error.message}`;
      formMessage.className = 'form-message error';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Kirim';
    }
  });

  return div;
}