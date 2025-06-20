import './styles/main.css';
import { Dashboard } from './components/Dashboard';
import { WelcomePage } from './pages/WelcomePage';
import { Pemesanan } from './components/Pemesanan';
import { Transaksi } from './components/Transaksi';
import { AdminPage } from './pages/AdminPage';
import { PengunjungPage } from './pages/PengunjungPage';
import { PimpinanPage } from './pages/PimpinanPage';

document.addEventListener('DOMContentLoaded', () => {
    const showAdminPage = () => {
        app.innerHTML = '';
        app.appendChild(AdminPage(showDashboard));
      };

    const showPengunjungPage = () => {
        app.innerHTML = '';
        app.appendChild(PengunjungPage(showDashboard));
      };
      
    const showPimpinanPage = () => {
        app.innerHTML = '';
        app.appendChild(PimpinanPage(showDashboard));
      };
      
    const showTransaksi = () => {
        app.innerHTML = '';
        app.appendChild(Transaksi());
      };
        
    const showDashboard = () => {
        app.innerHTML = '';
        app.appendChild(Dashboard());
      
        const tombolPemesanan = document.createElement('button');
        tombolPemesanan.textContent = 'Pesan Tiket';
        tombolPemesanan.onclick = () => {
          app.innerHTML = '';
          app.appendChild(Pemesanan(showDashboard, showTransaksi));
        };
        
      
        const tombolTransaksi = document.createElement('button');
        tombolTransaksi.textContent = 'Lihat Transaksi';
        tombolTransaksi.style.marginLeft = '10px';
        tombolTransaksi.onclick = () => {
          app.innerHTML = '';
          app.appendChild(Transaksi());
        };

        const tombolAdmin = document.createElement('button');
        tombolAdmin.textContent = 'Halaman Admin';
        tombolAdmin.style.marginLeft = '10px';
        tombolAdmin.onclick = () => {
          showAdminPage();
        };
        
        const tombolPengunjung = document.createElement('button');
        tombolPengunjung.textContent = 'Halaman Pengunjung';
        tombolPengunjung.style.marginLeft = '10px';
        tombolPengunjung.onclick = showPengunjungPage;

        const tombolPimpinan = document.createElement('button');
        tombolPimpinan.textContent = 'Halaman Pimpinan';
        tombolPimpinan.style.marginLeft = '10px';
        tombolPimpinan.onclick = showPimpinanPage;

        app.appendChild(tombolPengunjung);
        app.appendChild(tombolPimpinan);
        app.appendChild(tombolPemesanan);
        app.appendChild(tombolTransaksi);
        app.appendChild(tombolAdmin);
      };
       
  
    app.appendChild(WelcomePage(showDashboard));
  });
  