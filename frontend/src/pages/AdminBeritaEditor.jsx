import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import RichVisualEditor from '../components/editor/RichVisualEditor';
import SeoSuiteStudio, { boostSeoFields } from '../components/editor/SeoSuiteStudio';
import MediaLibraryModal from '../components/admin/MediaLibraryModal';
import { compressImageToWebP, base64ToFile } from '../utils/imageCompressor';
import ArticleEditorHeader from '../components/admin/ArticleEditorHeader';
import ArticleTitleCard from '../components/admin/ArticleTitleCard';
import ArticlePublishSidebar from '../components/admin/ArticlePublishSidebar';
import ArticleAttachmentManager from '../components/admin/ArticleAttachmentManager';
import ArticlePreviewModal from '../components/admin/ArticlePreviewModal';
import { RotateCcw, X, CheckCircle2 } from 'lucide-react';

export default function AdminBeritaEditor() {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const titleTextareaRef = useRef(null);

  const getLocalNowIso = () => {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
  };

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    cover_image: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80',
    cover_caption: '',
    kategori_id: 1,
    kategori_ids: [1],
    author_name: user?.name || 'Humas BKPSDM Aceh Tamiang',
    status: 'PUBLISHED',
    published_at: getLocalNowIso(),
    is_scheduled: false,
    is_featured: false,
    is_pinned: false,
    tags: 'Kepegawaian, ASN, Aceh Tamiang',
    focus_keyword: '',
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    canonical_url: ''
  });

  const [isAutoSlug, setIsAutoSlug] = useState(!isEditMode);
  const [editingSlug, setEditingSlug] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [saveSuccessToast, setSaveSuccessToast] = useState('');
  const [saveErrorToast, setSaveErrorToast] = useState('');
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [copiedSlug, setCopiedSlug] = useState(false);
  const [useShortPermalink, setUseShortPermalink] = useState(false);
  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [coverMediaModalOpen, setCoverMediaModalOpen] = useState(false);
  const [selectedAttachments, setSelectedAttachments] = useState([]);

  // Auto-Save Draft & Crash Recovery State
  const autoSaveStorageKey = useMemo(() => `cms_draft_berita_${id || 'new'}`, [id]);
  const [autoSaveStatus, setAutoSaveStatus] = useState('');
  const [recoveredDraft, setRecoveredDraft] = useState(null);
  const isInitialLoadRef = useRef(true);

  // 1. Fetch Categories
  const { data: kategoriList = [], refetch: refetchKategori } = useQuery({
    queryKey: ['kategoriBeritaList'],
    queryFn: async () => {
      try {
        const res = await api.get('/berita/kategori');
        return res?.data || [];
      } catch (err) {
        return [
          { id: 1, nama_kategori: 'Pengumuman CASN' },
          { id: 2, nama_kategori: 'Mutasi & Kepangkatan' },
          { id: 3, nama_kategori: 'Bangkom & Diklat' },
          { id: 4, nama_kategori: 'Kinerja & Disiplin ASN' },
          { id: 5, nama_kategori: 'Kesejahteraan & Pensiun' }
        ];
      }
    }
  });

  // Inline Quick Add Category
  const [showAddCategoryInput, setShowAddCategoryInput] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isSubmittingCategory, setIsSubmittingCategory] = useState(false);

  // Set default category from loaded list if not edit mode
  useEffect(() => {
    if (!isEditMode && kategoriList.length > 0 && (!formData.kategori_id || formData.kategori_id === 1)) {
      const match = kategoriList.find((k) => k.id === Number(formData.kategori_id));
      if (!match) {
        setFormData((prev) => ({ ...prev, kategori_id: kategoriList[0].id }));
      }
    }
  }, [kategoriList, isEditMode, formData.kategori_id]);

  const handleQuickAddCategory = async (e) => {
    e?.preventDefault();
    const catName = newCategoryName.trim();
    if (!catName) return;

    setIsSubmittingCategory(true);
    try {
      const res = await api.post('/berita/kategori', {
        nama_kategori: catName,
        deskripsi: `Kategori ${catName}`
      });

      const createdKat = res?.data?.data;
      await queryClient.invalidateQueries({ queryKey: ['kategoriBeritaList'] });
      await refetchKategori();

      if (createdKat?.id) {
        setFormData((prev) => ({ ...prev, kategori_id: createdKat.id }));
      }
      setNewCategoryName('');
      setShowAddCategoryInput(false);
      setSaveSuccessToast(`Kategori "${catName}" berhasil dibuat dan dipilih!`);
      setTimeout(() => setSaveSuccessToast(''), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menambahkan kategori baru.');
    } finally {
      setIsSubmittingCategory(false);
    }
  };

  // 2. Fetch Existing Article if Edit Mode
  const { data: existingArticle } = useQuery({
    queryKey: ['beritaDetailEdit', id],
    queryFn: async () => {
      if (!id) return null;
      const res = await api.get(`/berita/detail-by-id/${id}`);
      return res?.data || null;
    },
    enabled: isEditMode
  });

  // Populate data if in edit mode
  useEffect(() => {
    if (existingArticle) {
      let parsedKatIds = [Number(existingArticle.kategori_id || 1)];
      if (Array.isArray(existingArticle.kategori_ids)) {
        parsedKatIds = existingArticle.kategori_ids.map(Number);
      } else if (typeof existingArticle.kategori_ids === 'string') {
        try {
          const parsed = JSON.parse(existingArticle.kategori_ids);
          if (Array.isArray(parsed)) parsedKatIds = parsed.map(Number);
        } catch (_) {
          parsedKatIds = existingArticle.kategori_ids.split(',').map(s => Number(s.trim())).filter(n => !isNaN(n));
        }
      }

      const articleDate = existingArticle.published_at ? new Date(existingArticle.published_at) : null;
      let localDateStr = getLocalNowIso();
      if (articleDate && !isNaN(articleDate.getTime())) {
        const pad = (n) => String(n).padStart(2, '0');
        localDateStr = `${articleDate.getFullYear()}-${pad(articleDate.getMonth() + 1)}-${pad(articleDate.getDate())}T${pad(articleDate.getHours())}:${pad(articleDate.getMinutes())}`;
      }

      const isFutureScheduled = articleDate && articleDate.getTime() > Date.now();

      setFormData({
        title: existingArticle.title || '',
        slug: existingArticle.slug || '',
        excerpt: existingArticle.excerpt || '',
        content: existingArticle.content || '',
        cover_image: existingArticle.cover_image || 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80',
        cover_caption: existingArticle.cover_caption || '',
        kategori_id: existingArticle.kategori_id || 1,
        kategori_ids: parsedKatIds.length > 0 ? parsedKatIds : [Number(existingArticle.kategori_id || 1)],
        author_name: existingArticle.author_name || user?.name || 'Humas BKPSDM Aceh Tamiang',
        status: existingArticle.status || 'PUBLISHED',
        published_at: localDateStr,
        is_scheduled: !!isFutureScheduled,
        is_featured: !!existingArticle.is_featured,
        is_pinned: !!existingArticle.is_pinned,
        tags: existingArticle.meta_keywords || 'Kepegawaian, ASN, Aceh Tamiang',
        focus_keyword: existingArticle.focus_keyword || (existingArticle.meta_keywords?.split(',')[0] || ''),
        meta_title: existingArticle.meta_title || existingArticle.title || '',
        meta_description: existingArticle.meta_description || existingArticle.excerpt || '',
        meta_keywords: existingArticle.meta_keywords || '',
        canonical_url: existingArticle.canonical_url || ''
      });
      if (existingArticle.lampiran && Array.isArray(existingArticle.lampiran)) {
        setSelectedAttachments(existingArticle.lampiran);
      }
      setIsAutoSlug(false);
    } else if (!isEditMode && user?.name) {
      setFormData((prev) => ({
        ...prev,
        author_name: user.name
      }));
    }
  }, [existingArticle, user, isEditMode]);

  // Check Local Storage Crash Recovery on Mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(autoSaveStorageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.formData && (parsed.formData.title || parsed.formData.content)) {
          // If editing existing, only prompt if draft is newer than existing updated_at or if content differs
          const hasDifferentContent = 
            parsed.formData.title !== (existingArticle?.title || '') ||
            parsed.formData.content !== (existingArticle?.content || '');

          if (!isEditMode || hasDifferentContent) {
            setRecoveredDraft(parsed);
          }
        }
      }
    } catch (e) {
      console.warn('Failed reading draft from localStorage', e);
    }
  }, [autoSaveStorageKey, isEditMode, existingArticle]);

  // Periodic Auto-Save to localStorage (every 15s when modified)
  useEffect(() => {
    // Avoid saving default initial empty form on first render
    if (isInitialLoadRef.current) {
      isInitialLoadRef.current = false;
      return;
    }

    const timer = setTimeout(() => {
      if (!formData.title?.trim() && !formData.content?.trim()) return;
      try {
        const payload = {
          savedAt: new Date().toISOString(),
          formData,
          selectedAttachments
        };
        localStorage.setItem(autoSaveStorageKey, JSON.stringify(payload));
        const timeStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        setAutoSaveStatus(`Draf tersimpan di browser (${timeStr})`);
      } catch (e) {
        console.warn('Auto-save to localStorage failed', e);
      }
    }, 15000);

    return () => clearTimeout(timer);
  }, [formData, selectedAttachments, autoSaveStorageKey]);

  // Restore Recovered Draft
  const handleRestoreDraft = () => {
    if (recoveredDraft && recoveredDraft.formData) {
      setFormData(recoveredDraft.formData);
      if (Array.isArray(recoveredDraft.selectedAttachments)) {
        setSelectedAttachments(recoveredDraft.selectedAttachments);
      }
      setRecoveredDraft(null);
      setSaveSuccessToast('Draf naskah sebelumnya berhasil dipulihkan!');
      setTimeout(() => setSaveSuccessToast(''), 3000);
    }
  };

  // Discard Recovered Draft
  const handleDiscardDraft = () => {
    try {
      localStorage.removeItem(autoSaveStorageKey);
    } catch (_) {}
    setRecoveredDraft(null);
  };

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

  const coverFileInputRef = useRef(null);
  const [coverUploading, setCoverUploading] = useState(false);

  // Auto-Generate Tags from Title & Content
  const handleGenerateTags = () => {
    const title = (formData.title || '').trim();
    const rawContent = (formData.content || '').replace(/<[^>]*>?/gm, ' ').trim();
    const stopWords = new Set(['yang', 'untuk', 'pada', 'dari', 'dalam', 'dengan', 'ke', 'di', 'dan', 'atau', 'ini', 'itu', 'adalah', 'akan', 'bisa', 'tentang', 'bagi', 'serta', 'tahun']);
    const titleWords = title.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter((w) => w.length > 3 && !stopWords.has(w));
    const candidateKeywords = ['BKPSDM Aceh Tamiang', 'Aparatur Sipil Negara', 'Kenaikan Pangkat', 'Mutasi Pegawai', 'Disiplin ASN', 'CASN 2026', 'PPPK 2026'];
    const matchedKeywords = candidateKeywords.filter((kw) => title.toLowerCase().includes(kw.toLowerCase()) || rawContent.toLowerCase().includes(kw.toLowerCase()));
    const capitalized = titleWords.slice(0, 3).map((w) => w.charAt(0).toUpperCase() + w.slice(1));
    const combinedTags = Array.from(new Set([...matchedKeywords, ...capitalized, 'Aceh Tamiang', 'Kepegawaian ASN'])).slice(0, 6);
    const generatedTagString = combinedTags.join(', ');
    setFormData((prev) => ({
      ...prev,
      tags: generatedTagString,
      meta_keywords: generatedTagString,
      focus_keyword: prev.focus_keyword || combinedTags[0] || 'ASN Aceh Tamiang'
    }));
  };

  // Upload Featured Cover Image to MinIO
  const handleCoverUpload = async (e) => {
    let file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Tipe file tidak diizinkan. Harap pilih berkas gambar (JPG, PNG, WebP).');
      if (coverFileInputRef.current) coverFileInputRef.current.value = '';
      return;
    }

    setCoverUploading(true);
    try {
      file = await compressImageToWebP(file, { maxWidth: 1920, maxHeight: 1080, quality: 0.85 });
      const uploadForm = new FormData();
      uploadForm.append('file', file);
      uploadForm.append('nama_lampiran', `Cover Berita: ${formData.title || file.name}`);
      uploadForm.append('kategori_dokumen', 'FOTO_KEGIATAN');

      const res = await api.post('/storage/upload', uploadForm, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const uploadedUrl = res?.data?.file_url || res?.file_url;
      if (uploadedUrl) {
        setFormData((prev) => ({
          ...prev,
          cover_image: uploadedUrl
        }));
      }
    } catch (err) {
      const errMsg = (typeof err === 'string' ? err : err?.response?.data?.message || err?.message) || 'Gagal mengunggah foto sampul.';
      alert(errMsg);
    } finally {
      setCoverUploading(false);
      if (coverFileInputRef.current) coverFileInputRef.current.value = '';
    }
  };

  // Word Count & Stats
  const contentStats = useMemo(() => {
    const textOnly = (formData.content || '').replace(/<[^>]*>?/gm, ' ').trim();
    const words = textOnly.length > 0 ? textOnly.split(/\s+/).length : 0;
    const chars = textOnly.length;
    const readingTime = Math.max(1, Math.ceil(words / 200));
    return { words, chars, readingTime };
  }, [formData.content]);

  // Copy Permalink to Clipboard
  const handleCopyPermalink = () => {
    const slug = formData.slug || 'judul-berita';
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://bkpsdm.acehtamiangkab.go.id';
    const fullUrl = useShortPermalink 
      ? `${baseUrl}/${slug}` 
      : `${baseUrl}/berita/${slug}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedSlug(true);
    setTimeout(() => setCopiedSlug(false), 2000);
  };

  // Save / Publish Mutation
  const saveMutation = useMutation({
    mutationFn: async (payload) => {
      if (isEditMode) {
        return await api.put(`/berita/${id}`, payload);
      } else {
        return await api.post('/berita', payload);
      }
    },
    onSuccess: () => {
      try {
        localStorage.removeItem(autoSaveStorageKey);
      } catch (_) {}
      queryClient.invalidateQueries({ queryKey: ['beritaList'] });
      queryClient.invalidateQueries({ queryKey: ['beritaDetailEdit', id] });
      setSaveSuccessToast(isEditMode ? 'Berita berhasil diperbarui!' : 'Berita baru berhasil diterbitkan!');
      setTimeout(() => {
        setSaveSuccessToast('');
        navigate('/admin?tab=berita');
      }, 1500);
    },
    onError: (err) => {
      const errorMsg = err.response?.data?.message || err.response?.data?.error || err.message || 'Gagal menyimpan artikel. Periksa kelengkapan data.';
      setSaveErrorToast(errorMsg);
      console.error('Save berita error details:', err.response?.data || err);
      setTimeout(() => setSaveErrorToast(''), 6000);
    }
  });

  // Helper to extract and upload base64 images inside HTML content to MinIO
  const processAndUploadBase64Images = async (htmlContent) => {
    if (!htmlContent || !htmlContent.includes('data:image/')) return htmlContent;

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const images = Array.from(doc.querySelectorAll('img'));

    let hasBase64 = false;
    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      const src = img.getAttribute('src') || '';
      if (src.startsWith('data:image/')) {
        hasBase64 = true;
        try {
          const rawFile = base64ToFile(src, `word_paste_${Date.now()}_${i}.webp`);
          if (rawFile) {
            const compressed = await compressImageToWebP(rawFile, { maxWidth: 1920, maxHeight: 1080, quality: 0.85 });
            const formDataUpload = new FormData();
            formDataUpload.append('file', compressed);
            formDataUpload.append('nama_lampiran', `Konten Berita: ${compressed.name}`);
            formDataUpload.append('kategori_dokumen', 'LAMPIRAN_RESMI');

            const res = await api.post('/storage/upload', formDataUpload, {
              headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (res?.data?.file_url) {
              img.setAttribute('src', res.data.file_url);
              img.removeAttribute('width');
              img.removeAttribute('height');
              img.style.maxWidth = '100%';
              img.style.height = 'auto';
              img.style.display = 'block';
              if (!img.style.marginLeft) img.style.marginLeft = 'auto';
              if (!img.style.marginRight) img.style.marginRight = 'auto';
            }
          }
        } catch (uploadErr) {
          console.error('Error auto-uploading base64 image from Word:', uploadErr);
        }
      }
    }

    return hasBase64 ? doc.body.innerHTML : htmlContent;
  };

  const handleSave = async (targetStatus) => {
    if (!formData.title?.trim()) {
      alert('Judul berita tidak boleh kosong.');
      return;
    }

    const rawContent = (formData.content || '').replace(/<[^>]*>?/gm, '').trim();
    if (!rawContent && !formData.content?.includes('<img') && !formData.content?.includes('<iframe')) {
      alert('Konten berita wajib diisi sebelum disimpan.');
      return;
    }

    try {
      let cleanedContent = formData.content || '';
      if (cleanedContent.includes('data:image/')) {
        setSaveErrorToast('Sedang mengunggah dan mengoptimalkan gambar dokumen Word ke server MinIO...');
        cleanedContent = await processAndUploadBase64Images(cleanedContent);
        setFormData((prev) => ({ ...prev, content: cleanedContent }));
        setSaveErrorToast('');
      }

      cleanedContent = cleanedContent
        .replace(/<!--\[if[\s\S]*?<!\[endif\]-->/gi, '')
        .replace(/<\/?o:[^>]*>/gi, '')
        .replace(/<\/?v:[^>]*>/gi, '')
        .replace(/<\/?w:[^>]*>/gi, '')
        .replace(/<\/?m:[^>]*>/gi, '');

      // Resolve valid category ID
      let finalKategoriId = parseInt(formData.kategori_id, 10);
      if (isNaN(finalKategoriId) || finalKategoriId <= 0) {
        finalKategoriId = kategoriList[0]?.id ? parseInt(kategoriList[0].id, 10) : 1;
      }

      const metaKeywordsClamped = (formData.tags || formData.meta_keywords || '').slice(0, 250);
      const metaTitleClamped = (formData.meta_title || formData.title || '').slice(0, 160);
      const metaDescClamped = (formData.meta_description || formData.excerpt || '').slice(0, 320);
      const coverCaptionClamped = (formData.cover_caption || '').slice(0, 250);

      const finalStatus = targetStatus || formData.status || 'PUBLISHED';
      let finalPublishedAt = formData.published_at;

      // Jika tidak dijadwalkan secara eksplisit dan statusnya PUBLISHED, gunakan waktu sekarang
      if (!formData.is_scheduled && finalStatus === 'PUBLISHED') {
        finalPublishedAt = new Date().toISOString();
      } else if (formData.is_scheduled && finalPublishedAt) {
        finalPublishedAt = new Date(finalPublishedAt).toISOString();
      }

      const payload = {
        ...formData,
        title: formData.title.slice(0, 250),
        content: cleanedContent,
        status: finalStatus,
        published_at: finalPublishedAt,
        author_name: user?.name || formData.author_name || 'Humas BKPSDM Aceh Tamiang',
        meta_title: metaTitleClamped,
        meta_description: metaDescClamped,
        meta_keywords: metaKeywordsClamped,
        cover_caption: coverCaptionClamped,
        kategori_id: finalKategoriId,
        kategori_ids: Array.isArray(formData.kategori_ids) && formData.kategori_ids.length > 0 
          ? formData.kategori_ids 
          : [finalKategoriId],
        attachment_ids: selectedAttachments.map((att) => att.id)
      };

      saveMutation.mutate(payload);
    } catch (saveErr) {
      console.error('Error in handleSave:', saveErr);
      setSaveErrorToast(saveErr?.message || 'Gagal memproses data artikel.');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans">
      
      {/* 1. TOP HEADER NAVIGATION BAR */}
      <ArticleEditorHeader
        isEditMode={isEditMode}
        title={formData.title}
        onBoostSeo={() => {
          if (!formData.title && !formData.content) {
            alert('Tuliskan judul atau isi artikel terlebih dahulu untuk boost SEO.');
            return;
          }
          const boosted = boostSeoFields(formData);
          setFormData((prev) => ({ ...prev, ...boosted }));
          setSaveSuccessToast('SEO berhasil di-boost ke skor optimal!');
          setTimeout(() => setSaveSuccessToast(''), 3000);
        }}
        onSaveDraft={() => handleSave('DRAFT')}
        onOpenPreview={() => setPreviewModalOpen(true)}
        onPublish={() => handleSave('PUBLISHED')}
        isPending={saveMutation.isPending}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        saveSuccessToast={saveSuccessToast}
        saveErrorToast={saveErrorToast}
        autoSaveStatus={autoSaveStatus}
      />

      {/* Crash Recovery Notification Banner */}
      {recoveredDraft && (
        <div className="bg-amber-500 text-slate-950 px-4 py-2.5 border-b border-amber-600/30 flex items-center justify-between gap-3 text-xs font-semibold shadow-xs">
          <div className="flex items-center gap-2 min-w-0">
            <span className="p-1 rounded bg-amber-600/30 text-slate-950">
              <RotateCcw className="w-4 h-4" />
            </span>
            <span className="truncate">
              Ditemukan naskah draf otomatis yang belum tersimpan ke server{' '}
              {recoveredDraft.savedAt && `(${new Date(recoveredDraft.savedAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })})`}.
              Pulihkan tulisan Anda?
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleRestoreDraft}
              className="px-3 py-1 bg-slate-950 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors shadow-2xs"
            >
              Pulihkan Naskah
            </button>
            <button
              type="button"
              onClick={handleDiscardDraft}
              className="px-2 py-1 bg-amber-400/80 hover:bg-amber-400 text-slate-900 rounded-lg text-xs font-semibold transition-colors"
              title="Abaikan draf tersimpan"
            >
              Abaikan
            </button>
          </div>
        </div>
      )}

      {/* 2. MAIN LAYOUT: CANVAS EDITOR + SIDEBAR */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* CENTER CANVAS */}
        <main className="flex-1 overflow-y-auto p-3 xs:p-4 sm:p-6 lg:p-10 max-w-5xl mx-auto space-y-4 sm:space-y-6 w-full min-w-0">
          
          {/* Card A: Document Title & Permalink Canvas */}
          <ArticleTitleCard
            titleTextareaRef={titleTextareaRef}
            title={formData.title}
            onTitleChange={handleTitleChange}
            slug={formData.slug}
            onSlugChange={(newSlug) => setFormData((prev) => ({ ...prev, slug: newSlug }))}
            isAutoSlug={isAutoSlug}
            setIsAutoSlug={setIsAutoSlug}
            editingSlug={editingSlug}
            setEditingSlug={setEditingSlug}
            useShortPermalink={useShortPermalink}
            setUseShortPermalink={setUseShortPermalink}
            copiedSlug={copiedSlug}
            onCopyPermalink={handleCopyPermalink}
          />

          {/* Card B: Rich Visual WYSIWYG Editor */}
          <div className="space-y-2">
            <RichVisualEditor
              value={formData.content}
              onChange={(val) => setFormData((prev) => ({ ...prev, content: val }))}
              placeholder="Tuliskan berita lengkap, kronologi, pengumuman, atau jadwal seleksi ASN di sini..."
              minHeight="420px"
            />
          </div>

          {/* Card C: Ringkasan Naskah (Excerpt / Lead Story) */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-slate-200/90 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2">
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                  Ringkasan Berita (Excerpt / Lead Intro)
                </h3>
                <p className="text-[11px] text-slate-400">
                  Ringkasan pembuka 1-2 kalimat yang tampil di kartu berita homepage.
                </p>
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-400 self-end sm:self-auto">
                {(formData.excerpt || '').length} Karakter
              </span>
            </div>

            <textarea
              rows={3}
              placeholder="Ketik ringkasan pembuka berita singkat di sini..."
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              className="w-full p-3.5 text-xs bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-600 focus:outline-none leading-relaxed"
            />
          </div>

          {/* Card D: Lampiran Dokumen MinIO */}
          <ArticleAttachmentManager
            selectedAttachments={selectedAttachments}
            setSelectedAttachments={setSelectedAttachments}
            setMediaModalOpen={setMediaModalOpen}
          />

          {/* Card E: SEO Suite Studio Google Ranking */}
          <SeoSuiteStudio
            formData={formData}
            setFormData={setFormData}
            contentStats={contentStats}
            onBoostNotification={() => {
              setSaveSuccessToast('Skor SEO berhasil ditingkatkan ke level maksimal!');
              setTimeout(() => setSaveSuccessToast(''), 3000);
            }}
          />

        </main>

        {/* MOBILE BACKDROP FOR SIDEBAR DRAWER (< lg) */}
        {sidebarOpen && (
          <div 
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 lg:hidden transition-opacity"
            aria-hidden="true"
          />
        )}

        {/* RIGHT SIDEBAR (Drawer on Mobile, Flex Column on Desktop) */}
        <aside className={`
          fixed top-16 right-0 bottom-0 z-50 w-full sm:w-96 lg:w-80 bg-white border-l border-slate-200/90 shadow-2xl lg:shadow-none
          lg:static lg:top-0 lg:z-auto transition-transform duration-300 ease-in-out flex flex-col
          ${sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:hidden'}
        `}>
          <div className="flex items-center justify-between p-4 border-b border-slate-100 lg:hidden bg-slate-50">
            <h3 className="text-xs font-black uppercase text-slate-800 tracking-wider">
              Pengaturan Publikasi
            </h3>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="p-1.5 rounded-xl hover:bg-slate-200 text-slate-500 text-xs font-bold"
            >
              Tutup &times;
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <ArticlePublishSidebar
              formData={formData}
              setFormData={setFormData}
              user={user}
              kategoriList={kategoriList}
              showAddCategoryInput={showAddCategoryInput}
              setShowAddCategoryInput={setShowAddCategoryInput}
              newCategoryName={newCategoryName}
              setNewCategoryName={setNewCategoryName}
              handleQuickAddCategory={handleQuickAddCategory}
              isSubmittingCategory={isSubmittingCategory}
              coverUploading={coverUploading}
              coverFileInputRef={coverFileInputRef}
              handleCoverUpload={handleCoverUpload}
              setCoverMediaModalOpen={setCoverMediaModalOpen}
              handleGenerateTags={handleGenerateTags}
            />
          </div>
        </aside>

      </div>

      {/* 3. LIVE FULL PREVIEW MODAL */}
      <ArticlePreviewModal
        isOpen={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        formData={formData}
        kategoriList={kategoriList}
      />

      {/* 4. ATTACHMENT LIBRARY MODAL */}
      <MediaLibraryModal
        isOpen={mediaModalOpen}
        onClose={() => setMediaModalOpen(false)}
        selectedIds={selectedAttachments.map((a) => a.id)}
        onSelectFiles={(ids, files) => {
          setSelectedAttachments(files);
        }}
        title="Pustaka Dokumen & Lampiran Berita (MinIO)"
        confirmText="Lampirkan Dokumen Terpilih"
      />

      {/* 5. COVER / FEATURED IMAGE MEDIA MODAL */}
      <MediaLibraryModal
        isOpen={coverMediaModalOpen}
        onClose={() => setCoverMediaModalOpen(false)}
        singleSelect={true}
        onlyImages={true}
        title="Pilih Gambar Sampul Utama (Featured Image)"
        confirmText="Gunakan Sebagai Sampul"
        onSelectFiles={(ids, files) => {
          if (files && files.length > 0) {
            const chosen = files[0];
            setFormData((prev) => ({
              ...prev,
              cover_image: chosen.file_url || prev.cover_image,
              cover_caption: prev.cover_caption || chosen.nama_lampiran || ''
            }));
          }
          setCoverMediaModalOpen(false);
        }}
      />

    </div>
  );
}
