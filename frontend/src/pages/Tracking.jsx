import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { Search, CheckCircle2, Clock, AlertCircle, FileSearch, Printer, Download, QrCode } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

const statusStepOrder = [
  'DIAJUKAN',
  'VERIFIKASI_BERKAS',
  'DIPROSES_OPD',
  'SELESAI'
];

export default function Tracking() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTiket = searchParams.get('tiket') || '';
  
  const [nomorTiket, setNomorTiket] = useState(initialTiket);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleTrack = async (e) => {
    if (e) e.preventDefault();
    if (!nomorTiket.trim()) return;

    setLoading(true);
    setErrorMsg('');
    setResult(null);

    try {
      const res = await api.get(`/permohonan/track/${encodeURIComponent(nomorTiket.trim())}`);
      if (res.success && res.data) {
        setResult(res.data);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Nomor tiket tidak ditemukan dalam sistem.');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (initialTiket) {
      handleTrack();
    }
  }, [initialTiket]);

  const handlePrintReceipt = () => {
    window.print();
  };

  const validationUrl = result?.nomor_tiket
    ? `https://bkpsdm.acehtamiangkab.go.id/tracking?tiket=${encodeURIComponent(result.nomor_tiket)}`
    : 'https://bkpsdm.acehtamiangkab.go.id';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      
      {/* Header Info */}
      <div className="text-center space-y-2 print:hidden">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200">
          <FileSearch className="w-4 h-4 text-emerald-700" />
          <span>Pelacakan Berkas Terpadu BKPSDM</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Lacak Status Permohonan
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm max-w-lg mx-auto">
          Pantau posisi dokumen dan cetak bukti tanda terima resmi yang tervalidasi secara digital.
        </p>
      </div>

      {/* Pill Search Input */}
      <form onSubmit={handleTrack} className="max-w-xl mx-auto print:hidden">
        <div className="bg-white border-2 border-slate-200 focus-within:border-emerald-600 shadow-sm rounded-full p-2 flex items-center gap-2 transition-all">
          <Search className="w-5 h-5 text-emerald-600 ml-3" />
          <input
            type="text"
            value={nomorTiket}
            onChange={(e) => setNomorTiket(e.target.value)}
            placeholder="Contoh: TMG-20260930-1234"
            className="w-full px-2 py-2 text-sm text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none font-mono font-bold"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white font-black rounded-full transition-all shadow-sm text-xs shrink-0 cursor-pointer"
          >
            {loading ? 'Mencari...' : 'Lacak Tiket'}
          </button>
        </div>
      </form>

      {errorMsg && (
        <div className="max-w-xl mx-auto p-4 rounded-2xl bg-red-50 border border-red-200 flex items-center gap-3 text-red-700 text-xs print:hidden">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Result Card & Printable Receipt */}
      {result && (
        <div className="space-y-6">
          
          {/* Action Bar for Printing */}
          <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 p-4 rounded-2xl print:hidden">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>Nomor Tiket valid dan terdaftar di database resmi.</span>
            </div>
            <button
              type="button"
              onClick={handlePrintReceipt}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-black shadow transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4 text-amber-300" />
              <span>Cetak Bukti Tanda Terima</span>
            </button>
          </div>

          {/* Printable Document Box */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-md space-y-8 print:border-none print:shadow-none print:p-0">
            
            {/* Kop Surat Resmi (Terlihat saat print) */}
            <div className="hidden print:flex items-center gap-4 border-b-2 border-slate-900 pb-4 mb-6">
              <img src="/logo-tamiang.png" alt="Logo" className="w-16 h-16 object-contain" />
              <div className="flex-1 text-center">
                <h3 className="text-sm font-bold uppercase tracking-wider">Pemerintah Kabupaten Aceh Tamiang</h3>
                <h2 className="text-base font-black uppercase tracking-tight">Badan Kepegawaian dan Pengembangan SDM</h2>
                <p className="text-[10px] text-slate-600">Jl. Ir. H. Juanda No. 1, Komplek Perkantoran Pemkab Aceh Tamiang, Karang Baru</p>
                <p className="text-[10px] text-slate-600">Website: bkpsdm.acehtamiangkab.go.id • Call Center: 081168814767</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">Nomor Tiket Registrasi</span>
                <h2 className="text-2xl font-mono font-black text-emerald-800">{result.nomor_tiket}</h2>
                <span className="text-xs text-slate-500 font-medium">
                  Tanggal Pengajuan: {result.created_at ? new Date(result.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                </span>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">Status Berkas</span>
                <span className="inline-block px-4 py-1.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-900 border border-emerald-300 mt-1">
                  {result.status}
                </span>
              </div>
            </div>

            {/* Stepper Timeline */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 print:grid-cols-4">
              {[
                { key: 'DIAJUKAN', label: '1. Diajukan' },
                { key: 'VERIFIKASI_BERKAS', label: '2. Verifikasi' },
                { key: 'DIPROSES_OPD', label: '3. Diproses Dinas' },
                { key: 'SELESAI', label: '4. Selesai' }
              ].map((step, idx) => {
                const currentIdx = statusStepOrder.indexOf(result.status);
                const stepIdx = statusStepOrder.indexOf(step.key);
                const isPast = stepIdx <= currentIdx;

                return (
                  <div
                    key={step.key}
                    className={`p-4 rounded-2xl border text-center space-y-2 ${
                      isPast
                        ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950 font-bold shadow-2xs'
                        : 'bg-slate-50 border-slate-200 text-slate-400 font-medium'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full mx-auto flex items-center justify-center text-[11px] font-black ${
                        isPast ? 'bg-emerald-800 text-white' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {isPast ? '✓' : idx + 1}
                    </div>
                    <p className="text-xs">{step.label}</p>
                  </div>
                );
              })}
            </div>

            {/* Details & QR Code Validation */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-200/80">
              <div className="md:col-span-8 space-y-4">
                <div className="space-y-1 text-xs">
                  <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider">Layanan Yang Dimohon:</span>
                  <p className="font-black text-slate-900 text-base">{result.layanan?.nama_layanan || 'Layanan Kepegawaian'}</p>
                  <p className="text-slate-600 font-medium">{result.layanan?.opd?.nama_opd || 'BKPSDM Kabupaten Aceh Tamiang'}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-200 text-xs">
                  <div>
                    <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider">Nama Pemohon:</span>
                    <p className="font-extrabold text-slate-900">{result.nama_pemohon || '-'}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider">NIK / NIP:</span>
                    <p className="font-extrabold text-slate-900 font-mono">{result.nik_pemohon || '-'}</p>
                  </div>
                </div>

                {result.catatan_petugas && (
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
                    <span className="font-bold block">Catatan Verifikator:</span>
                    <span>{result.catatan_petugas}</span>
                  </div>
                )}
              </div>

              {/* QR Code Validation */}
              <div className="md:col-span-4 flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-slate-200 text-center space-y-2">
                <div className="p-2 bg-white rounded-xl border border-slate-100 shadow-2xs">
                  <QRCodeSVG value={validationUrl} size={110} level="M" />
                </div>
                <span className="text-[10px] font-black uppercase text-slate-700 tracking-wider">
                  Scan Validasi Keaslian
                </span>
                <span className="text-[9px] text-slate-400 font-mono">
                  Sistem Informasi BKPSDM
                </span>
              </div>
            </div>

            {/* Print Sign Box */}
            <div className="hidden print:grid grid-cols-2 gap-8 pt-8 text-xs text-center">
              <div>
                <p className="text-slate-500">Pemohon Layanan,</p>
                <div className="h-16" />
                <p className="font-bold underline">{result.nama_pemohon}</p>
              </div>
              <div>
                <p className="text-slate-500">Aceh Tamiang, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                <p className="text-slate-500">Petugas Pelayanan BKPSDM,</p>
                <div className="h-16" />
                <p className="font-bold underline">Tim Helpdesk Terpadu</p>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
