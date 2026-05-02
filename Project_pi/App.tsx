import React, { useState } from 'react';
import { Page } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Profile } from './pages/Profile';
import { Programs } from './pages/Programs';
import { Gallery } from './pages/Gallery';
import { News } from './pages/News';
import { NewsDetail } from './pages/NewsDetail';
import { Contact } from './pages/Contact';

// Admin
import { AdminSidebar } from './pages/admin/AdminSidebar';
import { AdminTopNavbar } from './pages/admin/AdminTopNavbar';
import { AdminDashboard } from './pages/admin/Dashboard';
import { AdminNews } from './pages/admin/AdminNews';
import { AdminGallery } from './pages/admin/AdminGallery';
import { AdminTeachers } from './pages/admin/AdminTeachers';
import { AdminSettings } from './pages/admin/AdminSettings';

const ADMIN_PAGES: Page[] = [
  Page.ADMIN_DASHBOARD,
  Page.ADMIN_NEWS,
  Page.ADMIN_GALLERY,
  Page.ADMIN_TEACHERS,
  Page.ADMIN_SETTINGS,
];

function App() {
  const [page, setPage] = useState<Page>(Page.HOME);
  const [profileTab, setProfileTab] = useState('identitas');
  const [selectedNewsId, setSelectedNewsId] = useState<number | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const navigateToNewsDetail = (id: number) => {
    setSelectedNewsId(id);
    setPage(Page.NEWS_DETAIL);
  };

  const isAdmin = ADMIN_PAGES.includes(page);

  const renderContent = () => {
    switch (page) {
      case Page.HOME:         return <Home setPage={setPage} navigateToNewsDetail={navigateToNewsDetail} />;
      case Page.PROFILE:      return <Profile activeTab={profileTab} setActiveTab={setProfileTab} />;
      case Page.PROGRAMS:     return <Programs />;
      case Page.GALLERY:      return <Gallery />;
      case Page.NEWS:         return <News navigateToNewsDetail={navigateToNewsDetail} />;
      case Page.NEWS_DETAIL:  return <NewsDetail newsId={selectedNewsId} setPage={setPage} setNewsId={(id: number) => { setSelectedNewsId(id); }} />;
      case Page.CONTACT:      return <Contact />;
      // Admin
      case Page.ADMIN_DASHBOARD: return <AdminDashboard />;
      case Page.ADMIN_NEWS:      return <AdminNews />;
      case Page.ADMIN_GALLERY:   return <AdminGallery />;
      case Page.ADMIN_TEACHERS:  return <AdminTeachers />;
      case Page.ADMIN_SETTINGS:  return <AdminSettings />;
      default: return <Home setPage={setPage} navigateToNewsDetail={navigateToNewsDetail} />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {isAdmin ? (
        <div className="flex bg-gray-50 min-h-screen">
          <AdminSidebar
            currentPage={page}
            setPage={setPage}
            collapsed={sidebarCollapsed}
            setCollapsed={setSidebarCollapsed}
          />
          <main
            className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${sidebarCollapsed ? 'ml-[72px]' : 'ml-64'}`}
          >
            <AdminTopNavbar currentPage={page} setPage={setPage} collapsed={sidebarCollapsed} />
            <div className="flex-1">
              {renderContent()}
            </div>
          </main>
        </div>
      ) : (
        <>
          <Navbar
            currentPage={page}
            setPage={setPage}
            setProfileTab={setProfileTab}
          />
          <main>
            {renderContent()}
          </main>
          <Footer />
        </>
      )}
    </div>
  );
}

export default App;