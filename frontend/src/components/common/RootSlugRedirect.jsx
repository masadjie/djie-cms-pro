import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import NotFound from '../../pages/NotFound';

// Daftar prefix route yang bukan slug individual (sudah terdaftar di React Router)
const RESERVED_PREFIXES = [
  'admin',
  'api',
  'login',
  'register',
  'katalog',
  'berita',
  'sikepo',
  'tracking',
  'install',
  'page',
  'halaman',
  'layanan'
];

export default function RootSlugRedirect() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug || RESERVED_PREFIXES.includes(slug.toLowerCase())) {
      navigate('/', { replace: true });
      return;
    }

    let isMounted = true;

    const resolveSlug = async () => {
      try {
        // 1. Cek apakah slug adalah Berita / Artikel
        const beritaRes = await api.get(`/berita/${slug}`);
        if (isMounted && beritaRes?.data) {
          // Berita ditemukan! Redirect ke /berita/:slug
          navigate(`/berita/${slug}`, { replace: true });
          return;
        }
      } catch (err) {
        // Slug bukan berita, coba cek CMS static page
      }

      try {
        // 2. Cek apakah slug adalah Halaman Statis CMS
        const pageRes = await api.get(`/cms/pages/${slug}`);
        if (isMounted && pageRes?.data) {
          // Page ditemukan! Redirect ke /page/:slug
          navigate(`/page/${slug}`, { replace: true });
          return;
        }
      } catch (err) {
        // Slug bukan CMS page juga
      }

      if (isMounted) {
        setChecking(false);
        setNotFound(true);
      }
    };

    resolveSlug();

    return () => {
      isMounted = false;
    };
  }, [slug, navigate]);

  if (notFound) {
    return <NotFound attemptedSlug={slug} />;
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center pt-28 pb-16">
      <div className="text-center space-y-3">
        <div className="animate-spin w-9 h-9 border-3 border-emerald-600 border-t-transparent rounded-full mx-auto" />
        <p className="text-xs font-semibold text-slate-500">Mengarahkan ke halaman resmi...</p>
      </div>
    </div>
  );
}
