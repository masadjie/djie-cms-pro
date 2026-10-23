import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Building2, 
  Clock, 
  CheckCircle, 
  FileCheck2, 
  ArrowLeft, 
  Send, 
  AlertCircle
} from 'lucide-react';

export default function DetailLayanan() {
  const { slug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nik_pemohon: user?.nik || '',
    nama_pemohon: user?.name || '',
    telepon_pemohon: user?.phone || '',
    alamat_pemohon: '',
    catatan_pemohon: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [successTiket, setSuccessTiket] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const { data: layanan, isLoading, error } = useQuery({
    queryKey: ['layananDetail', slug],
    queryFn: async () => (await api.get(`/layanan/${slug}`)).data
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');
    try {
      const res = await api.post('/permohonan', {
        ...formData,
        layanan_id: layanan.id
      });
      if (res.success && res.data) {
        setSuccessTiket(res.data.nomor_tiket);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Gagal mengirim permohonan. Cek kelengkapan data.');
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center text-slate-400">
        <div className="animate-spin w-8 h-8 border-4 border-tamiang-600 border-t-transparent rounded-full mx-auto mb-3"></div>
        <p className="text-xs font-semibold">Memuat rincian layanan...</p>
      </div>
    );
  }

  if (error || !layanan) {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 bg-white rounded-3xl border border-emerald-100 text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
        <h2 className="text-base font-bold text-slate-800">Layanan Tidak Ditemukan</h2>
        <Link to="/katalog" className="inline-flex items-center gap-2 text-xs text-tamiang-700 font-bold">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Katalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <Link
        to="/katalog"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-tamiang-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Kembali ke Katalog Layanan
      </Link>

      {/* Main Detail Header */}
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-emerald-100 shadow-2xs space-y-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 bg-tamiang-50 text-tamiang-800 border border-tamiang-200 rounded-full text-[10px] font-extrabold uppercase">
            {layanan.opd?.nama_opd}
          </span>
          <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-[10px] font-bold">
            {layanan.kategori?.nama_kategori}
          </span>
          <span className="px-3 py-1 bg-gold-100 text-gold-800 rounded-full text-[10px] font-bold">
            Tipe: {layanan.tipe_layanan}
          </span>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
            {layanan.nama_layanan}
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-4xl">
            {layanan.deskripsi}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-100">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 block uppercase">Biaya Retribusi</span>
            <span className="text-sm font-black text-slate-900">{layanan.biaya}</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 block uppercase">Estimasi Waktu</span>
            <span className="text-sm font-black text-slate-900">{layanan.estimasi_waktu}</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 block uppercase">Output Dokumen</span>
            <span className="text-sm font-black text-slate-900">{layanan.output_layanan || 'Dokumen Resmi'}</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 block uppercase">Kode Layanan</span>
            <span className="text-sm font-mono font-black text-tamiang-700">{layanan.kode_layanan}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Kolom Kiri: Persyaratan Berkas */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-2xs space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 font-extrabold text-slate-900 text-base">
              <FileCheck2 className="w-5 h-5 text-tamiang-600" />
              <span>Persyaratan Berkas Permohonan</span>
            </div>

            {layanan.syarat_dokumen && layanan.syarat_dokumen.length > 0 ? (
              <div className="space-y-3">
                {layanan.syarat_dokumen.map((s, index) => (
                  <div
                    key={s.id || index}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3.5"
                  >
                    <div className="w-6 h-6 rounded-full bg-tamiang-700 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-800">{s.nama_syarat}</span>
                        {s.is_mandatory && (
                          <span className="text-[9px] font-extrabold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                            Wajib
                          </span>
                        )}
                      </div>
                      {s.deskripsi && <p className="text-xs text-slate-500">{s.deskripsi}</p>}
                      <p className="text-[10px] text-slate-400">
                        Format: <span className="uppercase font-semibold">{s.tipe_file}</span> (Maks. {s.max_size_mb} MB)
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">Tidak ada berkas khusus yang diwajibkan.</p>
            )}
          </div>
        </div>

        {/* Kolom Kanan: Form Pengajuan & SiKEPO Shortcut */}
        <div className="space-y-6">
          {/* SiKEPO Direct Access Widget */}
          <div className="bg-gradient-to-br from-[#052e16] to-[#064e3b] text-white rounded-3xl p-6 border border-amber-400/40 shadow-md space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
              <span className="text-xs font-black text-amber-300 uppercase tracking-wider">Aplikasi SiKEPO Online</span>
            </div>
            <p className="text-xs text-emerald-100 leading-relaxed">
              Pegawai ASN dapat mengajukan dan memproses usulan ini secara instan langsung melalui portal <strong>SiKEPO Kab. Aceh Tamiang</strong>.
            </p>
            <a
              href="https://sikepo.acehtamiangkab.go.id"
              target="_blank"
              rel="noreferrer"
              className="block w-full py-2.5 text-center bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs transition-all shadow-sm"
            >
              Buka di SiKEPO Aceh Tamiang →
            </a>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-200 shadow-sm space-y-5">
            <h3 className="font-extrabold text-slate-900 text-base">
              Atau Ajukan Permohonan Internal
            </h3>

            {successTiket ? (
              <div className="p-6 rounded-2xl bg-tamiang-50 border border-tamiang-200 text-center space-y-3">
                <CheckCircle className="w-10 h-10 text-tamiang-600 mx-auto" />
                <h4 className="font-extrabold text-tamiang-900 text-sm">Permohonan Terkirim!</h4>
                <p className="text-[11px] text-tamiang-700">Simpan Nomor Tiket Anda:</p>
                <div className="p-3 bg-white rounded-xl border border-tamiang-300 font-mono font-black text-tamiang-800 text-sm">
                  {successTiket}
                </div>
                <Link
                  to={`/tracking?tiket=${successTiket}`}
                  className="block w-full py-3 bg-tamiang-700 hover:bg-tamiang-800 text-white rounded-full text-xs font-bold transition-colors"
                >
                  Lacak Permohonan
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5">
                {errorMessage && (
                  <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs">
                    {errorMessage}
                  </div>
                )}

                {!user && (
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 space-y-1">
                    <p>Silakan login dengan akun Anda untuk pengisian otomatis.</p>
                    <Link to="/login" className="font-bold text-emerald-800 underline block">
                      Masuk Akun →
                    </Link>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">NIK Pemohon</label>
                  <input
                    type="text"
                    required
                    maxLength={16}
                    value={formData.nik_pemohon}
                    onChange={(e) => setFormData({ ...formData, nik_pemohon: e.target.value })}
                    placeholder="16 Digit NIK KTP"
                    className="w-full text-xs px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-tamiang-500 focus:outline-none font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Nama Lengkap</label>
                  <input
                    type="text"
                    required
                    value={formData.nama_pemohon}
                    onChange={(e) => setFormData({ ...formData, nama_pemohon: e.target.value })}
                    placeholder="Sesuai KTP"
                    className="w-full text-xs px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-tamiang-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">No. WhatsApp / HP</label>
                  <input
                    type="tel"
                    required
                    value={formData.telepon_pemohon}
                    onChange={(e) => setFormData({ ...formData, telepon_pemohon: e.target.value })}
                    placeholder="08xxxxxxxxxx"
                    className="w-full text-xs px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-tamiang-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Alamat</label>
                  <textarea
                    rows={2}
                    value={formData.alamat_pemohon}
                    onChange={(e) => setFormData({ ...formData, alamat_pemohon: e.target.value })}
                    placeholder="Desa/Kampung, Kecamatan..."
                    className="w-full text-xs px-3.5 py-2 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-tamiang-500 focus:outline-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 bg-tamiang-700 hover:bg-tamiang-800 disabled:opacity-50 text-white font-extrabold rounded-full text-xs shadow-sm transition-all flex items-center justify-center gap-2 mt-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  {submitting ? 'Mengirim...' : 'Kirim Berkas Permohonan'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
