import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import ReportForm from './components/ReportForm';
import TrackReport from './components/TrackReport';
import ReviewerDashboard from './components/ReviewerDashboard';
import AdminDashboard from './components/AdminDashboard';
import EducationPage from './components/EducationPage';
import ProfilePage from './components/ProfilePage';
import SettingsPage from './components/SettingsPage';
import SuccessPage from './components/SuccessPage';
import LoginPage from './components/LoginPage';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/lapor" element={<ReportForm />} />
        <Route path="/lacak" element={<TrackReport />} />
        <Route path="/reviewer" element={<ReviewerDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/edukasi" element={<EducationPage />} />
        <Route path="/profil" element={<ProfilePage />} />
        <Route path="/pengaturan" element={<SettingsPage />} />
        <Route path="/sukses" element={<SuccessPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}
