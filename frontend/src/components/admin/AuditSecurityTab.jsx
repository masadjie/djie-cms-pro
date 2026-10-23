import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Activity, 
  Terminal, 
  AlertTriangle, 
  RefreshCw, 
  Search, 
  CheckCircle2, 
  Server, 
  Eye, 
  Filter,
  Flame,
  Clock,
  User,
  Radio,
  FileCode2,
  Lock,
  Layers
} from 'lucide-react';
import api from '../../services/api';
import DataTable from '../common/DataTable';
import Badge from '../common/Badge';

const AuditSecurityTab = () => {
  const [subTab, setSubTab] = useState('threats'); // 'threats' | 'spbe_audit' | 'docker_logs'
  
  // Docker Log States
  const [selectedContainer, setSelectedContainer] = useState('tamiang_frontend');
  const [logLinesCount, setLogLinesCount] = useState(50);
  const [dockerLogFilter, setDockerLogFilter] = useState('');
  const [onlySuspicious, setOnlySuspicious] = useState(false);

  // SPBE Audit Log States
  const [auditPage, setAuditPage] = useState(1);
  const [auditLimit, setAuditLimit] = useState(15);
  const [auditSearch, setAuditSearch] = useState('');
  const [auditModule, setAuditModule] = useState('');

  // 1. Fetch Audit Logs & Security Threats from DB
  const { 
    data: auditData, 
    isLoading: isAuditLoading, 
    refetch: refetchAudit 
  } = useQuery({
    queryKey: ['adminAuditLogsList', auditPage, auditLimit, auditSearch, auditModule],
    queryFn: async () => {
      try {
        const params = new URLSearchParams({
          page: String(auditPage),
          limit: String(auditLimit)
        });
        if (auditSearch) params.append('search', auditSearch);
        if (auditModule) params.append('module', auditModule);

        const res = await api.get(`/master/audit-logs?${params.toString()}`);
        return res || { data: [], securitySummary: { totalSecurityAlerts: 0, recentThreats: [] }, meta: { total: 0 } };
      } catch (err) {
        return { data: [], securitySummary: { totalSecurityAlerts: 0, recentThreats: [] }, meta: { total: 0 } };
      }
    },
    refetchInterval: 15000 // Polling 15 seconds for live security status
  });

  // 2. Fetch Docker Live Logs & Threat Analysis
  const { 
    data: dockerLogsData, 
    isLoading: isDockerLoading, 
    isFetching: isDockerFetching, 
    refetch: refetchDockerLogs 
  } = useQuery({
    queryKey: ['dockerContainerLogs', selectedContainer, logLinesCount],
    queryFn: async () => {
      try {
        const res = await api.get(`/master/docker-logs?container=${selectedContainer}&lines=${logLinesCount}`);
        return res || { success: false, data: [], threatCount: 0, threatAlertLevel: 'SECURE' };
      } catch (err) {
        return { 
          success: false, 
          data: [], 
          threatCount: 0, 
          threatAlertLevel: 'UNKNOWN',
          error: err?.response?.data?.message || err.message 
        };
      }
    },
    refetchInterval: subTab === 'docker_logs' ? 10000 : false // Auto refresh every 10s if on docker tab
  });

  const securitySummary = auditData?.securitySummary || { totalSecurityAlerts: 0, recentThreats: [] };
  const rawAuditLogs = auditData?.data || [];
  const totalAuditLogs = auditData?.meta?.total || 0;

  // Filter threats vs normal audits
  const blockedThreats = rawAuditLogs.filter(item => item.module === 'SECURITY_ALERT');
  const normalAudits = rawAuditLogs.filter(item => item.module !== 'SECURITY_ALERT');

  // Filter docker logs based on search & suspicious toggle
  const filteredDockerLogs = (dockerLogsData?.data || []).filter(log => {
    if (onlySuspicious && !log.isSuspicious) return false;
    if (dockerLogFilter) {
      const q = dockerLogFilter.toLowerCase();
      return (
        (log.raw && log.raw.toLowerCase().includes(q)) ||
        (log.threat && log.threat.toLowerCase().includes(q)) ||
        (log.ip && log.ip.includes(q))
      );
    }
    return true;
  });

  // Columns for WAF Blocked Threats
  const threatColumns = [
    {
      header: 'No',
      width: '60px',
      align: 'center',
      render: (_, index) => <span className="font-mono text-slate-400 font-bold">#{index}</span>
    },
    {
      header: 'Waktu Terdeteksi',
      width: '180px',
      render: (item) => {
        const dateVal = item.created_at || item.createdAt;
        return (
          <div className="flex items-center gap-1.5 font-mono text-xs text-slate-600">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{dateVal ? new Date(dateVal).toLocaleString('id-ID') : '-'}</span>
          </div>
        );
      }
    },
    {
      header: 'Tipe Serangan & Status',
      render: (item) => {
        let details = null;
        try {
          details = typeof item.details === 'string' ? JSON.parse(item.details) : (item.details || item.new_values);
        } catch {
          details = item.details || item.new_values;
        }

        return (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-black uppercase tracking-wider bg-red-100 text-red-800 border border-red-200">
                {item.action || 'THREAT_BLOCKED'}
              </span>
              <Badge variant="emerald" size="sm">BLOCKED BY WAF</Badge>
            </div>
            <p className="text-xs font-semibold text-slate-700">{details?.message || item.description || 'Percobaan serangan terdeteksi dan diblokir.'}</p>
          </div>
        );
      }
    },
    {
      header: 'IP Penyerang & Rincian',
      render: (item) => {
        let details = null;
        try {
          details = typeof item.details === 'string' ? JSON.parse(item.details) : (item.details || item.new_values);
        } catch {
          details = item.details || item.new_values;
        }

        return (
          <div className="space-y-0.5 font-mono text-[11px]">
            <div className="flex items-center gap-1.5 text-red-700 font-bold">
              <span>IP:</span>
              <span className="bg-red-50 px-1.5 py-0.2 rounded border border-red-100">{item.ip_address || details?.ip || 'Unknown'}</span>
            </div>
            {details?.method && (
              <span className="text-slate-500">Method: <strong className="text-slate-800">{details.method}</strong></span>
            )}
            {details?.path && (
              <p className="text-slate-500 truncate max-w-xs" title={details.path}>URL: {details.path}</p>
            )}
            {item.user_agent && (
              <p className="text-slate-400 text-[10px] truncate max-w-xs" title={item.user_agent}>Agent: {item.user_agent}</p>
            )}
          </div>
        );
      }
    }
  ];

  // Columns for SPBE Admin Activity Logs
  const auditColumns = [
    {
      header: 'No',
      width: '60px',
      align: 'center',
      render: (_, index) => <span className="font-mono text-slate-400 font-bold">#{index}</span>
    },
    {
      header: 'Waktu Aktivitas',
      width: '180px',
      render: (item) => (
        <span className="font-mono text-slate-600 text-xs font-medium">
          {new Date(item.created_at).toLocaleString('id-ID')}
        </span>
      )
    },
    {
      header: 'Administrator / Aktor',
      render: (item) => (
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
            {item.user?.name ? item.user.name[0].toUpperCase() : 'A'}
          </div>
          <div>
            <span className="font-bold text-slate-900 block text-xs">{item.user?.name || 'Administrator'}</span>
            <span className="text-[11px] text-slate-400 font-mono">{item.user?.email || item.ip_address || '-'}</span>
          </div>
        </div>
      )
    },
    {
      header: 'Aksi (Action)',
      render: (item) => (
        <span className="px-2.5 py-0.5 bg-slate-100 text-slate-800 font-mono font-bold rounded text-[11px]">
          {item.action}
        </span>
      )
    },
    {
      header: 'Modul',
      render: (item) => (
        <Badge variant={item.module === 'AUTH' ? 'purple' : 'blue'} size="sm">
          {item.module || 'CMS'}
        </Badge>
      )
    },
    {
      header: 'Keterangan',
      render: (item) => (
        <span className="text-xs text-slate-600 line-clamp-1" title={item.description}>
          {item.description || '-'}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* 1. TOP OVERVIEW CARDS: STATUS KEAMANAN & ALERT */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Status Keamanan WAF */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
            securitySummary.totalSecurityAlerts > 0 ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
          }`}>
            {securitySummary.totalSecurityAlerts > 0 ? (
              <Flame className="w-6 h-6 animate-pulse" />
            ) : (
              <ShieldCheck className="w-6 h-6" />
            )}
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Perlindungan WAF & Firewall</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-2xl font-black text-slate-900">
                {securitySummary.totalSecurityAlerts}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                securitySummary.totalSecurityAlerts > 0 ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {securitySummary.totalSecurityAlerts > 0 ? 'Serangan Terblokir' : 'Sistem Aman'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">SQLi, XSS, & Path Traversal Guard aktif</p>
          </div>
        </div>

        {/* Card 2: Docker Container Threat Alert */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
            dockerLogsData?.threatAlertLevel === 'CRITICAL' ? 'bg-red-100 text-red-700' :
            dockerLogsData?.threatAlertLevel === 'HIGH' ? 'bg-amber-100 text-amber-700' :
            dockerLogsData?.threatAlertLevel === 'WARNING' ? 'bg-amber-50 text-amber-600' :
            'bg-emerald-50 text-emerald-600'
          }`}>
            <Server className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Container Docker Alert</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-2xl font-black text-slate-900">
                {dockerLogsData?.threatCount || 0}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                dockerLogsData?.threatAlertLevel === 'CRITICAL' ? 'bg-red-600 text-white animate-bounce' :
                dockerLogsData?.threatAlertLevel === 'HIGH' ? 'bg-amber-500 text-white' :
                dockerLogsData?.threatAlertLevel === 'WARNING' ? 'bg-amber-100 text-amber-800' :
                'bg-emerald-100 text-emerald-800'
              }`}>
                {dockerLogsData?.threatAlertLevel || 'SECURE'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Container: {selectedContainer}</p>
          </div>
        </div>

        {/* Card 3: SPBE Compliance Audit */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Audit Trail SPBE</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-2xl font-black text-slate-900">{totalAuditLogs}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
                Terverifikasi
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Sesuai Permen PAN-RB No 59/2020</p>
          </div>
        </div>
      </div>

      {/* 2. SUB-TAB NAVIGATION */}
      <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setSubTab('threats')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              subTab === 'threats'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Alert Serangan & WAF ({securitySummary.totalSecurityAlerts})</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('docker_logs')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              subTab === 'docker_logs'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>Live Docker & Nginx Logs</span>
            {dockerLogsData?.threatCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setSubTab('spbe_audit')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              subTab === 'spbe_audit'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Log Aktivitas Admin (SPBE)</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              refetchAudit();
              refetchDockerLogs();
            }}
            disabled={isAuditLoading || isDockerFetching}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isDockerFetching || isAuditLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* 3. SUBTAB CONTENT */}

      {/* SUBTAB 1: WAF SECURITY THREAT ALERTS */}
      {subTab === 'threats' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-red-600" />
                <span>Pusat Peringatan Serangan Siber (WAF Guard)</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Mencatat dan memblokir secara otomatis upaya SQL Injection, Cross-Site Scripting (XSS), Path Traversal, serta exploit probes.
              </p>
            </div>
            {securitySummary.totalSecurityAlerts > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs font-bold">
                <Flame className="w-4 h-4 text-red-600 animate-pulse" />
                <span>Terdeteksi {securitySummary.totalSecurityAlerts} Percobaan Serangan Dicegah</span>
              </div>
            )}
          </div>

          <DataTable
            columns={threatColumns}
            data={blockedThreats}
            isLoading={isAuditLoading}
            searchPlaceholder="Cari ancaman, IP penyerang, atau pola payload..."
            searchKeys={['action', 'description', 'ip_address']}
            defaultPageSize={10}
            emptyMessage="Belum ada percobaan serangan siber yang terdeteksi. Sistem berjalan aman dan terlindungi."
          />
        </div>
      )}

      {/* SUBTAB 2: LIVE DOCKER & NGINX LOGS */}
      {subTab === 'docker_logs' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Terminal className="w-5 h-5 text-slate-800" />
                <span>Live Container & Web Server Log Inspector</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Inspeksi log real-time dari container Docker (Nginx Frontend, Node.js API, DB, dsb.) dengan pendeteksi otomatis indikasi bot scanner atau exploit.
              </p>
            </div>

            {/* Container Selector & Tail Lines */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
                <Server className="w-3.5 h-3.5 text-slate-500" />
                <select
                  value={selectedContainer}
                  onChange={(e) => setSelectedContainer(e.target.value)}
                  className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
                >
                  <option value="tamiang_frontend">tamiang_frontend (Nginx Proxy)</option>
                  <option value="tamiang_backend">tamiang_backend (Express API)</option>
                  <option value="tamiang_mysql">tamiang_mysql (Database)</option>
                  <option value="tamiang_redis">tamiang_redis (Cache)</option>
                  <option value="tamiang_minio">tamiang_minio (Object Storage)</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
                <span className="text-[11px] font-bold text-slate-500">Baris:</span>
                <select
                  value={logLinesCount}
                  onChange={(e) => setLogLinesCount(Number(e.target.value))}
                  className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
                >
                  <option value={30}>30</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                  <option value={200}>200</option>
                </select>
              </div>

              <button
                type="button"
                onClick={() => setOnlySuspicious(!onlySuspicious)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer border ${
                  onlySuspicious
                    ? 'bg-amber-500 text-white border-amber-600'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Hanya Mencurigakan</span>
              </button>
            </div>
          </div>

          {/* Search inside log */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Cari kata kunci dalam log (IP, status code 403, exploit, curl, url...)"
              value={dockerLogFilter}
              onChange={(e) => setDockerLogFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-mono"
            />
          </div>

          {/* Terminal Log Console */}
          <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4 font-mono text-xs text-slate-300 overflow-hidden shadow-inner">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-[11px] text-slate-400">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="ml-2 font-bold text-slate-300">docker logs {selectedContainer}</span>
              </div>
              <div className="flex items-center gap-3">
                <span>{filteredDockerLogs.length} Baris Ditampilkan</span>
                {dockerLogsData?.threatCount > 0 && (
                  <span className="text-amber-400 font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    {dockerLogsData.threatCount} Indikasi Ancaman
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-1 max-h-[460px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
              {isDockerLoading ? (
                <div className="py-12 text-center text-slate-500 space-y-2">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto text-emerald-400" />
                  <p>Menghubungkan ke Docker Engine API...</p>
                </div>
              ) : filteredDockerLogs.length === 0 ? (
                <div className="py-12 text-center text-slate-500">
                  <p>Tidak ada baris log yang cocok dengan kriteria filter saat ini.</p>
                </div>
              ) : (
                filteredDockerLogs.map((log) => {
                  const isCritical = log.level === 'CRITICAL';
                  const isHigh = log.level === 'HIGH';
                  const isMedium = log.level === 'MEDIUM';

                  return (
                    <div
                      key={log.id}
                      className={`py-1 px-2 rounded font-mono text-[11px] leading-relaxed transition-colors flex items-start gap-2 ${
                        isCritical
                          ? 'bg-red-950/80 text-red-200 border-l-4 border-red-500 font-bold'
                          : isHigh
                            ? 'bg-amber-950/60 text-amber-200 border-l-4 border-amber-500'
                            : isMedium
                              ? 'bg-slate-900 text-slate-200 border-l-2 border-slate-600'
                              : 'hover:bg-slate-900/60 text-slate-300'
                      }`}
                    >
                      {log.threat && (
                        <span className={`shrink-0 px-1.5 py-0.2 rounded text-[9px] font-black uppercase tracking-wider ${
                          isCritical ? 'bg-red-600 text-white' :
                          isHigh ? 'bg-amber-500 text-slate-950' : 'bg-slate-700 text-slate-200'
                        }`}>
                          {log.threat}
                        </span>
                      )}

                      {log.ip && (
                        <span className="shrink-0 text-cyan-400 font-bold">[{log.ip}]</span>
                      )}

                      <span className="break-all">{log.raw}</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: SPBE ADMIN AUDIT TRAIL */}
      {subTab === 'spbe_audit' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-700" />
                <span>Audit Trail & Riwayat Operasional SPBE</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Pencatatan menyeluruh setiap perubahan artikel, halaman, menu, dokumen, dan perubahan hak akses admin.
              </p>
            </div>
          </div>

          <DataTable
            columns={auditColumns}
            data={normalAudits}
            isLoading={isAuditLoading}
            searchPlaceholder="Cari aksi, administrator, atau modul audit..."
            searchKeys={['action', 'module', 'user.name', 'user.email']}
            defaultPageSize={15}
            emptyMessage="Belum ada catatan audit trail operasional."
          />
        </div>
      )}
    </div>
  );
};

export default AuditSecurityTab;
