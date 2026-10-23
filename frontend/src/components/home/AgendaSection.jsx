import React, { useState, useEffect } from 'react';
import { Lottie } from 'lottie-react';
import sandyLoadingAnimation from '../../assets/lottie/sandy-loading.json';
import { Calendar, ChevronLeft, ChevronRight, ExternalLink, MapPin, Clock, Info, CheckCircle2 } from 'lucide-react';
import Badge from '../common/Badge';

export default function AgendaSection({ agendaData }) {
  // Normalize agenda items from API
  const rawList = Array.isArray(agendaData)
    ? agendaData
    : (Array.isArray(agendaData?.data) ? agendaData.data : []);

  // Filter and sort active agenda by start_time
  const sortedAgendas = [...rawList].sort(
    (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
  );

  // Selected Agenda state (defaults to first upcoming agenda)
  const [selectedAgendaId, setSelectedAgendaId] = useState(null);

  // Calendar month state
  const [currentDate, setCurrentDate] = useState(() => {
    if (sortedAgendas.length > 0 && sortedAgendas[0].start_time) {
      return new Date(sortedAgendas[0].start_time);
    }
    return new Date();
  });

  // Selected date on calendar (YYYY-MM-DD)
  const [selectedDateStr, setSelectedDateStr] = useState(() => {
    if (sortedAgendas.length > 0 && sortedAgendas[0].start_time) {
      return new Date(sortedAgendas[0].start_time).toISOString().slice(0, 10);
    }
    return new Date().toISOString().slice(0, 10);
  });

  // Active primary agenda: either explicitly selected or first from list
  const primaryAgenda = sortedAgendas.find(a => a.id === selectedAgendaId) 
    || sortedAgendas[0] 
    || {
      id: 'default',
      title: 'Belum Ada Agenda Terjadwal',
      kategori: 'Informasi Kegiatan',
      deskripsi: 'Jadwal bimbingan teknis, ujian dinas, dan seleksi CASN BKPSDM Kabupaten Aceh Tamiang akan segera diperbarui.',
      lokasi: 'Kantor BKPSDM Kab. Aceh Tamiang',
      tipe_pelaksanaan: 'OFFLINE',
      start_time: new Date().toISOString(),
      end_time: new Date().toISOString(),
      link_pendaftaran: ''
    };

  // Other side agendas (excluding current primary)
  const sideAgendas = sortedAgendas.filter(a => a.id !== primaryAgenda.id).slice(0, 4);

  // Dynamic countdown timer calculation
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: false });

  useEffect(() => {
    if (!primaryAgenda.start_time) return;

    const calculateTime = () => {
      const now = new Date().getTime();
      const target = new Date(primaryAgenda.start_time).getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds, isPast: false });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [primaryAgenda.start_time]);

  // Calendar Helpers
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Days in month
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sun, 1 = Mon ...
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Find agendas for the selected calendar day
  const agendasOnSelectedDate = sortedAgendas.filter(a => {
    if (!a.start_time) return false;
    const aDate = new Date(a.start_time).toISOString().slice(0, 10);
    return aDate === selectedDateStr;
  });

  // Check which days in current month have events
  const daysWithEvents = new Set(
    sortedAgendas.map(a => {
      const d = new Date(a.start_time);
      if (d.getFullYear() === year && d.getMonth() === month) {
        return d.getDate();
      }
      return null;
    }).filter(Boolean)
  );

  // Format date range nicely
  const formatDateRange = (start, end) => {
    if (!start) return '-';
    const s = new Date(start);
    const e = end ? new Date(end) : s;
    const sDate = s.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    const eDate = e.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

    if (sDate === eDate) return sDate;
    return `${s.getDate()} - ${eDate}`;
  };

  // Format time range
  const formatTimeRange = (start, end) => {
    if (!start) return '';
    const s = new Date(start).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    const e = end ? new Date(end).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '';
    return e ? `${s} - ${e} WIB` : `${s} WIB`;
  };

  return (
    <section className="w-full px-4 sm:px-6 lg:px-12 py-12 sm:py-16 bg-[#f8faf9]/80 border-t border-slate-100">
      <div className="max-w-7xl mx-auto space-y-8 sm:space-y-10">
        
        {/* Header Title (Clean without generic AI badge) */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              Agenda BKPSDM Aceh Tamiang
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl font-normal">
              Jadwal pelaksanaan ujian dinas, uji kompetensi, bimbingan teknis kepegawaian, dan seleksi CASN
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white text-emerald-800 border border-slate-200/90 text-xs font-bold shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {sortedAgendas.length} Agenda Terjadwal
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Card Utama Agenda & List (8 Cols) - Clean Bento White Card */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Primary Highlight Card */}
            {sortedAgendas.length === 0 ? (
              /* EMPTY STATE WITH SANDY LOADING LOTTIE ANIMATION */
              <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-sm relative overflow-hidden flex flex-col items-center justify-center text-center">
                <div className="w-48 sm:w-56 h-48 sm:h-56 -my-4">
                  <Lottie 
                    animationData={sandyLoadingAnimation} 
                    loop={true} 
                    className="w-full h-full"
                  />
                </div>
                <div className="max-w-md space-y-2 pt-2">
                  <h3 className="text-lg sm:text-xl font-black text-slate-900">
                    Belum Ada Agenda Terjadwal
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                    Jadwal bimbingan teknis, ujian dinas, dan seleksi CASN BKPSDM Kabupaten Aceh Tamiang sedang disiapkan dan akan segera diperbarui.
                  </p>
                </div>
                <div className="pt-6">
                  <a
                    href="https://bkpsdm.acehtamiangkab.go.id"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                  >
                    <span>Kunjungi Portal Resmi</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-200/90 shadow-sm hover:shadow-md transition-all relative overflow-hidden flex flex-col justify-between">
                
                {/* Subtle Decorative Background Accent */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-emerald-50/80 via-teal-50/30 to-transparent rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
                
                {/* Top Tags & Time Badge */}
                <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-xs font-black rounded-lg">
                      {primaryAgenda.kategori || 'Pengembangan Karir'}
                    </span>
                    <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg border border-slate-200 uppercase">
                      {primaryAgenda.tipe_pelaksanaan || 'OFFLINE'}
                    </span>
                  </div>
                  
                  <div className="text-right text-xs">
                    <p className="font-extrabold text-slate-900">
                      {formatDateRange(primaryAgenda.start_time, primaryAgenda.end_time)}
                    </p>
                    <p className="text-slate-500 font-medium">{formatTimeRange(primaryAgenda.start_time, primaryAgenda.end_time)}</p>
                  </div>
                </div>

                {/* Title & Description */}
                <div className="relative z-10 space-y-3 pt-6 sm:pt-8">
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 leading-tight">
                    {primaryAgenda.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal max-w-2xl">
                    {primaryAgenda.deskripsi || 'Kegiatan resmi kedinasan Badan Kepegawaian & Pengembangan SDM Kabupaten Aceh Tamiang.'}
                  </p>

                  <div className="flex items-center gap-2 text-xs text-slate-700 font-semibold pt-2">
                    <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700 shrink-0">
                      <MapPin className="w-3.5 h-3.5" />
                    </div>
                    <span>{primaryAgenda.lokasi || 'Aula BKPSDM Kab. Aceh Tamiang'}</span>
                  </div>

                  {/* Countdown & CTA Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 mt-4 border-t border-slate-100">
                    
                    {/* Countdown Timer (Clean White/Emerald Bento Style) */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs text-slate-500 font-bold mr-1">
                        {timeLeft.isPast ? 'Status Agenda:' : 'Akan dimulai:'}
                      </span>
                      {timeLeft.isPast ? (
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold border border-emerald-200">
                          Sedang Berlangsung / Selesai
                        </span>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-center min-w-[50px]">
                            <span className="font-black text-sm text-slate-900 block leading-tight">
                              {String(timeLeft.days).padStart(2, '0')}
                            </span>
                            <span className="text-[9px] text-slate-500 font-medium">Hari</span>
                          </div>
                          <span className="font-black text-slate-300">:</span>
                          <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-center min-w-[50px]">
                            <span className="font-black text-sm text-slate-900 block leading-tight">
                              {String(timeLeft.hours).padStart(2, '0')}
                            </span>
                            <span className="text-[9px] text-slate-500 font-medium">Jam</span>
                          </div>
                          <span className="font-black text-slate-300">:</span>
                          <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-center min-w-[50px]">
                            <span className="font-black text-sm text-slate-900 block leading-tight">
                              {String(timeLeft.minutes).padStart(2, '0')}
                            </span>
                            <span className="text-[9px] text-slate-500 font-medium">Menit</span>
                          </div>
                          <span className="font-black text-slate-300">:</span>
                          <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-center min-w-[50px]">
                            <span className="font-black text-sm text-emerald-700 block leading-tight">
                              {String(timeLeft.seconds).padStart(2, '0')}
                            </span>
                            <span className="text-[9px] text-emerald-600 font-medium">Detik</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* CTA Action Button */}
                    {primaryAgenda.link_pendaftaran ? (
                      <a 
                        href={primaryAgenda.link_pendaftaran}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full sm:w-auto text-center px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs transition-colors shadow-sm flex items-center justify-center gap-2"
                      >
                        <span>Daftar / Rincian</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    ) : (
                      <a 
                        href="https://bkpsdm.acehtamiangkab.go.id"
                        target="_blank"
                        rel="noreferrer"
                        className="w-full sm:w-auto text-center px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs transition-colors shadow-sm"
                      >
                        Lihat Rincian Agenda
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* List Agenda Lainnya (Clean White Cards) */}
            {sideAgendas.length > 0 && (
              <div className="space-y-3 pt-2">
                <span className="text-xs font-black text-slate-500 uppercase tracking-wider block px-1">
                  Jadwal Kegiatan Kedinasan Lainnya:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {sideAgendas.map((ev) => (
                    <div
                      key={ev.id}
                      onClick={() => {
                        setSelectedAgendaId(ev.id);
                        if (ev.start_time) {
                          setSelectedDateStr(new Date(ev.start_time).toISOString().slice(0, 10));
                          setCurrentDate(new Date(ev.start_time));
                        }
                      }}
                      className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                        selectedAgendaId === ev.id
                          ? 'bg-emerald-50/70 border-emerald-600 ring-2 ring-emerald-500/20 shadow-sm'
                          : 'bg-white border-slate-200/90 hover:border-emerald-500 hover:shadow-md'
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-100 text-[10px] font-bold">
                            {ev.kategori || 'Jadwal Resmi'}
                          </span>
                          <span className="text-[11px] font-bold text-slate-500">
                            {new Date(ev.start_time).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                          </span>
                        </div>
                        <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm line-clamp-2 hover:text-emerald-800 transition-colors">
                          {ev.title}
                        </h4>
                      </div>

                      <div className="text-[11px] text-slate-500 flex items-center gap-1.5 truncate border-t border-slate-100 pt-2 font-medium">
                        <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span className="truncate">{ev.lokasi}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Kalender Kepegawaian (4 Cols) - Clean Bento White Card */}
          <div className="lg:col-span-4 bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-sm space-y-5">
            <div className="space-y-1">
              <h3 className="font-black text-slate-900 text-base">Kalender Kepegawaian</h3>
              <p className="text-xs text-slate-500">Pilih tanggal untuk melihat jadwal kegiatan BKPSDM</p>
            </div>

            {/* Month & Year Navigation Header */}
            <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-200/80 flex items-center justify-between">
              <button 
                type="button" 
                onClick={handlePrevMonth}
                aria-label="Bulan Sebelumnya"
                className="p-2 rounded-xl hover:bg-white hover:shadow-2xs text-slate-700 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-black text-xs text-slate-900">
                {monthNames[month]} {year}
              </span>
              <button 
                type="button" 
                onClick={handleNextMonth}
                aria-label="Bulan Berikutnya"
                className="p-2 rounded-xl hover:bg-white hover:shadow-2xs text-slate-700 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Day of Week Headers */}
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-black text-slate-400 uppercase tracking-wider pb-1">
              <span>Min</span>
              <span>Sen</span>
              <span>Sel</span>
              <span>Rab</span>
              <span>Kam</span>
              <span>Jum</span>
              <span>Sab</span>
            </div>

            {/* Dynamic Full Month Grid with Event Dots */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              {/* Empty leading days before month start */}
              {Array.from({ length: firstDayIndex }).map((_, idx) => (
                <div key={`empty-${idx}`} className="h-8 sm:h-9" />
              ))}

              {/* Days in Month */}
              {Array.from({ length: daysInMonth }).map((_, idx) => {
                const dayNum = idx + 1;
                const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                const isSelected = selectedDateStr === dateKey;
                const hasEvent = daysWithEvents.has(dayNum);

                return (
                  <button
                    key={dateKey}
                    type="button"
                    onClick={() => {
                      setSelectedDateStr(dateKey);
                      // If there is an event on this day, auto-select it as primary
                      const eventOnDay = sortedAgendas.find(a => {
                        return a.start_time && new Date(a.start_time).toISOString().slice(0, 10) === dateKey;
                      });
                      if (eventOnDay) {
                        setSelectedAgendaId(eventOnDay.id);
                      }
                    }}
                    className={`h-8 sm:h-9 rounded-xl relative flex flex-col items-center justify-center transition-all cursor-pointer font-bold ${
                      isSelected
                        ? 'bg-emerald-800 text-white shadow-xs'
                        : hasEvent
                        ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-300/80'
                        : 'bg-white hover:bg-slate-100/80 text-slate-700'
                    }`}
                  >
                    <span>{dayNum}</span>
                    {hasEvent && (
                      <span className={`w-1.5 h-1.5 rounded-full absolute bottom-1 ${isSelected ? 'bg-amber-300' : 'bg-emerald-600'}`} />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Agenda Details for Selected Date */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-200/70 pb-2">
                <Calendar className="w-4 h-4 text-emerald-700" />
                <span className="text-xs font-extrabold text-slate-800">
                  {new Date(selectedDateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>

              {agendasOnSelectedDate.length > 0 ? (
                <div className="space-y-2.5">
                  {agendasOnSelectedDate.map(ag => (
                    <div 
                      key={ag.id}
                      onClick={() => setSelectedAgendaId(ag.id)}
                      className="p-3 bg-white rounded-xl border border-slate-200 hover:border-emerald-500 transition-all cursor-pointer shadow-2xs space-y-1.5"
                    >
                      <h4 className="font-extrabold text-xs text-slate-900 leading-snug hover:text-emerald-800">
                        {ag.title}
                      </h4>
                      <div className="flex flex-col gap-1 text-[11px] text-slate-500 font-medium">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3 h-3 text-amber-600 shrink-0" />
                          <span>{formatTimeRange(ag.start_time, ag.end_time)}</span>
                        </span>
                        <span className="flex items-center gap-1.5 truncate">
                          <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span className="truncate">{ag.lokasi}</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-4 text-center space-y-1">
                  <Info className="w-5 h-5 text-slate-400 mx-auto" />
                  <p className="text-xs text-slate-600 font-medium">Tidak ada kegiatan di tanggal ini.</p>
                  <p className="text-[11px] text-slate-400">Pilih tanggal bertitik hijau untuk melihat jadwal kegiatan.</p>
                </div>
              )}
            </div>

            {/* Info Tautan Resmi */}
            <a
              href="https://bkpsdm.acehtamiangkab.go.id"
              target="_blank"
              rel="noreferrer"
              className="block w-full py-2.5 text-center text-xs font-bold text-slate-700 hover:text-slate-900 border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors shadow-2xs"
            >
              Lihat Kalender Lengkap BKPSDM
            </a>
          </div>

        </div>

      </div>
    </section>
  );
}
