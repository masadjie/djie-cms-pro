import React, { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import { 
  Plus, 
  Trash2, 
  Save, 
  MoveUp, 
  MoveDown, 
  ChevronDown, 
  ChevronRight, 
  CornerDownRight, 
  CornerDownLeft,
  Link as LinkIcon, 
  FileText, 
  AlertCircle,
  Sparkles,
  FolderTree,
  Image as ImageIcon,
  RefreshCw
} from 'lucide-react';
import Badge from '../common/Badge';
import IconPickerModal, { DynamicIcon } from '../common/IconPickerModal';
import { useConfirm } from '../common/ConfirmDialog';

const PRESET_MODULES = [
  { label: 'Layanan Mutasi ASN', url: '/katalog/mutasi', tipe: 'LINK', icon: 'Briefcase' },
  { label: 'Layanan Cuti Online', url: '/katalog/cuti', tipe: 'LINK', icon: 'HeartHandshake' },
  { label: 'Kenaikan Gaji Berkala (KGB)', url: '/katalog/kgb', tipe: 'LINK', icon: 'TrendingUp' },
  { label: 'Ujian Dinas & Penyesuaian Ijazah', url: '/katalog/ud-pi', tipe: 'LINK', icon: 'GraduationCap' },
  { label: 'Disiplin & Kode Etik ASN', url: '/katalog/disiplin', tipe: 'LINK', icon: 'ShieldCheck' }
];

export default function MenuManagerTab() {
  const confirm = useConfirm();
  const queryClient = useQueryClient();
  const [items, setItems] = useState([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [targetParentId, setTargetParentId] = useState('');

  // Icon Picker Modal State
  const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);
  const [iconPickerContext, setIconPickerContext] = useState(null); // { type: 'item', index: number } | { type: 'custom' }

  // Left sidebar accordion states
  const [accordionState, setAccordionState] = useState({ pages: true, custom: false, modules: false });
  const [selectedPages, setSelectedPages] = useState([]);
  const [selectedModules, setSelectedModules] = useState([]);
  const [customForm, setCustomForm] = useState({ label: '', url: 'https://', tipe: 'EXTERNAL', icon: '' });

  // 1. Fetch live menus
  const { data: menuData, isLoading } = useQuery({
    queryKey: ['adminMenuList'],
    queryFn: async () => {
      try {
        const res = await api.get('/cms/menu');
        return res?.data || res || [];
      } catch (err) {
        return [];
      }
    }
  });

  // 2. Fetch live dynamic Pages from CMS
  const { data: dynamicPagesData } = useQuery({
    queryKey: ['adminPageList'],
    queryFn: async () => {
      try {
        const res = await api.get('/cms/pages');
        return res?.data || res || [];
      } catch (err) {
        return [];
      }
    }
  });

  const availablePages = useMemo(() => {
    return Array.isArray(dynamicPagesData) 
      ? dynamicPagesData 
      : (Array.isArray(dynamicPagesData?.data) ? dynamicPagesData.data : []);
  }, [dynamicPagesData]);

  // Sync state when data is loaded
  useEffect(() => {
    const rawItems = Array.isArray(menuData) 
      ? menuData 
      : (Array.isArray(menuData?.data) ? menuData.data : []);
    
    setItems(rawItems.sort((a, b) => (a.urutan || 0) - (b.urutan || 0)));
    setHasChanges(false);
  }, [menuData]);

  // Bulk save mutation
  const saveMutation = useMutation({
    mutationFn: async (payloadItems) => {
      return await api.put('/cms/menu-bulk', { items: payloadItems });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminMenuList'] });
      queryClient.invalidateQueries({ queryKey: ['dynamicMenus'] });
      setHasChanges(false);
    }
  });

  // Reset / Restore default menus mutation
  const resetMutation = useMutation({
    mutationFn: async () => await api.post('/cms/menu-reset'),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['adminMenuList'] });
      queryClient.invalidateQueries({ queryKey: ['dynamicMenus'] });
      const raw = Array.isArray(res) ? res : (res?.data || []);
      setItems(raw.sort((a, b) => (a.urutan || 0) - (b.urutan || 0)));
      setHasChanges(false);
    }
  });

  // Create single menu mutation
  const createMutation = useMutation({
    mutationFn: async (payload) => await api.post('/cms/menu', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminMenuList'] });
      queryClient.invalidateQueries({ queryKey: ['dynamicMenus'] });
    }
  });

  // Delete single menu mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => await api.delete(`/cms/menu/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminMenuList'] });
      queryClient.invalidateQueries({ queryKey: ['dynamicMenus'] });
    }
  });

  // Available top-level parents for dropdown
  const topLevelParents = useMemo(() => {
    return items.filter((it) => !it.parent_id);
  }, [items]);

  // --- Reordering & Indenting Actions ---
  const handleMove = (index, direction) => {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= items.length) return;
    const newItems = [...items];
    const temp = newItems[index];
    newItems[index] = newItems[targetIdx];
    newItems[targetIdx] = temp;

    const reordered = newItems.map((item, idx) => ({ ...item, urutan: idx + 1 }));
    setItems(reordered);
    setHasChanges(true);
  };

  const handleIndentRight = (index) => {
    if (index === 0) return;
    const newItems = [...items];
    const prevItem = newItems[index - 1];
    
    newItems[index] = {
      ...newItems[index],
      parent_id: prevItem.parent_id ? prevItem.parent_id : prevItem.id
    };
    setItems(newItems);
    setHasChanges(true);
  };

  const handleIndentLeft = (index) => {
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      parent_id: null
    };
    setItems(newItems);
    setHasChanges(true);
  };

  const handleUpdateField = (index, field, value) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
    setHasChanges(true);
  };

  const handleRemoveItem = async (index, item) => {
    if (item.id) {
      await deleteMutation.mutateAsync(item.id);
    }
    const newItems = items.filter((_, i) => i !== index).map((it, idx) => ({ ...it, urutan: idx + 1 }));
    setItems(newItems);
  };

  const handleAddDirectSubitem = async (parentItem) => {
    const payload = {
      label: 'Submenu Baru',
      url: '/halaman-baru',
      tipe: 'LINK',
      icon: 'FileText',
      parent_id: parentItem.id,
      urutan: items.length + 1,
      is_active: true
    };
    await createMutation.mutateAsync(payload);
  };

  // --- Add to Menu from Sidebar ---
  const handleAddSelectedPages = async () => {
    for (const page of selectedPages) {
      const payload = {
        label: page.title,
        url: `/page/${page.slug}`,
        tipe: 'PAGE',
        page_id: page.id,
        icon: 'FileText',
        parent_id: targetParentId ? Number(targetParentId) : null,
        urutan: items.length + 1,
        is_active: true
      };
      await createMutation.mutateAsync(payload);
    }
    setSelectedPages([]);
  };

  const handleAddCustomLink = async (e) => {
    e.preventDefault();
    if (!customForm.label.trim() || !customForm.url.trim()) return;
    await createMutation.mutateAsync({
      label: customForm.label,
      url: customForm.url,
      tipe: customForm.tipe,
      icon: customForm.icon || (customForm.tipe === 'EXTERNAL' ? 'ExternalLink' : 'LinkIcon'),
      parent_id: targetParentId ? Number(targetParentId) : null,
      urutan: items.length + 1,
      is_active: true
    });
    setCustomForm({ label: '', url: 'https://', tipe: 'EXTERNAL', icon: '' });
  };

  const handleAddSelectedModules = async () => {
    for (const m of selectedModules) {
      const payload = {
        label: m.label,
        url: m.url,
        tipe: 'LINK',
        icon: m.icon || 'Briefcase',
        parent_id: targetParentId ? Number(targetParentId) : null,
        urutan: items.length + 1,
        is_active: true
      };
      await createMutation.mutateAsync(payload);
    }
    setSelectedModules([]);
  };

  // Open Icon Picker helper
  const handleOpenIconPicker = (context) => {
    setIconPickerContext(context);
    setIsIconPickerOpen(true);
  };

  const handleSelectIcon = (iconName) => {
    if (!iconPickerContext) return;
    if (iconPickerContext.type === 'item') {
      handleUpdateField(iconPickerContext.index, 'icon', iconName);
    } else if (iconPickerContext.type === 'custom') {
      setCustomForm(prev => ({ ...prev, icon: iconName }));
    }
  };

  const currentModalIcon = useMemo(() => {
    if (!iconPickerContext) return '';
    if (iconPickerContext.type === 'item' && items[iconPickerContext.index]) {
      return items[iconPickerContext.index].icon || '';
    }
    if (iconPickerContext.type === 'custom') {
      return customForm.icon || '';
    }
    return '';
  }, [iconPickerContext, items, customForm]);

  return (
    <div className="space-y-6">
      
      {/* Top Banner Alert / WordPress Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
              <FolderTree className="w-4 h-4" />
            </span>
            <h2 className="text-base font-black text-slate-900">Struktur Hirarki Menu & Sub-Menu (WordPress Concept)</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Dukung pemilihan <strong>Ikon Lucide</strong>, <strong>Halaman (PAGE)</strong>, <strong>Link Internal</strong>, <strong>Dropdown</strong>, dan <strong>Link Eksternal</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={async () => {
              const ok = await confirm({
                title: 'Pulihkan Menu Standar BKPSDM',
                message: 'Apakah Anda yakin ingin memuat ulang 25 struktur menu dan sub-menu resmi BKPSDM Aceh Tamiang? Perubahan yang belum disimpan akan tertimpa.',
                confirmText: 'Ya, Pulihkan Menu',
                variant: 'warning'
              });
              if (ok) {
                resetMutation.mutate();
              }
            }}
            disabled={resetMutation.isPending}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            title="Muat Ulang Struktur Menu Standar BKPSDM"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${resetMutation.isPending ? 'animate-spin' : ''}`} />
            <span>{resetMutation.isPending ? 'Memulihkan...' : 'Muat Menu Standar'}</span>
          </button>

          {hasChanges && (
            <span className="text-[11px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl animate-pulse flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Ada Perubahan Belum Disimpan</span>
            </span>
          )}
          <button
            onClick={() => saveMutation.mutate(items)}
            disabled={saveMutation.isPending || !hasChanges}
            className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{saveMutation.isPending ? 'Menyimpan...' : 'Simpan Struktur Menu'}</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column WordPress Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ================= LEFT COLUMN: ADD MENU ITEMS (4 COLS) ================= */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-4">
            
            {/* Target Parent Selector */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5">
              <label className="text-[11px] font-bold text-slate-700 block">
                Tambahkan item baru ke dalam:
              </label>
              <select
                value={targetParentId}
                onChange={(e) => setTargetParentId(e.target.value)}
                className="w-full p-2 bg-white text-xs border border-slate-200 rounded-lg font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              >
                <option value="">[ Menu Utama - Tingkat Teratas ]</option>
                {topLevelParents.map((p) => (
                  <option key={p.id} value={p.id}>
                    ↳ Sub-item dari: {p.label}
                  </option>
                ))}
              </select>
            </div>

            <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">
              Tambah Item Menu
            </h3>

            {/* Accordion 1: Halaman Statis CMS (Pages) */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => setAccordionState({ ...accordionState, pages: !accordionState.pages })}
                className="w-full p-3 bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-xs font-bold text-slate-800 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Halaman Statis (CMS Pages)</span>
                </div>
                {accordionState.pages ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>

              {accordionState.pages && (
                <div className="p-3 space-y-3 bg-white border-t border-slate-100">
                  <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1 text-xs">
                    {availablePages.length === 0 ? (
                      <p className="text-slate-400 py-2 text-center text-[11px]">Tidak ada halaman statis.</p>
                    ) : (
                      availablePages.map((page) => {
                        const isChecked = selectedPages.some((p) => p.id === page.id);
                        return (
                          <label 
                            key={page.id} 
                            className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer text-slate-700"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedPages([...selectedPages, page]);
                                  } else {
                                    setSelectedPages(selectedPages.filter((p) => p.id !== page.id));
                                  }
                                }}
                                className="rounded border-slate-300 text-emerald-700 focus:ring-emerald-500"
                              />
                              <span className="font-medium truncate">{page.title}</span>
                            </div>
                            <span className="text-[9px] font-mono text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded shrink-0">
                              Page
                            </span>
                          </label>
                        );
                      })
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={handleAddSelectedPages}
                    disabled={selectedPages.length === 0}
                    className="w-full py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambahkan ke Menu ({selectedPages.length})</span>
                  </button>
                </div>
              )}
            </div>

            {/* Accordion 2: Tautan Kustom (Custom Links) */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => setAccordionState({ ...accordionState, custom: !accordionState.custom })}
                className="w-full p-3 bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-xs font-bold text-slate-800 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <LinkIcon className="w-3.5 h-3.5 text-amber-600" />
                  <span>Tautan Kustom / Eksternal</span>
                </div>
                {accordionState.custom ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>

              {accordionState.custom && (
                <form onSubmit={handleAddCustomLink} className="p-3 space-y-3 bg-white border-t border-slate-100 text-xs">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">Target URL</label>
                    <input
                      type="text"
                      placeholder="https://... atau /rute-khusus"
                      value={customForm.url}
                      onChange={(e) => setCustomForm({ ...customForm, url: e.target.value })}
                      className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none font-mono"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">Teks Tautan (Label)</label>
                    <input
                      type="text"
                      placeholder="Contoh: Portal BKN Resmi"
                      value={customForm.label}
                      onChange={(e) => setCustomForm({ ...customForm, label: e.target.value })}
                      className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">Ikon Menu (Opsional)</label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenIconPicker({ type: 'custom' })}
                        className="flex-1 p-2 bg-slate-50 border border-slate-200 hover:border-emerald-500 rounded-xl flex items-center justify-between text-xs transition-colors"
                      >
                        <div className="flex items-center gap-2 text-slate-700">
                          {customForm.icon ? (
                            <>
                              <DynamicIcon name={customForm.icon} className="w-4 h-4 text-emerald-700" />
                              <span className="font-semibold">{customForm.icon}</span>
                            </>
                          ) : (
                            <span className="text-slate-400">Pilih Ikon...</span>
                          )}
                        </div>
                        <ImageIcon className="w-4 h-4 text-slate-400" />
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambahkan ke Menu</span>
                  </button>
                </form>
              )}
            </div>

            {/* Accordion 3: Modul SiKEPO */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => setAccordionState({ ...accordionState, modules: !accordionState.modules })}
                className="w-full p-3 bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-xs font-bold text-slate-800 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                  <span>Katalog Layanan SiKEPO</span>
                </div>
                {accordionState.modules ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>

              {accordionState.modules && (
                <div className="p-3 space-y-3 bg-white border-t border-slate-100">
                  <div className="space-y-1.5 text-xs">
                    {PRESET_MODULES.map((mod, idx) => {
                      const isChecked = selectedModules.some((m) => m.url === mod.url);
                      return (
                        <label 
                          key={idx} 
                          className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer text-slate-700 font-medium"
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedModules([...selectedModules, mod]);
                                } else {
                                  setSelectedModules(selectedModules.filter((m) => m.url !== mod.url));
                                }
                              }}
                              className="rounded border-slate-300 text-emerald-700 focus:ring-emerald-500"
                            />
                            <span>{mod.label}</span>
                          </div>
                          <DynamicIcon name={mod.icon} className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        </label>
                      );
                    })}
                  </div>
                  <button
                    type="button"
                    onClick={handleAddSelectedModules}
                    disabled={selectedModules.length === 0}
                    className="w-full py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambahkan ke Menu ({selectedModules.length})</span>
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* ================= RIGHT COLUMN: MENU STRUCTURE (8 COLS) ================= */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            
            {/* Header Structure Box */}
            <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-black text-slate-900">Struktur Menu: Header Navigasi Utama</h3>
                <p className="text-xs text-slate-500">
                  Gunakan tombol panah Naik/Turun untuk urutan, tombol Geser Kanan untuk menjadikannya submenu, atau Geser Kiri untuk mengembalikannya ke menu utama.
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-lg">
                Total: {items.length} Item
              </span>
            </div>

            {/* Empty or Loading State */}
            {isLoading ? (
              <div className="p-12 text-center text-xs text-slate-400">
                <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <span>Memuat struktur menu...</span>
              </div>
            ) : items.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-500 border border-dashed border-slate-200 rounded-2xl bg-slate-50 space-y-3">
                <p className="font-semibold text-slate-700">Struktur menu belum dimuat atau kosong di database.</p>
                <button
                  type="button"
                  onClick={() => resetMutation.mutate()}
                  disabled={resetMutation.isPending}
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-sm inline-flex items-center gap-1.5"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${resetMutation.isPending ? 'animate-spin' : ''}`} />
                  <span>{resetMutation.isPending ? 'Memulihkan Menu...' : 'Muat 25 Menu & Sub-Menu Resmi BKPSDM'}</span>
                </button>
              </div>
            ) : (
              /* Menu Items List Cards */
              <div className="space-y-2.5">
                {items.map((item, index) => {
                  const isExpanded = expandedId === (item.id || index);
                  const isSub = Boolean(item.parent_id);
                  const parentItem = isSub ? items.find((it) => it.id === item.parent_id) : null;
                  const isPageType = item.tipe === 'PAGE';

                  return (
                    <div
                      key={item.id || index}
                      className={`border rounded-xl transition-all ${
                        isSub 
                          ? 'ml-8 sm:ml-12 border-l-4 border-l-emerald-600 border-teal-200 bg-teal-50/40' 
                          : 'border-slate-200 bg-white shadow-xs'
                      } ${isExpanded ? 'ring-2 ring-emerald-600 shadow-md' : 'hover:border-slate-300'}`}
                    >
                      {/* Menu Card Header Bar */}
                      <div className="p-3 sm:p-3.5 flex items-center justify-between gap-3 select-none">
                        <div className="flex items-center gap-2.5 min-w-0">
                          {isSub ? (
                            <CornerDownRight className="w-4 h-4 text-emerald-700 shrink-0" />
                          ) : (
                            <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-700 font-mono font-black text-[11px] flex items-center justify-center shrink-0">
                              #{index + 1}
                            </span>
                          )}

                          {/* Menu Item Icon Badge */}
                          {item.icon && (
                            <div className="w-7 h-7 rounded-lg bg-emerald-100/80 border border-emerald-200/80 text-emerald-800 flex items-center justify-center shrink-0 shadow-xs" title={`Ikon: ${item.icon}`}>
                              <DynamicIcon name={item.icon} className="w-4 h-4" />
                            </div>
                          )}

                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className={`text-xs font-black truncate ${isSub ? 'text-emerald-950 font-bold' : 'text-slate-900'}`}>
                                {item.label || '(Tanpa Judul)'}
                              </span>
                              
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded shrink-0 ${
                                isPageType 
                                  ? 'bg-blue-100 text-blue-900 border border-blue-200' 
                                  : isSub 
                                  ? 'bg-emerald-100 text-emerald-800' 
                                  : 'bg-slate-100 text-slate-600'
                              }`}>
                                {isPageType ? 'Halaman (Page)' : isSub ? `Sub-item` : (item.tipe || 'Halaman')}
                              </span>

                              {!item.is_active && (
                                <Badge variant="amber" size="xs">Non-aktif</Badge>
                              )}
                            </div>

                            {isSub && parentItem && (
                              <span className="text-[10px] text-teal-700 font-semibold block mt-0.5">
                                ↳ Bagian dari menu: <strong>{parentItem.label}</strong>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Card Controls */}
                        <div className="flex items-center gap-1 shrink-0">
                          {/* Move Up */}
                          <button
                            type="button"
                            onClick={() => handleMove(index, -1)}
                            disabled={index === 0}
                            className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20 rounded"
                            title="Pindah ke Atas"
                          >
                            <MoveUp className="w-3.5 h-3.5" />
                          </button>
                          
                          {/* Move Down */}
                          <button
                            type="button"
                            onClick={() => handleMove(index, 1)}
                            disabled={index === items.length - 1}
                            className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20 rounded"
                            title="Pindah ke Bawah"
                          >
                            <MoveDown className="w-3.5 h-3.5" />
                          </button>

                          {/* Indent Left (Make Main Menu) */}
                          {isSub && (
                            <button
                              type="button"
                              onClick={() => handleIndentLeft(index)}
                              className="p-1 text-teal-700 hover:bg-teal-100 rounded text-xs font-bold"
                              title="Jadikan Menu Utama (Geser Kiri)"
                            >
                              <CornerDownLeft className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Indent Right (Make Submenu) */}
                          {!isSub && index > 0 && (
                            <button
                              type="button"
                              onClick={() => handleIndentRight(index)}
                              className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded text-xs font-bold"
                              title="Jadikan Submenu (Geser Kanan)"
                            >
                              <CornerDownRight className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Quick add sub-item under this parent */}
                          {!isSub && (
                            <button
                              type="button"
                              onClick={() => handleAddDirectSubitem(item)}
                              className="p-1.5 text-emerald-800 hover:bg-emerald-50 rounded-lg text-xs font-bold hidden sm:flex items-center gap-1"
                              title="Tambah Submenu Baru di Bawah Ini"
                            >
                              <Plus className="w-3 h-3" />
                              <span className="text-[10px]">Submenu</span>
                            </button>
                          )}

                          {/* Expand Edit Settings */}
                          <button
                            type="button"
                            onClick={() => setExpandedId(isExpanded ? null : (item.id || index))}
                            className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg text-xs font-bold ml-1 flex items-center gap-1"
                          >
                            <span>Edit</span>
                            {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      {/* Expanded Accordion Panel Form */}
                      {isExpanded && (
                        <div className="p-4 bg-slate-50 border-t border-slate-200 rounded-b-xl space-y-3 text-xs">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="text-[11px] font-bold text-slate-600 block mb-1">Label Menu</label>
                              <input
                                type="text"
                                value={item.label}
                                onChange={(e) => handleUpdateField(index, 'label', e.target.value)}
                                className="w-full p-2.5 bg-white text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="text-[11px] font-bold text-slate-600 block mb-1">Target URL</label>
                              <input
                                type="text"
                                value={item.url}
                                onChange={(e) => handleUpdateField(index, 'url', e.target.value)}
                                className="w-full p-2.5 bg-white text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none font-mono"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                            <div>
                              <label className="text-[11px] font-bold text-slate-600 block mb-1">Induk Menu (Parent)</label>
                              <select
                                value={item.parent_id || ''}
                                onChange={(e) => handleUpdateField(index, 'parent_id', e.target.value ? Number(e.target.value) : null)}
                                className="w-full p-2.5 bg-white text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                              >
                                <option value="">(None - Menu Utama)</option>
                                {topLevelParents
                                  .filter((p) => p.id !== item.id)
                                  .map((p) => (
                                    <option key={p.id} value={p.id}>
                                      ↳ {p.label}
                                    </option>
                                  ))}
                              </select>
                            </div>

                            <div>
                              <label className="text-[11px] font-bold text-slate-600 block mb-1">Tipe Tampilan</label>
                              <select
                                value={item.tipe || 'LINK'}
                                onChange={(e) => handleUpdateField(index, 'tipe', e.target.value)}
                                className="w-full p-2.5 bg-white text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                              >
                                <option value="PAGE">Halaman Statis (PAGE)</option>
                                <option value="LINK">Link Halaman / Rute Sistem</option>
                                <option value="DROPDOWN">Dropdown Menu / MegaMenu</option>
                                <option value="EXTERNAL">Link Eksternal</option>
                              </select>
                            </div>

                            {/* Icon Picker Field */}
                            <div>
                              <label className="text-[11px] font-bold text-slate-600 block mb-1">Ikon Menu</label>
                              <button
                                type="button"
                                onClick={() => handleOpenIconPicker({ type: 'item', index })}
                                className="w-full p-2 bg-white border border-slate-200 hover:border-emerald-500 rounded-xl flex items-center justify-between text-xs transition-colors shadow-xs"
                              >
                                <div className="flex items-center gap-2 text-slate-800 min-w-0">
                                  {item.icon ? (
                                    <>
                                      <DynamicIcon name={item.icon} className="w-4 h-4 text-emerald-700 shrink-0" />
                                      <span className="font-semibold font-mono truncate">{item.icon}</span>
                                    </>
                                  ) : (
                                    <span className="text-slate-400">Pilih Ikon...</span>
                                  )}
                                </div>
                                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold shrink-0">
                                  Ubah
                                </span>
                              </button>
                            </div>
                          </div>

                          <div className="flex items-center gap-6 pt-2">
                            <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                              <input
                                type="checkbox"
                                checked={item.target_blank || false}
                                onChange={(e) => handleUpdateField(index, 'target_blank', e.target.checked)}
                                className="rounded border-slate-300 text-emerald-700 focus:ring-emerald-500"
                              />
                              <span>Buka di Tab Baru</span>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                              <input
                                type="checkbox"
                                checked={item.is_active !== false}
                                onChange={(e) => handleUpdateField(index, 'is_active', e.target.checked)}
                                className="rounded border-slate-300 text-emerald-700 focus:ring-emerald-500"
                              />
                              <span>Aktif</span>
                            </label>
                          </div>

                          <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(index, item)}
                              className="text-red-600 hover:text-red-800 text-xs font-bold flex items-center gap-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Hapus dari Menu</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setExpandedId(null)}
                              className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-lg"
                            >
                              Tutup
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Bottom Save Bar */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="text-xs text-slate-500">
                Lokasi Menu: <span className="font-bold text-slate-800">Header Navigasi Utama</span>
              </div>
              <button
                onClick={() => saveMutation.mutate(items)}
                disabled={saveMutation.isPending || !hasChanges}
                className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{saveMutation.isPending ? 'Menyimpan...' : 'Simpan Perubahan Menu'}</span>
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* Global Icon Picker Modal */}
      <IconPickerModal
        isOpen={isIconPickerOpen}
        onClose={() => setIsIconPickerOpen(false)}
        selectedIcon={currentModalIcon}
        onSelectIcon={handleSelectIcon}
      />

    </div>
  );
}
