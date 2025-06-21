export function Dashboard() {
    const user = netlifyIdentity.currentUser();
    const div = document.createElement('div');
    div.innerHTML = `
      <h2>Dashboard</h2>
      <p>Selamat datang di sistem tiket wisata Guci.</p>
      <p>Anda masuk sebagai: <strong>${user.email}</strong></p>
      <button id="logoutBtn" style="padding: 10px 20px; font-size: 16px; background-color: #d9534f; color: white; border: none; cursor: pointer;">Logout</button>
    `;

     div.querySelector('#logoutBtn').addEventListener('click', () => {
    // Memanggil fungsi logout dari Netlify Identity
    netlifyIdentity.logout();
  });
    return div;
  }
  