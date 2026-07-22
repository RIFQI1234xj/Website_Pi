import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Page } from './types';
import { getToken, removeToken } from './lib/api';
import {
  DEFAULT_PROFILE_TAB,
  getNewsDetailPath,
  getPageFromPathname,
  getPagePath,
  getProfilePath,
} from './lib/routes';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Profile } from './pages/Profile';
import { Programs } from './pages/Programs';
import { ProgramDetail } from './pages/ProgramDetail';
import { Gallery } from './pages/Gallery';
import { GalleryDetail } from './pages/GalleryDetail';
import { News } from './pages/News';
import { NewsDetail } from './pages/NewsDetail';
import { Contact } from './pages/Contact';
import { PPDBGuide } from './pages/PPDBGuide';
import { PPDBForm } from './pages/PPDBForm';

// Admin
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminSidebar } from './pages/admin/AdminSidebar';
import { AdminTopNavbar } from './pages/admin/AdminTopNavbar';
import { AdminDashboard } from './pages/admin/Dashboard';
import { AdminNews } from './pages/admin/AdminNews';
import { AdminGallery } from './pages/admin/AdminGallery';
import { AdminTeachers } from './pages/admin/AdminTeachers';
import { AdminSettings } from './pages/admin/AdminSettings';
import { AdminPrograms } from './pages/admin/AdminPrograms';
import { AdminPrincipal } from './pages/admin/AdminPrincipal';
import { AdminPPDB } from './pages/admin/AdminPPDB';

const ADMIN_PAGES: Page[] = [
  Page.ADMIN_DASHBOARD,
  Page.ADMIN_NEWS,
  Page.ADMIN_GALLERY,
  Page.ADMIN_TEACHERS,
  Page.ADMIN_SETTINGS,
  Page.ADMIN_PROGRAMS,
  Page.ADMIN_PRINCIPAL,
  Page.ADMIN_PPDB,
];

interface PublicLayoutProps {
  currentPage: Page;
  navigateToPage: (page: Page) => void;
  navigateToProfileTab: (tab: string) => void;
}

const PublicLayout: React.FC<PublicLayoutProps> = ({
  currentPage,
  navigateToPage,
  navigateToProfileTab,
}) => (
  <div className="min-h-screen bg-white flex flex-col">
    <Navbar
      currentPage={currentPage}
      setPage={navigateToPage}
      setProfileTab={navigateToProfileTab}
    />
    <main className="flex-grow">
      <Outlet />
    </main>
    <Footer setPage={navigateToPage} />
  </div>
);

interface AdminLayoutProps {
  currentPage: Page;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (value: boolean) => void;
  navigateToPage: (page: Page) => void;
  onLogout: () => void;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentPage,
  sidebarCollapsed,
  setSidebarCollapsed,
  navigateToPage,
  onLogout,
}) => (
  <div className="flex bg-gray-50 min-h-screen relative">
    {/* Mobile Overlay Backdrop */}
    {!sidebarCollapsed && (
      <div 
        className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-10 md:hidden" 
        onClick={() => setSidebarCollapsed(true)}
      />
    )}
    <AdminSidebar
      currentPage={currentPage}
      setPage={navigateToPage}
      collapsed={sidebarCollapsed}
      setCollapsed={setSidebarCollapsed}
      onLogout={onLogout}
    />
    <main
      className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
        sidebarCollapsed ? 'ml-0 md:ml-[72px]' : 'ml-0 md:ml-64'
      }`}
    >
      <AdminTopNavbar
        currentPage={currentPage}
        setPage={navigateToPage}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />
      <div className="flex-1">
        <Outlet />
      </div>
    </main>
  </div>
);

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!getToken());
  const location = useLocation();
  const navigate = useNavigate();
  const currentPage = getPageFromPathname(location.pathname);
  const profileTab = location.hash
    ? decodeURIComponent(location.hash.slice(1))
    : DEFAULT_PROFILE_TAB;

  useEffect(() => {
    if (!location.hash) {
      window.scrollTo({ top: 0, behavior: 'auto' });
      return;
    }

    const sectionId = decodeURIComponent(location.hash.slice(1));
    const timer = window.setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        const yOffset = -90;
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 120);

    return () => window.clearTimeout(timer);
  }, [location.hash, location.pathname]);

  const navigateToPage = (targetPage: Page) => {
    const isAdminTarget = ADMIN_PAGES.includes(targetPage);

    if (isAdminTarget && !isAuthenticated) {
      navigate(getPagePath(Page.ADMIN_LOGIN));
      return;
    }

    navigate(getPagePath(targetPage));
  };

  const navigateToProfileTab = (tab: string) => {
    navigate(getProfilePath(tab));
  };

  const navigateToNewsDetail = (id: number) => {
    navigate(getNewsDetailPath(id));
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    navigate(getPagePath(Page.ADMIN_DASHBOARD), { replace: true });
  };

  const handleLogout = () => {
    removeToken();
    setIsAuthenticated(false);
    navigate(getPagePath(Page.HOME), { replace: true });
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <PublicLayout
            currentPage={currentPage}
            navigateToPage={navigateToPage}
            navigateToProfileTab={navigateToProfileTab}
          />
        }
      >
        <Route
          index
          element={<Home setPage={navigateToPage} navigateToNewsDetail={navigateToNewsDetail} />}
        />
        <Route
          path="profil"
          element={<Profile activeTab={profileTab} setActiveTab={navigateToProfileTab} />}
        />
        <Route path="program" element={<Programs />} />
        <Route path="program/:programId" element={<ProgramDetail />} />
        <Route path="galeri" element={<Gallery />} />
        <Route path="galeri/:galleryId" element={<GalleryDetail />} />
        <Route path="berita" element={<News navigateToNewsDetail={navigateToNewsDetail} />} />
        <Route
          path="berita/:newsId"
          element={
            <NewsDetail
              setPage={navigateToPage}
              navigateToNewsDetail={navigateToNewsDetail}
            />
          }
        />
        <Route path="kontak" element={<Contact />} />
        <Route path="ppdb" element={<PPDBGuide />} />
        <Route path="ppdb/daftar" element={<PPDBForm />} />
      </Route>

      <Route
        path="/admin/login"
        element={
          isAuthenticated ? (
            <Navigate to={getPagePath(Page.ADMIN_DASHBOARD)} replace />
          ) : (
            <AdminLogin onLoginSuccess={handleLoginSuccess} />
          )
        }
      />

      <Route
        path="/admin"
        element={
          isAuthenticated ? (
            <AdminLayout
              currentPage={currentPage}
              sidebarCollapsed={sidebarCollapsed}
              setSidebarCollapsed={setSidebarCollapsed}
              navigateToPage={navigateToPage}
              onLogout={handleLogout}
            />
          ) : (
            <Navigate to={getPagePath(Page.ADMIN_LOGIN)} replace />
          )
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="news" element={<AdminNews />} />
        <Route path="gallery" element={<AdminGallery />} />
        <Route path="teachers" element={<AdminTeachers />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="programs" element={<AdminPrograms />} />
        <Route path="principal" element={<AdminPrincipal />} />
        <Route path="ppdb" element={<AdminPPDB />} />
      </Route>

      <Route path="*" element={<Navigate to={getPagePath(Page.HOME)} replace />} />
    </Routes>
  );
}

export default App;
