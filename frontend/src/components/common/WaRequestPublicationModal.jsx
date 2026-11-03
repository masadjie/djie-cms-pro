import React, { useState } from 'react';
import { 
  X, 
  Send, 
  FileText, 
  User, 
  Building2, 
  Link2, 
  MessageSquare, 
  Sparkles,
  PhoneCall,
  CheckCircle2,
  Share2
} from 'lucide-react';

export default function WaRequestPublicationModal({ isOpen, onClose, destinationPhone }) {
  const [formData, setFormData] = useState({
    nama: '',
    instansi: '',
    kontakWa: '',
    jenis: 'Berita & Siaran Pers OPD',
    judul: '',
    tautanBahan: '',
    catatan: ''
  });

  if (!isOpen) return null;

  // Format destination phone for wa.me
  const cleanPhone = (phone) => {
    let clean = String(phone || '').replace(/[^0-9]/g, '');
    if (clean.startsWith('0')) {
      clean = '62' + clean.slice(1);
    }
    return clean || '6281168814767';
  };

  const jenisOptions = [
    { value: 'Berita & Siaran Pers OPD', label: 'Warta / Berita Kedinasan OPD' },
    { value: 'Artikel Opini ASN', label: 'Artikel Opini & Gagasan ASN' },
    { value: 'Medsos ASN Aceh Tamiang', label: 'Sorotan / Medsos ASN (Reels / YT / TikTok)' },
    { value: 'Pengumuman / Edaran Resmi', label: 'Pengumuman / Surat Edaran Resmi' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    const targetPhone = cleanPhone(destinationPhone);

    // Format neat opening message
    const lines = [
      `*Yth. Tim Redaksi & Publikasi BKPSDM Aceh Tamiang*`,
      ``,
      `Assalamualaikum Wr. Wb. / Salam Sejahtera,`,
      `Saya ingin mengajukan *Request Penerbitan Konten* pada Portal BKPSDM Kab. Aceh Tamiang dengan rincian berikut:`,
      ``,
      `📋 *Rincian Permohonan:*`,
      `• *Nama Pemohon*: ${formData.nama || '-'}`,
      `• *Instansi / OPD / Unit Kerja*: ${formData.instansi || '-'}`,
      `• *No. WhatsApp Pemohon*: ${formData.kontakWa || '-'}`,
      `• *Kategori Konten*: ${formData.jenis}`,
      `• *Judul / Topik*: ${formData.judul || '-'}`,
      formData.tautanBahan ? `• *Link Bahan / Draft / Lampiran*: ${formData.tautanBahan}` : null,
      formData.catatan ? `• *Catatan Tambahan*: ${formData.catatan}` : null,
      ``,
      `Mohon kiranya dapat ditinjau dan diterbitkan pada Portal Resmi / Media ASN Aceh Tamiang. Atas perhatian dan kerjasamanya, saya ucapkan terima kasih.`
    ].filter(Boolean).join('\n');

    const waUrl = `https://wa.me/${targetPhone}?text=${encodeURIComponent(lines)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-7 shadow-2xl border border-slate-100 my-auto animate-in zoom-in-95 duration-200 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Badge */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/25 flex-shrink-0">
              {/* WhatsApp custom SVG Icon */}
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-5.805 1.554zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
            </div>
            <div>
              <span className="inline-block text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 mb-0.5">
                Layanan Publikasi Cepat
              </span>
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base leading-tight">
                Request Penerbitan Berita/Artikel/Medsos ASN Aceh Tamiang
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors ml-2 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          <p className="text-xs text-slate-500 leading-relaxed">
            Isi formulir ringkas di bawah ini untuk menghasilkan pesan pembuka resmi yang akan langsung dikirimkan ke WhatsApp Tim Redaksi.
          </p>

          {/* Nama & Instansi */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nama Pemohon <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Fajar, S.STP"
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Instansi / OPD / Unit <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Bagian Organisasi / Puskesmas"
                  value={formData.instansi}
                  onChange={(e) => setFormData({ ...formData, instansi: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Kategori & No HP */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Jenis / Kategori Publikasi <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.jenis}
                onChange={(e) => setFormData({ ...formData, jenis: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 font-medium bg-white"
              >
                {jenisOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                No. WhatsApp Pemohon
              </label>
              <div className="relative">
                <PhoneCall className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="0812xxxxxxx"
                  value={formData.kontakWa}
                  onChange={(e) => setFormData({ ...formData, kontakWa: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Judul Konten */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Judul / Topik Berita / Konten <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                placeholder="e.g. Sosialisasi Aplikasi SiKEPO dan Pelayanan Prima ASN di Kecamatan Rantau"
                value={formData.judul}
                onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 font-medium"
              />
            </div>
          </div>

          {/* Link Berkas / Google Drive / URL Sosmed */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Link Berkas / Naskah / Google Drive / URL Sosmed
            </label>
            <div className="relative">
              <Link2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="url"
                placeholder="https://drive.google.com/... atau https://instagram.com/reel/..."
                value={formData.tautanBahan}
                onChange={(e) => setFormData({ ...formData, tautanBahan: e.target.value })}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 font-mono text-[11px]"
              />
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">
              Bisa berisi link Google Docs naskah, link folder foto kegiatan, atau link video Instagram/TikTok/YouTube.
            </span>
          </div>

          {/* Catatan Singkat */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Catatan / Pesan Tambahan (Opsional)
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Mohon ditayangkan hari ini atau lampirkan foto terlampir di Google Drive..."
              value={formData.catatan}
              onChange={(e) => setFormData({ ...formData, catatan: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 font-medium"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/20 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Buka Pesan di WhatsApp</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
