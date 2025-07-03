// File: netlify/functions/send-contact-email.js
import { Resend } from 'resend';

// Inisialisasi Resend dengan API key dari environment variable
const resend = new Resend(process.env.RESEND_API_KEY);
const toEmail = 'statusrasa1@gmail.com'; // Email tujuan Anda
const fromEmail = 'onboarding@resend.dev'; // Email ini disediakan oleh Resend untuk memulai

exports.handler = async (event) => {
  // Hanya izinkan metode POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const data = JSON.parse(event.body);
    const { nama, email, pesan } = data;

    // Validasi data
    if (!nama || !email || !pesan) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Semua field wajib diisi.' }) };
    }

    // Kirim email menggunakan Resend
    await resend.emails.send({
      from: `Kontak Form <${fromEmail}>`,
      to: [toEmail],
      subject: `Pesan Baru dari ${nama} - Situs E-Tiket Guci`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6;">
          <h2>Pesan Baru dari Formulir Kontak</h2>
          <p><strong>Nama:</strong> ${nama}</p>
          <p><strong>Email Pengirim:</strong> ${email}</p>
          <hr>
          <h3>Pesan:</h3>
          <p>${pesan}</p>
        </div>
      `,
      reply_to: email, // Memudahkan untuk membalas langsung ke email pengirim
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Pesan berhasil terkirim!' }),
    };

  } catch (error) {
    console.error("Error saat mengirim email:", error);
    return { 
        statusCode: 500, 
        body: JSON.stringify({ error: 'Gagal mengirim pesan.' }) 
    };
  }
};