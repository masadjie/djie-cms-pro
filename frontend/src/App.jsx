import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import TopAnnouncementBar from './components/common/TopAnnouncementBar';
import ScrollToTop from './components/common/ScrollToTop';
import TopProgressBar from './components/common/TopProgressBar';

// Code-splitting via lazy load for heavy sub-pages & admin pages
const Katalog = lazy(() => import('./pages/Katalog'));
const DetailLayanan = lazy(() => import('./pages/DetailLayanan'));
const BeritaList = lazy(() => import('./pages/BeritaList'));
const BeritaDetail = lazy(() => import('./pages/BeritaDetail'));
const Tracking = lazy(() => import('./pages/Tracking'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const SikepoHub = lazy(() => import('./pages/SikepoHub'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminBeritaEditor = lazy(() => import('./pages/AdminBeritaEditor'));
const AdminPageEditor = lazy(() => import('./pages/AdminPageEditor'));
const PageView = lazy(() => import('./pages/PageView'));
const RootSlugRedirect = lazy(() => import('./components/common/RootSlugRedirect'));
const Galeri = lazy(() => import('./pages/Galeri'));
const InstallWizard = lazy(() => import('./pages/InstallWizard'));
const NotFound = lazy(() => import('./pages/NotFound'));
const MaintenancePage = lazy(() => import('./pages/MaintenancePage'));

import api from './services/api';
import { ConfirmDialogProvider } from './components/common/ConfirmDialog';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from './context/AuthContext';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // Query Installation Status from Backend
  const { data: installStatus, isLoading: isCheckingInstall } = useQuery({
    queryKey: ['cmsInstallStatus'],
    queryFn: async () => {
      try {
        const res = await api.get('/cms/install/status');
        return res?.data || res || {};
      } catch (err) {
        return { is_installed: true }; // fallback safe
      }
    },
    staleTime: 1000 * 60
  });

  // Query Web Settings for Maintenance Mode
  const { data: webSettings } = useQuery({
    queryKey: ['cmsWebSettingsApp'],
    queryFn: async () => {
      try {
        const res = await api.get('/cms/pengaturan');
        return res?.data || res || {};
      } catch (err) {
        return {};
      }
    },
    staleTime: 1000 * 30 // Check every 30s
  });

  const isInstalled = installStatus?.is_installed === true;
  const isMaintenanceMode = webSettings?.maintenance_mode === 'true';
  const isAdminUser = !!user && (user.role === 'SUPER_ADMIN' || user.role === 'ADMIN_OPD' || user.role === 'EDITOR');
  const isAuthOrAdminPage = location.pathname === '/admin/login' || location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/install' || location.pathname.startsWith('/admin');

  // AUTO-REDIRECT TO INSTALLATION WIZARD IF FRESH CLONE / NOT INSTALLED
  useEffect(() => {
    if (!isCheckingInstall && installStatus && installStatus.is_installed === false) {
      if (location.pathname !== '/install') {
        navigate('/install', { replace: true });
      }
    }
  }, [isCheckingInstall, installStatus, location.pathname, navigate]);

  // Real-time Traffic Tracking Beacon: Sends live hit on every page navigation
  useEffect(() => {
    if (!location.pathname.startsWith('/admin')) {
      const sessionId = sessionStorage.getItem('tamiang_session') || (() => {
        const id = 'sess_' + Math.random().toString(36).substring(2, 12);
        sessionStorage.setItem('tamiang_session', id);
        return id;
      })();

      api.post('/cms/track-visit', {
        path: location.pathname + location.search,
        referrer: document.referrer || 'direct',
        session_id: sessionId
      }).catch(() => {});
    }
  }, [location.pathname, location.search]);

  // Stealth Hotkey for Administrator: Ctrl+Shift+A / Cmd+Shift+A
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        navigate('/login');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  // If Maintenance Mode is Active, and visitor is not admin / on admin routes, render MaintenancePage
  if (isMaintenanceMode && !isAdminUser && !isAuthOrAdminPage) {
    return (
      <Suspense fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
          <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }>
        <MaintenancePage settings={webSettings} />
      </Suspense>
    );
  }

  return (
    <ConfirmDialogProvider>
      <TopProgressBar />
      <ScrollToTop />
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
        {!isAuthOrAdminPage && <TopAnnouncementBar />}
        {!isAuthOrAdminPage && <Navbar />}
        <main className="flex-1">
          <Suspense fallback={
            <div className="min-h-[50vh] flex items-center justify-center">
              <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
            </div>
          }>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/sikepo" element={<SikepoHub />} />
              <Route path="/katalog" element={<div className="pt-28"><Katalog /></div>} />
              <Route path="/layanan/:slug" element={<div className="pt-28"><DetailLayanan /></div>} />
              <Route path="/berita" element={<BeritaList />} />
              <Route path="/berita/:slug" element={<BeritaDetail />} />
              <Route path="/galeri" element={<Galeri />} />
              <Route path="/page/:slug" element={<PageView />} />
              <Route path="/halaman/:slug" element={<PageView />} />
              <Route path="/tracking" element={<div className="pt-28"><Tracking /></div>} />
              <Route path="/install" element={<InstallWizard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/berita/create" element={<AdminBeritaEditor />} />
              <Route path="/admin/berita/edit/:id" element={<AdminBeritaEditor />} />
              <Route path="/admin/pages/create" element={<AdminPageEditor />} />
              <Route path="/admin/pages/edit/:id" element={<AdminPageEditor />} />
              {/* Direct Root Slug Resolver (misal: /pengumuman-xxx -> /berita/pengumuman-xxx) */}
              <Route path="/:slug" element={<RootSlugRedirect />} />
              {/* Catch-all 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        {!isAuthOrAdminPage && <Footer />}
      </div>
    </ConfirmDialogProvider>
  );
}
