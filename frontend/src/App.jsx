// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CustomerLookup from './pages/CustomerLookup';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import TechnicianDashboard from './pages/TechnicianDashboard';
import TechnicianView from './pages/TechnicianView';
import TechnicianLogin from './pages/TechnicianLogin';
import ServicesPage from './pages/ServicesPage';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';
import RequireAuth from './components/RequireAuth';
import NavBar from './components/NavBar';

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/customerLookup" element={<CustomerLookup />} />

        {/* Admin Routes */}
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/dashboard" element={
          <RequireAuth>
            <AdminDashboard />
          </RequireAuth>
        } />
        <Route path="/technicians" element={
          <RequireAuth>
            <TechnicianDashboard />
          </RequireAuth>
        } />

        {/* Technician Routes */}
        <Route path="/technician-login" element={<TechnicianLogin />} />
        <Route path="/technician/:techId" element={
          <RequireAuth>
            <TechnicianView />
          </RequireAuth>
        } />
      </Routes>
    </Router>
  );
}

export default App;
