import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  ArrowLeft,
  Save,
  Send,
  Eye,
  Sliders,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  X,
  Layout,
  Globe,
  Zap
} from 'lucide-react';
import RichVisualEditor from '../components/editor/RichVisualEditor';
import SeoSuiteStudio, { boostSeoFields } from '../components/editor/SeoSuiteStudio';

export default function AdminPageEditor() {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const titleTextareaRef = useRef(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    cover_image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    template: 'DEFAULT',
    status: 'PUBLISHED',
    meta_title: '',
    meta_description: '',
    meta_keywords: ''
  });

  const [isAutoSlug, setIsAutoSlug] = useState(!isEditMode);
  const [editingSlug, setEditingSlug] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [saveSuccessToast, setSaveSuccessToast] = useState('');
  const [saveErrorToast, setSaveErrorToast] = useState('');
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [copiedSlug, setCopiedSlug] = useState(false);

  // Fetch Existing Page if Edit Mode
  const { data: existingPage, isLoading: isLoadingPage } = useQuery({
    queryKey: ['pageDetailEdit', id],
    queryFn: async () => {
      if (!id) return null;
      const res = await api.get('/cms/pages');
      const allPages = res?.data || [];
      return allPages.find((p) => String(p.id) === String(id)) || null;
    },
    enabled: isEditMode
  });

  useEffect(() => {
    if (existingPage) {
      setFormData({
        title: existingPage.title || '',
        slug: existingPage.slug || '',
        excerpt: existingPage.excerpt || '',
        content: existingPage.content || '',
        cover_image: existingPage.cover_image || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
        template: existingPage.template || 'DEFAULT',
        status: existingPage.status || 'PUBLISHED',
        meta_title: existingPage.meta_title || existingPage.title || '',
        meta_description: existingPage.meta_description || existingPage.excerpt || '',
        meta_keywords: existingPage.meta_keywords || ''
      });
      setIsAutoSlug(false);
    }
  }, [existingPage]);

  // Auto-resize title textarea
  useEffect(() => {
    if (titleTextareaRef.current) {
      titleTextareaRef.current.style.height = 'auto';
      titleTextareaRef.current.style.height = `${Math.max(60, titleTextareaRef.current.scrollHeight)}px`;
    }
  }, [formData.title]);

  // Auto-generate Slug when Title Changes
  const handleTitleChange = (e) => {
    const val = e.target.value;
    const generatedSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: isAutoSlug ? generatedSlug : prev.slug,
      meta_title: prev.meta_title === prev.title || !prev.meta_title ? val : prev.meta_title
    }));
  };

  // Copy Permalink to Clipboard
  const handleCopyPermalink = () => {
    const fullUrl = `https://bkpsdm.acehtamiangkab.go.id/page/${formData.slug || 'halaman'}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedSlug(true);
    setTimeout(() => setCopiedSlug(false), 2000);
  };

  // Save / Publish Mutation
  const saveMutation = useMutation({
    mutationFn: async (payload) => {
      if (isEditMode) {
        return await api.put(`/cms/pages/${id}`, payload);
      } else {
        return await api.post('/cms/pages', payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cmsPagesList'] });
      setSaveSuccessToast(isEditMode ? 'Halaman berhasil diperbarui!' : 'Halaman baru berhasil disimpan!');
      setTimeout(() => {
        setSaveSuccessToast('');
        navigate('/admin?tab=pages');
      }, 1500);
    },
    onError: (err) => {
      setSaveErrorToast(err.response?.data?.message || 'Gagal menyimpan halaman.');
      setTimeout(() => setSaveErrorToast(''), 4000);
    }
  });

  const handleSave = (targetStatus) => {
    if (!formData.title.trim()) {
      alert('Judul halaman tidak boleh kosong.');
      return;
    }

    const payload = {
      ...formData,
      status: targetStatus || formData.status
    };

    saveMutation.mutate(payload);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans">
      
      {/* 1. TOP HEADER NAVIGATION BAR */}
      <header className="h-16 bg-white border-b border-slate-200/90 sticky top-0 z-40 px-4 sm:px-6 flex items-center justify-between shadow-2xs">
        
        {/* Left: Back Link & Document Title */}
        <div className="flex items-center gap-3 min-w-0">
          <Link
            to="/admin?tab=pages"
            className="p-2 hover:bg-slate-100 rounded-2xl text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1.5 text-xs font-bold shrink-0"
            title="Kembali ke Daftar Halaman"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-800" />
            <span className="hidden sm:inline">Daftar Halaman</span>
          </Link>

          <div className="h-5 w-px bg-slate-200 shrink-0" />

          <div className="flex items-center gap-2 min-w-0">
            <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-lg shrink-0">
              {isEditMode ? 'Edit Halaman CMS' : 'Buat Halaman Baru'}
            </span>
            <p className="text-xs font-bold text-slate-800 truncate max-w-xs sm:max-w-md hidden md:block">
              {formData.title || 'Draft Halaman Statis'}
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          
          {/* Quick 1-Click SEO Boost Button */}
          <button
            type="button"
            onClick={() => {
              if (!formData.title && !formData.content) {
                alert('Tuliskan judul atau isi halaman terlebih dahulu untuk boost SEO.');
                return;
              }
              const boosted = boostSeoFields(formData);
              setFormData((prev) => ({ ...prev, ...boosted }));
              setSaveSuccessToast('SEO berhasil di-boost ke skor optimal!');
              setTimeout(() => setSaveSuccessToast(''), 3000);
            }}
            className="h-9 px-3.5 bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs border border-amber-500/40"
            title="1-Klik Boost Kata Kunci, Judul Google, Meta Deskripsi & Tag SEO"
          >
            <Zap className="w-3.5 h-3.5 fill-slate-950" />
            <span className="hidden sm:inline">Boost SEO</span>
          </button>

          <div className="h-5 w-px bg-slate-200 hidden sm:block mx-0.5" />

          {/* Save Draft */}
          <button
            type="button"
            onClick={() => handleSave('DRAFT')}
            disabled={saveMutation.isPending}
            className="h-9 px-3.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 hover:text-slate-900 border border-slate-200/90 rounded-xl transition-all cursor-pointer hidden sm:flex items-center gap-1.5 shadow-2xs disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5 text-slate-500" />
            <span>Simpan Konsep</span>
          </button>

          {/* Preview Modal Trigger */}
          <button
            type="button"
            onClick={() => setPreviewModalOpen(true)}
            className="h-9 px-3.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 hover:text-slate-900 border border-slate-200/90 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
          >
            <Eye className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Pratinjau</span>
          </button>

          {/* Big Publish / Update Button */}
          <button
            type="button"
            onClick={() => handleSave('PUBLISHED')}
            disabled={saveMutation.isPending}
            className="h-9 px-4 bg-emerald-800 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5 text-amber-300" />
            <span>{saveMutation.isPending ? 'Menyimpan...' : (isEditMode ? 'Perbarui Halaman' : 'Publikasikan Halaman')}</span>
          </button>

          {/* Sidebar Toggle */}
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`w-9 h-9 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
              sidebarOpen 
                ? 'bg-slate-900 text-white border-slate-900 shadow-2xs' 
                : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200/90 shadow-2xs'
            }`}
            title="Buka / Tutup Pengaturan Halaman"
          >
            <Sliders className="w-3.5 h-3.5" />
          </button>

        </div>

      </header>

      {/* Toast Notifications */}
      {saveSuccessToast && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-bold animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{saveSuccessToast}</span>
        </div>
      )}
      {saveErrorToast && (
        <div className="fixed top-20 right-6 z-50 bg-red-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-bold animate-pulse">
          <AlertCircle className="w-4 h-4 text-red-400" />
          <span>{saveErrorToast}</span>
        </div>
      )}

      {/* 2. MAIN CANVAS & SIDEBAR */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* CENTER CANVAS */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 lg:p-10 max-w-5xl mx-auto space-y-6">
          
          {/* Title & Slug */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1 block">
                Judul Halaman Publik / Profil
              </label>
              <textarea
                ref={titleTextareaRef}
                rows={2}
                placeholder="Contoh: Visi, Misi & Maklumat Pelayanan BKPSDM..."
                value={formData.title}
                onChange={handleTitleChange}
                className="w-full text-2xl sm:text-3xl font-black text-slate-900 placeholder:text-slate-300 focus:outline-none border-none p-0 tracking-tight leading-snug resize-none overflow-hidden"
              />
            </div>

            {/* Permalink */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 pt-3 border-t border-slate-100">
              <span className="font-semibold text-slate-400">Permalink:</span>
              <div className="flex items-center gap-1.5 font-mono text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-100 text-xs">
                <span>https://bkpsdm.acehtamiangkab.go.id/page/</span>
                <strong className="text-emerald-950 font-bold">{formData.slug || 'halaman'}</strong>
              </div>

              {editingSlug ? (
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="p-1 text-xs font-mono border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setEditingSlug(false);
                      setIsAutoSlug(false);
                    }}
                    className="p-1.5 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 text-[10px] cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setEditingSlug(true)}
                  className="text-emerald-700 hover:text-emerald-900 font-bold underline cursor-pointer text-[11px]"
                >
                  Ubah Slug
                </button>
              )}

              <button
                type="button"
                onClick={handleCopyPermalink}
                className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors cursor-pointer"
                title="Salin Link"
              >
                {copiedSlug ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Visual WYSIWYG Editor */}
          <div className="space-y-4">
            <RichVisualEditor
              value={formData.content}
              onChange={(val) => setFormData((prev) => ({ ...prev, content: val }))}
              placeholder="Susun konten profil, bagan organisasi, dasar hukum, atau standar operasional prosedur di sini..."
              minHeight="460px"
            />

            {/* Excerpt */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-5 space-y-2">
              <label className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-emerald-700" />
                <span>Ringkasan Halaman (Excerpt)</span>
              </label>
              <textarea
                rows={2}
                placeholder="Penjelasan singkat halaman yang akan tampil di indeks mesin pencari..."
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none leading-relaxed text-slate-800"
              />
            </div>
          </div>

        </main>

        {/* RIGHT SIDEBAR */}
        {sidebarOpen && (
          <aside className="w-80 sm:w-88 bg-white border-l border-slate-200/90 overflow-y-auto p-5 space-y-6 shrink-0 shadow-lg lg:shadow-none">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs font-black uppercase text-slate-900 tracking-wider">
                Pengaturan Halaman
              </h3>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">
                Page Builder
              </span>
            </div>

            {/* Status */}
            <div className="space-y-3">
              <label className="text-xs font-black uppercase text-slate-700 tracking-wider">Status Halaman</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, status: 'PUBLISHED' })}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    formData.status === 'PUBLISHED' 
                      ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs' 
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Terpublikasi
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, status: 'DRAFT' })}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    formData.status === 'DRAFT' 
                      ? 'bg-amber-600 text-white border-amber-600 shadow-xs' 
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Konsep (Draft)
                </button>
              </div>
            </div>

            {/* Template Selector */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <label className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
                <Layout className="w-3.5 h-3.5 text-emerald-700" />
                <span>Tata Letak / Template</span>
              </label>
              
              <div className="space-y-1.5">
                {[
                  { id: 'DEFAULT', name: 'Standar (Sidebar Menu)', desc: 'Cocok untuk profil dan dokumen resmi' },
                  { id: 'FULL_WIDTH', name: 'Lebar Penuh (Full Width)', desc: 'Ideal untuk bagan dan infografis' },
                  { id: 'SIDEBAR_PROFILE', name: 'Profil Pejabat / Pimpinan', desc: 'Disertai kartu kontak dan foto pejabat' },
                  { id: 'COMING_SOON', name: 'Segera Hadir (Coming Soon)', desc: 'Tampilan pengumuman dalam tahap pengembangan' }
                ].map((tpl) => (
                  <label
                    key={tpl.id}
                    className={`block p-3 rounded-2xl border text-xs cursor-pointer transition-all ${
                      formData.template === tpl.id 
                        ? 'bg-emerald-50 border-emerald-300 font-bold text-emerald-950 shadow-2xs' 
                        : 'bg-slate-50 border-slate-100 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{tpl.name}</span>
                      <input
                        type="radio"
                        name="template"
                        value={tpl.id}
                        checked={formData.template === tpl.id}
                        onChange={() => setFormData({ ...formData, template: tpl.id })}
                        className="text-emerald-800 focus:ring-emerald-600"
                      />
                    </div>
                    <p className="text-[10px] font-normal text-slate-400 mt-0.5">{tpl.desc}</p>
                  </label>
                ))}
              </div>
            </div>

            {/* Banner Cover */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <label className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-emerald-700" />
                <span>Banner Sampul Halaman</span>
              </label>
              <div className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50 p-2 space-y-2">
                <div className="h-32 bg-slate-200 rounded-xl overflow-hidden">
                  <img
                    src={formData.cover_image}
                    alt="Cover"
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80'; }}
                  />
                </div>
                <input
                  type="text"
                  placeholder="URL Banner (https://...)"
                  value={formData.cover_image}
                  onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                  className="w-full p-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-1 focus:ring-emerald-600 focus:outline-none font-mono"
                />
              </div>
            </div>

          </aside>
        )}

      </div>

      {/* 3. PREVIEW MODAL */}
      {previewModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-xs z-10">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg">
                Pratinjau Halaman: {formData.title || 'Halaman'}
              </span>
              <button
                type="button"
                onClick={() => setPreviewModalOpen(false)}
                className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 sm:p-8 space-y-6">
              {formData.cover_image && (
                <div className="h-48 rounded-2xl overflow-hidden">
                  <img src={formData.cover_image} alt="Banner" className="w-full h-full object-cover" loading="lazy" decoding="async" />
                </div>
              )}
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">{formData.title}</h1>
              <div 
                className="prose prose-slate max-w-none text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: formData.content }}
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
