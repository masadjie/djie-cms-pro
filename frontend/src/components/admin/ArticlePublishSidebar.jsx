import React from 'react';
import {
  FolderOpen,
  Plus,
  RefreshCw,
  Check,
  ImageIcon,
  UploadCloud,
  Tag,
  Wand2,
  Calendar,
  User,
  Pin,
  Flame,
  Clock
} from 'lucide-react';

export default function ArticlePublishSidebar({
  formData,
  setFormData,
  user,
  kategoriList,
  showAddCategoryInput,
  setShowAddCategoryInput,
  newCategoryName,
  setNewCategoryName,
  handleQuickAddCategory,
  isSubmittingCategory,
  coverUploading,
  coverFileInputRef,
  handleCoverUpload,
  setCoverMediaModalOpen,
  handleGenerateTags
}) {
  const isScheduled = formData.status === 'PUBLISHED' && formData.is_scheduled && formData.published_at && new Date(formData.published_at) > new Date();

  const handleSetNow = () => {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const localIso = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
    setFormData({ ...formData, published_at: localIso, is_scheduled: false });
  };

  const handleSetTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(8, 0, 0, 0);
    const pad = (n) => String(n).padStart(2, '0');
    const localIso = `${tomorrow.getFullYear()}-${pad(tomorrow.getMonth() + 1)}-${pad(tomorrow.getDate())}T${pad(tomorrow.getHours())}:${pad(tomorrow.getMinutes())}`;
    setFormData({ ...formData, status: 'PUBLISHED', published_at: localIso, is_scheduled: true });
  };
  return (
    <div className="w-full p-4 sm:p-6 space-y-5 sm:space-y-6">
      
      {/* 1. Status Publikasi & Jadwal */}
      <div className="space-y-4">
        <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">
          Pengaturan Publikasi
        </h3>

        {/* Status Selector */}
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
            Publikasikan
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

        {/* Scheduling Toggle & Options */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={!!formData.is_scheduled}
                onChange={(e) => {
                  const checked = e.target.checked;
                  if (checked) {
                    const tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    tomorrow.setHours(8, 0, 0, 0);
                    const pad = (n) => String(n).padStart(2, '0');
                    const localIso = `${tomorrow.getFullYear()}-${pad(tomorrow.getMonth() + 1)}-${pad(tomorrow.getDate())}T${pad(tomorrow.getHours())}:${pad(tomorrow.getMinutes())}`;
                    setFormData({ ...formData, is_scheduled: true, status: 'PUBLISHED', published_at: localIso });
                  } else {
                    handleSetNow();
                  }
                }}
                className="w-4 h-4 rounded text-emerald-800 focus:ring-emerald-600 cursor-pointer"
              />
              <span>Jadwalkan Penayangan (Schedule)</span>
            </label>

            {formData.is_scheduled && (
              <span className="text-[10px] font-black uppercase text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                Terjadwal
              </span>
            )}
          </div>

          {formData.is_scheduled ? (
            <div className="space-y-1.5 pt-1 bg-sky-50/50 p-2.5 rounded-xl border border-sky-200/70">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-sky-900 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-sky-600" />
                  Pilih Tanggal & Jam Terbit
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handleSetTomorrow}
                    className="text-[10px] font-bold text-sky-700 hover:text-sky-900 bg-white hover:bg-sky-100 border border-sky-200 px-1.5 py-0.5 rounded transition-colors"
                  >
                    Besok 08:00
                  </button>
                </div>
              </div>
              <input
                type="datetime-local"
                value={formData.published_at}
                onChange={(e) => setFormData({ ...formData, published_at: e.target.value })}
                className="w-full p-2 text-xs bg-white border border-sky-300 rounded-xl focus:ring-2 focus:ring-sky-600 focus:outline-none text-sky-950 font-semibold"
              />
              <p className="text-[10px] text-sky-700 leading-tight">
                *Artikel akan otomatis aktif dan tampil ke publik setelah tanggal & jam di atas tercapai.
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs">
              <div className="flex items-center gap-1.5 text-slate-600 text-[11px]">
                <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                <span>Terbit langsung sekarang (Waktu real-time default)</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                Langsung
              </span>
            </div>
          )}
        </div>

        {/* Author (Otomatis dari Akun Login) */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
            <User className="w-3.5 h-3.5 text-slate-400" />
            <span>Nama Penulis / Redaksi</span>
          </label>

          <div className="flex items-center gap-2 p-2.5 bg-emerald-50/70 border border-emerald-200/80 rounded-xl text-xs">
            <div className="w-7 h-7 rounded-lg bg-emerald-800 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
              {(user?.name || formData.author_name || 'A').charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-slate-900 truncate">
                {user?.name || formData.author_name || 'Admin BKPSDM'}
              </p>
              <p className="text-[10px] text-emerald-800 font-semibold truncate">
                Otentikasi Akun Resmi ({user?.role || 'EDITOR'})
              </p>
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider bg-white text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-md shadow-2xs">
              Otomatis
            </span>
          </div>
        </div>

        {/* Sticky & Featured Checkboxes */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-800 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_pinned}
              onChange={(e) => setFormData({ ...formData, is_pinned: e.target.checked })}
              className="w-4 h-4 rounded text-emerald-800 focus:ring-emerald-600"
            />
            <Pin className="w-3.5 h-3.5 text-amber-500" />
            <span>Sematkan di Teratas (Sticky Post)</span>
          </label>

          <label className="flex items-center gap-2 text-xs font-semibold text-slate-800 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_featured}
              onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
              className="w-4 h-4 rounded text-emerald-800 focus:ring-emerald-600"
            />
            <Flame className="w-3.5 h-3.5 text-red-500" />
            <span>Tampilkan di Hero Banner Slider</span>
          </label>
        </div>

      </div>

      {/* 2. Kategori Berita */}
      <div className="space-y-3 pt-3 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <label className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
            <FolderOpen className="w-3.5 h-3.5 text-emerald-700" />
            <span>Kategori Berita</span>
          </label>
          <button
            type="button"
            onClick={() => setShowAddCategoryInput(!showAddCategoryInput)}
            className="text-[10px] font-bold text-emerald-800 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded-lg border border-emerald-200 transition-colors flex items-center gap-1 cursor-pointer"
            title="Tambah Kategori Baru Langsung"
          >
            <Plus className="w-3 h-3 text-emerald-700" />
            <span>{showAddCategoryInput ? 'Batal' : '+ Tambah'}</span>
          </button>
        </div>

        {/* Inline Add Category Form */}
        {showAddCategoryInput && (
          <form 
            onSubmit={handleQuickAddCategory} 
            className="p-2.5 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2 animate-in fade-in duration-150"
          >
            <p className="text-[10px] font-bold text-emerald-900">Nama Kategori Baru:</p>
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Contoh: Info Seleksi PPPK..."
                className="flex-1 p-1.5 text-xs bg-white border border-emerald-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600"
                autoFocus
              />
              <button
                type="submit"
                disabled={isSubmittingCategory || !newCategoryName.trim()}
                className="px-2.5 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-2xs flex items-center gap-1 disabled:opacity-50 cursor-pointer"
              >
                {isSubmittingCategory ? (
                  <RefreshCw className="w-3 h-3 animate-spin" />
                ) : (
                  <Check className="w-3 h-3" />
                )}
                <span>Simpan</span>
              </button>
            </div>
          </form>
        )}

        {/* List Kategori (Multi-select ala WordPress dengan Kategori Utama) */}
        <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
          {kategoriList.map((kat) => {
            const isChecked = Array.isArray(formData.kategori_ids)
              ? formData.kategori_ids.includes(Number(kat.id))
              : Number(formData.kategori_id) === Number(kat.id);
            const isPrimary = Number(formData.kategori_id) === Number(kat.id);

            return (
              <div 
                key={kat.id}
                className={`flex items-center justify-between p-2 rounded-xl border text-xs transition-all ${
                  isChecked
                    ? 'bg-emerald-50/80 border-emerald-300 font-bold text-emerald-950'
                    : 'bg-slate-50 border-slate-100 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <label className="flex items-center gap-2 cursor-pointer flex-1 min-w-0 pr-1">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => {
                      const idNum = Number(kat.id);
                      let currentIds = Array.isArray(formData.kategori_ids) && formData.kategori_ids.length > 0
                        ? [...formData.kategori_ids]
                        : [Number(formData.kategori_id || kat.id)];

                      if (e.target.checked) {
                        if (!currentIds.includes(idNum)) {
                          currentIds.push(idNum);
                        }
                      } else {
                        currentIds = currentIds.filter((cid) => cid !== idNum);
                        if (currentIds.length === 0) {
                          currentIds = [idNum]; // Minimal 1 kategori
                        }
                      }

                      // Primary kategori_id fallback jika diuncheck
                      let newPrimary = formData.kategori_id;
                      if (!currentIds.includes(Number(newPrimary))) {
                        newPrimary = currentIds[0];
                      }

                      setFormData({
                        ...formData,
                        kategori_ids: currentIds,
                        kategori_id: newPrimary
                      });
                    }}
                    className="w-4 h-4 rounded text-emerald-800 focus:ring-emerald-600 border-slate-300 cursor-pointer"
                  />
                  <span className="truncate">{kat.nama_kategori}</span>
                </label>

                {isChecked && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFormData({ ...formData, kategori_id: kat.id });
                    }}
                    className={`text-[10px] px-2 py-0.5 rounded-md font-bold transition-all shrink-0 cursor-pointer ${
                      isPrimary
                        ? 'bg-emerald-800 text-white shadow-2xs'
                        : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                    }`}
                    title={isPrimary ? 'Kategori Utama' : 'Jadikan Kategori Utama'}
                  >
                    {isPrimary ? 'Utama' : 'Set Utama'}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Gambar Sampul (Featured Image) */}
      <div className="space-y-3 pt-3 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <label className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-emerald-700" />
            <span>Gambar Utama (Featured Image)</span>
          </label>
          <button
            type="button"
            onClick={() => coverFileInputRef.current?.click()}
            disabled={coverUploading}
            className="text-[10px] font-bold text-emerald-800 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded-lg border border-emerald-200 transition-colors flex items-center gap-1 cursor-pointer"
          >
            {coverUploading ? (
              <>
                <RefreshCw className="w-3 h-3 animate-spin text-emerald-700" />
                <span>Mengunggah...</span>
              </>
            ) : (
              <>
                <UploadCloud className="w-3 h-3 text-emerald-700" />
                <span>Unggah Gambar</span>
              </>
            )}
          </button>
        </div>

        {/* Hidden file input for cover upload */}
        <input
          type="file"
          ref={coverFileInputRef}
          onChange={handleCoverUpload}
          className="hidden"
          accept=".jpg,.jpeg,.png,.webp"
        />

        <div className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50 space-y-2 p-2">
          <div 
            onClick={() => coverFileInputRef.current?.click()}
            className="h-36 bg-slate-200 rounded-xl overflow-hidden relative group cursor-pointer border border-slate-200"
            title="Klik untuk mengganti gambar sampul dari perangkat"
          >
            <img
              src={formData.cover_image}
              alt="Cover Preview"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80'; }}
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
              <UploadCloud className="w-6 h-6 text-white" />
              <span className="text-white text-[11px] font-bold">Klik untuk Unggah Gambar Baru</span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px] text-slate-500">
              <span>URL Gambar / Jalur MinIO</span>
              <button
                type="button"
                onClick={() => setCoverMediaModalOpen(true)}
                className="text-emerald-700 hover:underline font-semibold cursor-pointer"
              >
                Pilih dari Pustaka
              </button>
            </div>
            <input
              type="text"
              placeholder="URL Gambar Sampul (https://... atau /api/v1/storage/...)"
              value={formData.cover_image}
              onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
              className="w-full p-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-1 focus:ring-emerald-600 focus:outline-none font-mono"
            />
          </div>

          <input
            type="text"
            placeholder="Keterangan foto / Caption..."
            value={formData.cover_caption}
            onChange={(e) => setFormData({ ...formData, cover_caption: e.target.value })}
            className="w-full p-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-1 focus:ring-emerald-600 focus:outline-none"
          />
        </div>
      </div>

      {/* 4. Tag & Kata Kunci Berita */}
      <div className="space-y-2 pt-3 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <label className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-emerald-700" />
            <span>Tag & Kata Kunci Berita</span>
          </label>
          <button
            type="button"
            onClick={handleGenerateTags}
            className="text-[10px] font-bold text-amber-800 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 px-2 py-0.5 rounded-lg border border-amber-200 transition-colors flex items-center gap-1 cursor-pointer"
            title="Ekstrak kata kunci otomatis berdasarkan judul dan isi berita"
          >
            <Wand2 className="w-3 h-3 text-amber-600" />
            <span>Auto Generator Tag</span>
          </button>
        </div>

        <input
          type="text"
          placeholder="Pisahkan dengan koma (contoh: ASN, Kenaikan Pangkat, Aceh Tamiang)"
          value={formData.tags}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
        />

        {/* Tag Badges Preview */}
        {formData.tags && (
          <div className="flex flex-wrap gap-1 pt-1">
            {formData.tags.split(',').map((t, idx) => {
              const tagText = t.trim();
              if (!tagText) return null;
              return (
                <span
                  key={idx}
                  className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200/60"
                >
                  #{tagText}
                </span>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
