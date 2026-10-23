import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import { 
  MessageSquare, 
  Send, 
  User, 
  Mail, 
  Building, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ShieldCheck,
  Sparkles,
  Lock,
  ThumbsUp,
  Info
} from 'lucide-react';

export default function BeritaKomentarSection({ slug, articleTitle }) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    nama_pengirim: '',
    email_pengirim: '',
    instansi_pengirim: '',
    isi_komentar: '',
    website_hp: ''
  });
  const [formRenderedAt, setFormRenderedAt] = useState(() => Date.now());
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // 1. Fetch approved public comments
  const { data: commentsResponse, isLoading } = useQuery({
    queryKey: ['beritaKomentar', slug],
    queryFn: async () => {
      try {
        const res = await api.get(`/berita/${slug}/komentar`);
        return res?.data || [];
      } catch (e) {
        return [];
      }
    },
    enabled: !!slug
  });

  const comments = Array.isArray(commentsResponse) ? commentsResponse : [];

  // 2. Submit comment mutation
  const submitMutation = useMutation({
    mutationFn: async (payload) => {
      return await api.post(`/berita/${slug}/komentar`, payload);
    },
    onSuccess: () => {
      setSubmitSuccess(true);
      setSubmitError('');
      setFormData({
        nama_pengirim: '',
        email_pengirim: '',
        instansi_pengirim: '',
        isi_komentar: '',
        website_hp: ''
      });
      setFormRenderedAt(Date.now());
      queryClient.invalidateQueries({ queryKey: ['beritaKomentar', slug] });
    },
    onError: (err) => {
      const errMsg = err?.response?.data?.message || err?.message || 'Gagal mengirim komentar. Silakan coba beberapa saat lagi.';
      setSubmitError(errMsg);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess(false);

    if (!formData.nama_pengirim.trim() || !formData.email_pengirim.trim() || !formData.isi_komentar.trim()) {
      setSubmitError('Nama lengkap, email resmi, dan isi tanggapan wajib diisi.');
      return;
    }

    submitMutation.mutate({
      nama_pengirim: formData.nama_pengirim.trim(),
      email_pengirim: formData.email_pengirim.trim(),
      instansi_pengirim: formData.instansi_pengirim.trim() || null,
      isi_komentar: formData.isi_komentar.trim(),
      website_hp: formData.website_hp || '',
      form_rendered_at: formRenderedAt
    });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }) + ' WIB';
    } catch {
      return dateStr;
    }
  };

  return (
    <section className="pt-10 border-t border-slate-100 space-y-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-[11px] font-black uppercase tracking-wider">
            <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
            <span>Ruang Diskusi & Tanggapan</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Komentar & Aspirasi ({comments.length})
          </h3>
          <p className="text-xs text-slate-500 max-w-xl leading-relaxed">
            Sampaikan tanggapan atau pertanyaan resmi Anda terkait warta kepegawaian ini secara santun, akurat, dan konstruktif.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50/80 px-3.5 py-2 rounded-2xl border border-emerald-200/80 shrink-0 self-start sm:self-auto shadow-2xs">
          <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>Dimoderasi Oleh Admin BKPSDM</span>
        </div>
      </div>

      {/* Form Kirim Komentar - Clean Modern Card Layout */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-9 border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow duration-300">
        
        {/* Form Title & Policy Pill */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 mb-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-800 text-amber-300 flex items-center justify-center font-black text-base shadow-sm shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-black text-slate-900">
                Tulis Tanggapan Resmi
              </h4>
              <p className="text-xs text-slate-500">
                Komentar akan ditinjau & disetujui moderator BKPSDM sebelum dipublikasikan.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 self-start sm:self-auto">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>Email dirahasiakan & terlindungi</span>
          </div>
        </div>

        {/* Feedback Success / Error Banners */}
        {submitSuccess && (
          <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-3.5 mb-6 animate-in fade-in">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="text-xs space-y-1">
              <p className="font-bold text-sm">Terima kasih! Tanggapan Anda Berhasil Terkirim.</p>
              <p className="text-emerald-700 leading-relaxed">
                Pesan Anda telah masuk antrean moderasi dan akan tampil di halaman berita ini segera setelah diverifikasi oleh tim pengelola kepegawaian BKPSDM Aceh Tamiang.
              </p>
            </div>
          </div>
        )}

        {submitError && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start gap-3 mb-6">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="text-xs">
              <p className="font-bold">Gagal Mengirim Komentar</p>
              <p className="text-rose-700">{submitError}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Honeypot Bot Trap (Invisible to humans, bots will fill it) */}
          <div hidden aria-hidden="true" inert="" style={{ display: 'none', position: 'absolute', left: '-9999px', opacity: 0, height: 0, width: 0, pointerEvents: 'none' }}>
            <input
              type="text"
              name="website_hp"
              tabIndex={-1}
              autoComplete="off"
              value={formData.website_hp || ''}
              onChange={(e) => setFormData({ ...formData, website_hp: e.target.value })}
            />
          </div>

          {/* 3-Column Inputs: Nama, Email, Instansi */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Field 1: Nama Lengkap */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Nama Lengkap <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="Nama sesuai identitas"
                  value={formData.nama_pengirim}
                  onChange={(e) => setFormData({ ...formData, nama_pengirim: e.target.value })}
                  className="w-full pl-10 pr-3.5 py-3 bg-slate-50/70 border border-slate-200 rounded-2xl text-xs sm:text-[13px] text-slate-800 placeholder-slate-400 focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 outline-none transition-all"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              </div>
            </div>

            {/* Field 2: Email */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Alamat Email <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="nama@email.com"
                  value={formData.email_pengirim}
                  onChange={(e) => setFormData({ ...formData, email_pengirim: e.target.value })}
                  className="w-full pl-10 pr-3.5 py-3 bg-slate-50/70 border border-slate-200 rounded-2xl text-xs sm:text-[13px] text-slate-800 placeholder-slate-400 focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 outline-none transition-all"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              </div>
            </div>

            {/* Field 3: Instansi */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700">
                  Instansi / Unit Kerja
                </label>
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Opsional</span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Contoh: Dinas Pendidikan / Setdakab"
                  value={formData.instansi_pengirim}
                  onChange={(e) => setFormData({ ...formData, instansi_pengirim: e.target.value })}
                  className="w-full pl-10 pr-3.5 py-3 bg-slate-50/70 border border-slate-200 rounded-2xl text-xs sm:text-[13px] text-slate-800 placeholder-slate-400 focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 outline-none transition-all"
                />
                <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              </div>
            </div>

          </div>

          {/* Field 4: Isi Komentar */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">
              Isi Tanggapan / Masukan <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              placeholder="Tuliskan pertanyaan, masukan, atau tanggapan Anda secara jelas dan santun..."
              value={formData.isi_komentar}
              onChange={(e) => setFormData({ ...formData, isi_komentar: e.target.value })}
              className="w-full p-4 bg-slate-50/70 border border-slate-200 rounded-2xl text-xs sm:text-[13px] text-slate-800 placeholder-slate-400 focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 outline-none transition-all resize-none leading-relaxed"
            />
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-400 pt-1 gap-2">
              <span className="flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Gunakan bahasa yang sopan. Komentar yang mengandung SARA/ujaran kebencian akan ditolak.</span>
              </span>
              <span className="font-mono text-slate-500 font-medium shrink-0 self-end sm:self-auto">
                {formData.isi_komentar.length}/1500 Karakter
              </span>
            </div>
          </div>

          {/* Form Actions Footer */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-100">
            <div className="text-[11px] text-slate-400">
              Tanda (<span className="text-rose-500 font-bold">*</span>) menunjukkan kolom wajib diisi.
            </div>

            <button
              type="submit"
              disabled={submitMutation.isPending}
              className="inline-flex items-center justify-center gap-2 px-7 py-3 bg-emerald-800 hover:bg-emerald-700 active:scale-95 disabled:opacity-60 text-white rounded-2xl text-xs font-black transition-all shadow-md shadow-emerald-900/10 cursor-pointer"
            >
              {submitMutation.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Mengirim Tanggapan...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5 text-amber-300" />
                  <span>Kirim Tanggapan</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* List Komentar yang Sudah Disetujui (Approved) */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-black text-slate-800">
            Tanggapan Masyarakat & Aparatur ({comments.length})
          </h4>
          {comments.length > 0 && (
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Terverifikasi Moderasi
            </span>
          )}
        </div>

        {isLoading ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-100 shadow-2xs">
            <div className="w-7 h-7 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-500">Memuat tanggapan masyarakat...</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="p-10 sm:p-12 text-center bg-white rounded-3xl border border-slate-100/90 shadow-2xs space-y-2.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto border border-emerald-100">
              <MessageSquare className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-800">Belum Ada Tanggapan Terpublikasi</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
              Jadilah yang pertama memberikan masukan atau pertanyaan resmi terkait artikel berita ini.
            </p>
          </div>
        ) : (
          <div className="space-y-3.5">
            {comments.map((komentar) => (
              <div 
                key={komentar.id}
                className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-100/90 shadow-2xs hover:border-emerald-200 transition-all space-y-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-emerald-700 to-teal-800 text-amber-300 font-black text-xs flex items-center justify-center shadow-xs shrink-0">
                      {komentar.nama_pengirim.slice(0, 1).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs sm:text-sm font-black text-slate-900 truncate">
                          {komentar.nama_pengirim}
                        </span>
                        {komentar.instansi_pengirim && (
                          <span className="text-[10px] bg-slate-100 text-slate-700 font-semibold px-2.5 py-0.5 rounded-full border border-slate-200">
                            {komentar.instansi_pengirim}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 shrink-0 font-medium">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{formatDate(komentar.created_at)}</span>
                  </div>
                </div>

                <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed pl-12 whitespace-pre-line">
                  {komentar.isi_komentar}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
