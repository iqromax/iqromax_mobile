import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Students from './pages/Students';
import Teachers from './pages/Teachers';
import Parents from './pages/Parents';
import EnergyCenter from './pages/EnergyCenter';
import Notifications from './pages/Notifications';
import MysteryBoxAdmin from './pages/MysteryBoxAdmin';
import ShopAdmin from './pages/ShopAdmin';
import InventoryAdmin from './pages/InventoryAdmin';
import AppDownloadingAdmin from './pages/AppDownloadingAdmin';

import AppDownloadLanding from './pages/AppDownloadLanding';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/downloading" element={<AppDownloadLanding />} />
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/app-downloading" element={<AppDownloadingAdmin />} />
        <Route path="/mystery-box" element={<MysteryBoxAdmin />} />
        <Route path="/shop" element={<ShopAdmin />} />
        <Route path="/inventory-admin" element={<InventoryAdmin />} />
        <Route path="/users" element={<Users />} />
        <Route path="/students" element={<Students />} />
        <Route path="/teachers" element={<Teachers />} />
        <Route path="/parents" element={<Parents />} />
        <Route path="/energy-center" element={<EnergyCenter />} />
        <Route path="/notifications" element={<Notifications />} />
      </Routes>
    </Router>
  );
}

export default App;
