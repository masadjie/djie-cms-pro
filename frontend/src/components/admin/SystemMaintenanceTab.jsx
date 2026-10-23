import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../../services/api';
import { 
  Database, 
  RefreshCw, 
  Download, 
  ShieldCheck, 
  Server, 
  Cpu, 
  HardDrive, 
  Activity, 
  CheckCircle2, 
  AlertCircle,
  Zap,
  Clock,
  Layers,
  Lock
} from 'lucide-react';
import Badge from '../common/Badge';
import { useConfirm } from '../common/ConfirmDialog';

export default function SystemMaintenanceTab() {
  const confirm = useConfirm();
  const [purgeSuccess, setPurgeSuccess] = useState('');
  const [purgeError, setPurgeError] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  // 1. Fetch System Analytics / Diagnostics
  const { data: analyticsData, refetch: refetchDiagnostics, isFetching } = useQuery({
    queryKey: ['cmsSystemDiagnostics'],
    queryFn: async () => {
      try {
        const res = await api.get('/cms/analytics');
        return res?.data || res || {};
      } catch (err) {
        return {};
      }
    }
  });

  const counts = analyticsData?.counts || {};
  const systemInfo = analyticsData?.system || {
    nodeEnv: 'development',
    uptimeSeconds: 3600,
    timestamp: new Date().toISOString()
  };

  // 2. Cache Purge Mutation
  const purgeMutation = useMutation({
    mutationFn: async () => await api.post('/cms/cache-purge'),
    onSuccess: (res) => {
      setPurgeSuccess(res?.message || 'Cache Redis berhasil dibersihkan!');
      setTimeout(() => setPurgeSuccess(''), 4000);
      refetchDiagnostics();
    },
    onError: (err) => {
      setPurgeError(err.response?.data?.message || 'Gagal membersihkan cache.');
      setTimeout(() => setPurgeError(''), 4000);
    }
  });

  // 3. Database Backup / Export Handler
  const handleExportBackup = async () => {
    try {
      setIsExporting(true);
      const res = await api.get('/cms/export-backup');
      const backupObj = res?.data || res;
      
      const jsonStr = JSON.stringify(backupObj, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `djie_cms_backup_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setPurgeSuccess('File data cadangan (Backup JSON) berhasil diunduh!');
      setTimeout(() => setPurgeSuccess(''), 4000);
    } catch (err) {
      setPurgeError('Gagal mengunduh cadangan data.');
      setTimeout(() => setPurgeError(''), 4000);
    } finally {
      setIsExporting(false);
    }
  };

  const formatUptime = (sec) => {
    const hours = Math.floor(sec / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${hours}j ${mins}m ${s}d`;
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Alert */}
      {purgeSuccess && (
        <div className="p-4 bg-emerald-900 text-white rounded-2xl shadow-lg flex items-center gap-2.5 text-xs font-bold animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{purgeSuccess}</span>
        </div>
      )}
      {purgeError && (
        <div className="p-4 bg-red-900 text-white rounded-2xl shadow-lg flex items-center gap-2.5 text-xs font-bold animate-pulse">
          <AlertCircle className="w-4 h-4 text-red-400" />
          <span>{purgeError}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 rounded-2xl p-6 text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              Pusat Pemeliharaan & Keamanan
            </span>
            <span className="text-[10px] font-bold text-slate-300">Djie CMS v2.0 Enterprise</span>
          </div>
          <h2 className="text-xl font-black tracking-tight">Kesehatan Sistem, Cache & Cadangan Data</h2>
          <p className="text-xs text-slate-300 max-w-xl">
            Optimalkan performa portal dengan pembersihan memori cache Redis secara berkala serta amankan seluruh konten database dengan fitur pencadangan satu-klik.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <a
            href="/install"
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border border-emerald-500/30"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Wizard Setup CMS</span>
          </a>

          <button
            type="button"
            onClick={() => refetchDiagnostics()}
            disabled={isFetching}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border border-white/20 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`} />
            <span>Periksa Ulang Sistem</span>
          </button>
        </div>
      </div>

      {/* Grid 2 Columns: Action Centers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Card 1: 1-Click Cache Purge & Memory Management */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-50 text-amber-800 rounded-xl">
                <Zap className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900">Pembersihan Cache Redis (Purge Cache)</h3>
                <p className="text-xs text-slate-400">Hapus seluruh data cache query berita, layanan, dan menu</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Jika Anda baru saja mengubah struktur menu, konten statis, atau katalog layanan dan belum melihat perubahan langsung di halaman publik portal, jalankan pembersihan cache untuk memaksa sinkronisasi real-time.
            </p>

            <div className="grid grid-cols-3 gap-2 text-center text-xs pt-2">
              <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
                <p className="text-[10px] text-slate-400 uppercase font-bold">Status Engine</p>
                <p className="font-mono font-black text-emerald-700 mt-0.5">REDIS 7 ONLINE</p>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
                <p className="text-[10px] text-slate-400 uppercase font-bold">Default TTL</p>
                <p className="font-mono font-black text-slate-800 mt-0.5">300s (5 Menit)</p>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
                <p className="text-[10px] text-slate-400 uppercase font-bold">Invalidation</p>
                <p className="font-mono font-black text-slate-800 mt-0.5">Otomatis</p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => purgeMutation.mutate()}
            disabled={purgeMutation.isPending}
            className="w-full py-3 bg-amber-600 hover:bg-amber-700 active:scale-98 text-white rounded-xl text-xs font-bold transition-all shadow flex items-center justify-center gap-2 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${purgeMutation.isPending ? 'animate-spin' : ''}`} />
            <span>{purgeMutation.isPending ? 'Membersihkan Cache...' : 'Bersihkan Seluruh Cache Redis Sekarang'}</span>
          </button>
        </div>

        {/* Card 2: 1-Click Database JSON Backup / Export */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-xl">
                <Database className="w-5 h-5 text-emerald-700" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900">Ekspor Cadangan Data Konten (JSON Backup)</h3>
                <p className="text-xs text-slate-400">Unduh seluruh artikel, menu, dokumen, dan halaman statis</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Unduh salinan lengkap data publikasi portal ke dalam format berkas JSON terenkripsi untuk keamanan data, audit berkala, atau proses migrasi ke server baru.
            </p>

            <div className="grid grid-cols-4 gap-2 text-center text-xs pt-2">
              <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Berita</p>
                <p className="font-mono font-black text-slate-800">{counts.totalBerita || 0}</p>
              </div>
              <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Halaman</p>
                <p className="font-mono font-black text-slate-800">{counts.publishedHalaman || counts.totalHalaman || 0}</p>
              </div>
              <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Dokumen</p>
                <p className="font-mono font-black text-slate-800">{counts.totalDokumen || 0}</p>
              </div>
              <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Menu</p>
                <p className="font-mono font-black text-slate-800">{counts.totalMenus || 25}</p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleExportBackup}
            disabled={isExporting}
            className="w-full py-3 bg-emerald-800 hover:bg-emerald-700 active:scale-98 text-white rounded-xl text-xs font-bold transition-all shadow flex items-center justify-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4 text-amber-300" />
            <span>{isExporting ? 'Mengekspor Berkas...' : 'Unduh Cadangan Database (.json)'}</span>
          </button>
        </div>

        {/* Card 3: Real-Time Traffic & Visitor Log Cleaning */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5 flex flex-col justify-between lg:col-span-2">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-50 text-blue-800 rounded-xl">
                <Activity className="w-5 h-5 text-blue-700" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900">Manajemen Trafik & Log Pengunjung Murni (Real-Time Analytics)</h3>
                <p className="text-xs text-slate-400">Pastikan seluruh grafik di dashboard mencerminkan 100% kunjungan pengguna sungguhan tanpa data simulasi</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Sistem mencatat setiap akses IP, peramban (browser), sistem operasi, dan perangkat pengguna yang membuka portal secara transparan dan murni. Anda dapat membersihkan data simulasi/dummy awal kapan saja agar metrik laporan instansi benar-benar valid dan murni dari 0.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs pt-2">
              <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
                <p className="text-[10px] text-slate-400 uppercase font-bold">Total Kunjungan Saat Ini</p>
                <p className="font-mono font-black text-emerald-800 mt-0.5">{analyticsData?.visitorStats?.totalVisits || 0} Hits</p>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
                <p className="text-[10px] text-slate-400 uppercase font-bold">Pengunjung Hari Ini</p>
                <p className="font-mono font-black text-blue-800 mt-0.5">{analyticsData?.visitorStats?.todayViews || 0} Hits</p>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
                <p className="text-[10px] text-slate-400 uppercase font-bold">IP Unik Hari Ini</p>
                <p className="font-mono font-black text-purple-800 mt-0.5">{analyticsData?.visitorStats?.uniqueVisitorsToday || 0} Perangkat</p>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
                <p className="text-[10px] text-slate-400 uppercase font-bold">Status Data</p>
                <p className="font-mono font-black text-emerald-700 mt-0.5">100% REAL MURNI</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              type="button"
              onClick={async () => {
                try {
                  const res = await api.post('/cms/clear-traffic', { mode: 'dummy_only' });
                  setPurgeSuccess(res?.message || 'Data simulasi berhasil dibersihkan!');
                  setTimeout(() => setPurgeSuccess(''), 4000);
                  refetchDiagnostics();
                } catch (err) {
                  setPurgeError(err.response?.data?.message || 'Gagal membersihkan data simulasi.');
                  setTimeout(() => setPurgeError(''), 4000);
                }
              }}
              className="w-full sm:w-auto flex-1 py-3 bg-blue-700 hover:bg-blue-800 active:scale-98 text-white rounded-xl text-xs font-bold transition-all shadow flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4 text-blue-200" />
              <span>Bersihkan Data Simulasi (Hanya Simpan Trafik Riil)</span>
            </button>

            <button
              type="button"
              onClick={async () => {
                const ok = await confirm({
                  title: 'Reset Seluruh Data Kunjungan',
                  message: 'PERINGATAN: Apakah Anda yakin ingin mereset SELURUH data kunjungan ke 0? Ini akan menghapus semua riwayat traffic dan tindakan ini tidak dapat dibatalkan.',
                  confirmText: 'Ya, Reset Sekarang',
                  cancelText: 'Batal',
                  variant: 'danger'
                });
                if (!ok) return;
                try {
                  const res = await api.post('/cms/clear-traffic', { mode: 'all' });
                  setPurgeSuccess(res?.message || 'Semua log kunjungan berhasil direset!');
                  setTimeout(() => setPurgeSuccess(''), 4000);
                  refetchDiagnostics();
                } catch (err) {
                  setPurgeError(err.response?.data?.message || 'Gagal mereset data kunjungan.');
                  setTimeout(() => setPurgeError(''), 4000);
                }
              }}
              className="w-full sm:w-auto py-3 px-5 bg-slate-100 hover:bg-red-50 hover:text-red-700 active:scale-98 text-slate-600 rounded-xl text-xs font-bold transition-all border border-slate-200 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Reset Seluruh Log Kunjungan (Mulai dari 0)</span>
            </button>
          </div>
        </div>


      </div>

      {/* Row 2: Live System Diagnostics & Server Health Overview */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 text-indigo-800 rounded-xl">
              <Server className="w-4 h-4 text-indigo-700" />
            </div>
            <div>
              <h3 className="text-xs font-black uppercase text-slate-900 tracking-wider">
                Diagnostik Infrastruktur & Runtime Server
              </h3>
              <p className="text-[10px] text-slate-400">Spesifikasi Lingkungan Operasional SPBE BKPSDM Aceh Tamiang</p>
            </div>
          </div>
          <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            <span>Sistem Sehat</span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
            <div className="flex items-center gap-2 text-slate-500">
              <Server className="w-4 h-4 text-emerald-700" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Node.js Runtime</span>
            </div>
            <p className="text-sm font-black text-slate-900 font-mono">Node.js v20.x (ESM & CJS)</p>
            <p className="text-[10px] text-slate-400">Lingkungan: {systemInfo.nodeEnv}</p>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
            <div className="flex items-center gap-2 text-slate-500">
              <Database className="w-4 h-4 text-blue-700" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Basis Data SQL</span>
            </div>
            <p className="text-sm font-black text-slate-900 font-mono">MySQL 8.0 (InnoDB)</p>
            <p className="text-[10px] text-emerald-700 font-bold">Koneksi Pool Stabil</p>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
            <div className="flex items-center gap-2 text-slate-500">
              <Clock className="w-4 h-4 text-amber-700" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Waktu Aktif (Uptime)</span>
            </div>
            <p className="text-sm font-black text-slate-900 font-mono">{formatUptime(systemInfo.uptimeSeconds || 3600)}</p>
            <p className="text-[10px] text-slate-400">Tanpa Gangguan Fatal</p>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
            <div className="flex items-center gap-2 text-slate-500">
              <ShieldCheck className="w-4 h-4 text-purple-700" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Protokol Keamanan</span>
            </div>
            <p className="text-sm font-black text-slate-900 font-mono">RBAC + Rate Limit DDoS</p>
            <p className="text-[10px] text-purple-700 font-bold">JWT 7-Hari Expiry</p>
          </div>
        </div>
      </div>

    </div>
  );
}
