// pages/TentangKami.js

export default function TentangKamiPage() {
  const div = document.createElement('div');
  
  div.innerHTML = `
    <style>
      .about-us-layout {
        display: grid;
        grid-template-areas:
          "header header"
          "sidebar main";
        grid-template-columns: 200px 1fr; /* Lebar sidebar */
        grid-template-rows: auto 1fr;
        min-height: 100vh;
        font-family: sans-serif;
      }
      .about-header {
        grid-area: header;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 2rem;
        background-color: #007bff; /* Warna biru sesuai tema */
        color: white;
      }
      .header-logo {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .header-logo svg {
        width: 40px;
        height: 40px;
      }
      .header-logo span {
        font-size: 1.5rem;
        font-weight: bold;
      }
      .header-title {
        font-size: 2rem;
        font-family: 'Georgia', serif;
      }
      .header-account-btn {
        padding: 8px 16px;
        background-color: rgba(255, 255, 255, 0.2);
        color: white;
        border: 1px solid white;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.2s;
      }
      .header-account-btn:hover {
        background-color: rgba(255, 255, 255, 0.3);
      }
      .about-sidebar {
        grid-area: sidebar;
        background-color: #f8f9fa;
        border-right: 1px solid #e0e0e0;
        padding: 2rem;
        display: flex;
        flex-direction: column;
        gap: 15px;
      }
      .sidebar-btn {
        display: block;
        width: 100%;
        padding: 12px;
        text-align: center;
        text-decoration: none;
        background-color: #343a40;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
      }
      .sidebar-btn:hover {
        background-color: #495057;
      }
      .about-main {
        grid-area: main;
        padding: 2rem 3rem;
        background-color: #ffffff;
      }
      .about-main img {
        width: 100%;
        max-width: 700px;
        display: block;
        margin: 0 auto 2rem auto;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      }
      .about-main p {
        font-size: 1.1rem;
        line-height: 1.7;
        color: #333;
        text-align: justify;
      }

      /* Penyesuaian Responsif */
      @media (max-width: 768px) {
        .about-us-layout {
          grid-template-areas:
            "header"
            "main";
          grid-template-columns: 1fr;
        }
        .about-sidebar {
          display: none; /* Sembunyikan sidebar di HP, navigasi utama ada di header */
        }
        .about-header {
          padding: 1rem;
        }
        .header-title {
          font-size: 1.5rem;
        }
        .about-main {
          padding: 1.5rem;
        }
      }
    </style>

    <div class="about-us-layout">
      <header class="about-header">
        <div class="header-logo">
          <svg viewBox="0 0 100 100"><path fill="#fff" d="M85.3,42.2c-2.5-3.3-5.8-5.8-9.7-7.2c-1.8-0.6-3.6-1-5.5-1.1c-1.5-0.1-3-0.1-4.5-0.1h-2c-1.5,0-3,0-4.5,0.1 c-1.9,0.1-3.7,0.5-5.5,1.1c-3.9,1.4-7.2,3.9-9.7,7.2C42,45.9,41,50.3,41.4,54.8c0.4,4.2,2.2,8.1,5.1,11.1 c2.2,2.3,5,3.9,8.1,4.7c1.1,0.3,2.2,0.5,3.3,0.6c0.6,0,1.2,0.1,1.8,0.1h0.6c0.6,0,1.2,0,1.8-0.1c1.1-0.1,2.2-0.3,3.3-0.6 c3.1-0.8,5.9-2.4,8.1-4.7c2.9-3,4.7-6.9,5.1-11.1C90.1,50.3,88.9,45.9,85.3,42.2z M83.5,54c-0.3,3.4-1.8,6.5-4.2,8.8 c-1.9,1.9-4.3,3.2-7,3.9c-0.9,0.2-1.9,0.4-2.8,0.5c-0.5,0-1,0.1-1.5,0.1h-0.5c-0.5,0-1,0-1.5-0.1c-0.9-0.1-1.9-0.2-2.8-0.5 c-2.7-0.7-5.1-2-7-3.9c-2.4-2.3-3.9-5.4-4.2-8.8c-0.4-3.8,0.7-7.6,3.2-10.4c2.1-2.4,4.9-4.2,8.1-5.3c1.6-0.5,3.2-0.8,4.8-0.9 c1.3-0.1,2.6-0.1,3.9-0.1h1.7c1.3,0,2.6,0,3.9,0.1c1.6,0.1,3.2,0.4,4.8,0.9c3.2,1.1,6,2.9,8.1,5.3 C82.8,46.4,83.9,50.2,83.5,54z"></path><path fill="#fff" d="M36.4,34.3c0-2.4,1.9-4.3,4.3-4.3h20.5c2.4,0,4.3,1.9,4.3,4.3v2.1c0,2.4-1.9,4.3-4.3,4.3H40.7 c-2.4,0-4.3-1.9-4.3-4.3V34.3z"></path><path fill="#fff" d="M28.6,71.4c-1.1,0-2-0.9-2-2v-9.7c0-1.1,0.9-2,2-2s2,0.9,2,2v9.7C30.6,70.5,29.7,71.4,28.6,71.4z"></path><path fill="#fff" d="M72.5,71.4c-1.1,0-2-0.9-2-2v-9.7c0-1.1,0.9-2,2-2s2,0.9,2,2v9.7C74.5,70.5,73.6,71.4,72.5,71.4z"></path></svg>
          <span>Guci</span>
        </div>
        <h1 class="header-title">Tentang Kami</h1>
        <button id="accountBtn" class="header-account-btn">Akun</button>
      </header>
      <aside class="about-sidebar">
        <a href="#/" class="sidebar-btn">Home</a>
        <a href="javascript:history.back()" class="sidebar-btn">Kembali</a>
      </aside>
      <main class="about-main">
        <img src="assets/Gerbang-Guci.jpg" alt="Gerbang Masuk Wisata Guci">
        <p>
          Wisata Guci merupakan taman wisata air panas yang ada di daerah Tegal. Kawasan ini berada di hamparan bukit berada mengelilingi taman wisata Guci dan mengelilingi Gunung Slamet yang menjulang tinggi di hadapan mata sehingga membuat suasana semakin nyaman. Untuk itu, menarik untuk membahas lebih dalam mengenai profil wisata Guci.
        </p>
        <p>
          Taman wisata air panas yang asri dan sejuk serta air terjun di sana mengubah pemandangan jadi semakin indah. Selain itu, profil wisata Guci memiliki tanah lapang yang bisa digunakan untuk berkemah. Pemandian air panas dan air terjun Guci memiliki tawaran lain seperti menunggang kuda mengelilingi taman wisata Guci dan pernak-pernik khas yang dibuat oleh tangan kreatif warga di sekitar taman wisata.
        </p>
      </main>
    </div>
  `;

  // Menambahkan event listener untuk tombol Akun
  div.querySelector('#accountBtn').addEventListener('click', () => {
    netlifyIdentity.open(); // Membuka widget login/signup
  });

  return div;
}