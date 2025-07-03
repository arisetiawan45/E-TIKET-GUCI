// components/Dashboard.js

export default function Dashboard() {
  const user = netlifyIdentity.currentUser();
  // Ambil nama lengkap pengguna jika ada, jika tidak gunakan email
  const userName = user?.user_metadata?.full_name || user?.email;

  const div = document.createElement('div');
  div.innerHTML = `
    <style>
      .welcome-card {
        background-color: #ffffff;
        padding: 40px;
        border-radius: 12px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
        text-align: center;
        max-width: 600px;
        margin: 40px auto;
      }
      .welcome-card-icon {
        width: 60px;
        height: 60px;
        margin-bottom: 20px;
      }
      .welcome-card h2 {
        font-size: 2rem;
        color: #333;
        margin-top: 0;
        margin-bottom: 10px;
      }
      .welcome-card p {
        font-size: 1.1rem;
        color: #666;
        margin-bottom: 30px;
      }
      .quick-actions {
        display: flex;
        gap: 15px;
        justify-content: center;
      }
      .quick-actions a {
        display: inline-block;
        padding: 12px 25px;
        background-color: #007bff;
        color: white;
        text-decoration: none;
        border-radius: 5px;
        font-weight: 500;
        transition: background-color 0.2s, transform 0.2s;
      }
      .quick-actions a:hover {
        background-color: #0056b3;
        transform: translateY(-2px);
      }
      .quick-actions a.secondary {
        background-color: #6c757d;
      }
      .quick-actions a.secondary:hover {
        background-color: #5a6268;
      }
    </style>
    <div class="welcome-card">
      <svg class="welcome-card-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#007bff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 9v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9"></path><path d="M9 22V12h6v10"></path><path d="M2 10.6L12 2l10 8.6"></path></svg>
      <h2>Selamat Datang Kembali, ${userName}!</h2>
      <p>Apa yang ingin Anda lakukan hari ini?</p>
      <div class="quick-actions">
        <a href="#/dashboard/pesan">Pesan Tiket Baru</a>
        <a href="#/dashboard/transaksi" class="secondary">Lihat Riwayat Transaksi</a>
      </div>
    </div>
  `;

  return div;
}