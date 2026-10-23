import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Filter, Loader2 } from 'lucide-react';

export default function DataTable({
  columns = [],
  data = [],
  isLoading = false,
  // Server-Side API Pagination Props
  serverSide = false,
  totalItems: serverTotalItems,
  currentPage: serverCurrentPage = 1,
  pageSize: serverPageSize = 10,
  onPageChange,
  onPageSizeChange,
  onSearchChange,
  onFilterChange,
  // Configurations
  searchPlaceholder = 'Cari data...',
  searchKeys = [], // fields to search on client fallback
  filters = [], // array of { key: 'status', label: 'Status', options: [{ label: 'Semua', value: '' }, ...] }
  pageSizeOptions = [10, 25, 50],
  defaultPageSize = 10,
  emptyMessage = 'Belum ada data yang ditemukan.'
}) {
  // Client-side fallback state
  const [clientSearchTerm, setClientSearchTerm] = useState('');
  const [clientActiveFilters, setClientActiveFilters] = useState({});
  const [clientCurrentPage, setClientCurrentPage] = useState(1);
  const [clientPageSize, setClientPageSize] = useState(defaultPageSize);

  // Search input debounce timer for server-side
  const [searchValue, setSearchValue] = useState('');
  const debounceTimerRef = useRef(null);

  const isServer = Boolean(serverSide);
  const activePage = isServer ? serverCurrentPage : clientCurrentPage;
  const activePageSize = isServer ? serverPageSize : clientPageSize;

  // Handle Search Input Change
  const handleSearchInput = (e) => {
    const val = e.target.value;
    setSearchValue(val);

    if (isServer) {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = setTimeout(() => {
        if (onSearchChange) onSearchChange(val);
      }, 400);
    } else {
      setClientSearchTerm(val);
      setClientCurrentPage(1);
    }
  };

  // Handle Filter Change
  const handleFilterSelect = (key, val) => {
    if (isServer) {
      if (onFilterChange) onFilterChange(key, val);
    } else {
      setClientActiveFilters((prev) => ({ ...prev, [key]: val }));
      setClientCurrentPage(1);
    }
  };

  // Handle Page Change
  const handlePageSelect = (newPage) => {
    if (isServer) {
      if (onPageChange) onPageChange(newPage);
    } else {
      setClientCurrentPage(newPage);
    }
  };

  // Handle Page Size Change
  const handlePageSizeSelect = (newSize) => {
    if (isServer) {
      if (onPageSizeChange) onPageSizeChange(newSize);
    } else {
      setClientPageSize(newSize);
      setClientCurrentPage(1);
    }
  };

  // --- Client-side filtering fallback ---
  const clientFilteredData = useMemo(() => {
    if (isServer || !Array.isArray(data)) return data;

    return data.filter((item) => {
      // Check keyword search
      if (clientSearchTerm.trim() !== '') {
        const query = clientSearchTerm.toLowerCase();
        const matchesSearch = searchKeys.length > 0
          ? searchKeys.some((k) => {
              const val = k.split('.').reduce((acc, part) => acc && acc[part], item);
              return val && String(val).toLowerCase().includes(query);
            })
          : Object.values(item).some((v) => 
              v && typeof v === 'string' && v.toLowerCase().includes(query)
            );
        if (!matchesSearch) return false;
      }

      // Check categorical filters
      for (const filter of filters) {
        const selectedValue = clientActiveFilters[filter.key];
        if (selectedValue && selectedValue !== '') {
          const itemValue = item[filter.key];
          if (String(itemValue) !== String(selectedValue)) {
            return false;
          }
        }
      }

      return true;
    });
  }, [isServer, data, clientSearchTerm, searchKeys, filters, clientActiveFilters]);

  // Calculations for Pagination
  const effectiveTotalItems = isServer ? (serverTotalItems || data.length || 0) : clientFilteredData.length;
  const totalPages = Math.max(1, Math.ceil(effectiveTotalItems / activePageSize));

  const displayData = useMemo(() => {
    if (isServer) {
      return Array.isArray(data) ? data : [];
    }
    const start = (clientCurrentPage - 1) * clientPageSize;
    return clientFilteredData.slice(start, start + clientPageSize);
  }, [isServer, data, clientFilteredData, clientCurrentPage, clientPageSize]);

  const startIdx = effectiveTotalItems === 0 ? 0 : (activePage - 1) * activePageSize + 1;
  const endIdx = Math.min(activePage * activePageSize, effectiveTotalItems);

  return (
    <div className="space-y-4">
      {/* Controls Bar: Search, Filters & PageSize */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50/70 p-3 rounded-2xl border border-slate-200">
        
        {/* Search Bar */}
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={handleSearchInput}
            className="w-full pl-9 pr-4 py-2 bg-white text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none placeholder-slate-400 font-medium"
          />
        </div>

        {/* Filter Dropdowns & Limit */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {filters.map((filter) => (
            <div key={filter.key} className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-xl border border-slate-200">
              <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <select
                onChange={(e) => handleFilterSelect(filter.key, e.target.value)}
                className="bg-transparent font-semibold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="">Semua {filter.label}</option>
                {filter.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          ))}

          {/* Page Size Option */}
          <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-xl border border-slate-200">
            <span className="text-slate-400 font-medium">Baris:</span>
            <select
              value={activePageSize}
              onChange={(e) => handlePageSizeSelect(Number(e.target.value))}
              className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        </div>

      </div>

      {/* Table Content Container */}
      <div className="relative rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-xs">
        
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-xs z-10 flex items-center justify-center">
            <div className="flex items-center gap-2 px-4 py-2 bg-white shadow-lg rounded-2xl border border-slate-200 text-xs font-bold text-emerald-800">
              <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
              <span>Memuat data dari API...</span>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider select-none">
              <tr>
                {columns.map((col, idx) => (
                  <th
                    key={idx}
                    className={`py-3.5 px-4 ${col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'}`}
                    style={{ width: col.width || 'auto' }}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="py-12 text-center text-slate-400">
                    <p className="text-sm font-medium">{emptyMessage}</p>
                    <p className="text-[11px] text-slate-400 mt-1">Gunakan kata kunci atau filter lain</p>
                  </td>
                </tr>
              ) : (
                displayData.map((item, rowIdx) => {
                  const itemIndex = isServer 
                    ? (activePage - 1) * activePageSize + rowIdx + 1
                    : startIdx + rowIdx;

                  return (
                    <tr key={item.id || rowIdx} className="hover:bg-slate-50/80 transition-colors">
                      {columns.map((col, colIdx) => {
                        let content = null;
                        if (typeof col.render === 'function') {
                          content = col.render(item, itemIndex);
                        } else if (typeof col.cell === 'function') {
                          const accessorKey = col.accessorKey || col.accessor;
                          const cellVal = accessorKey ? accessorKey.split('.').reduce((acc, part) => acc && acc[part], item) : null;
                          const tanstackInfo = {
                            row: { original: item },
                            getValue: () => cellVal,
                            item,
                            index: itemIndex
                          };
                          // If cell function expects item directly (e.g. cell: (row) => ... where row.name is accessed)
                          // or TanStack signature info.row.original:
                          content = col.cell(item, itemIndex);
                          if (content === undefined || (content !== null && typeof content === 'object' && !React.isValidElement(content) && content.row)) {
                            content = col.cell(tanstackInfo);
                          }
                        } else if (col.accessor || col.accessorKey) {
                          const key = col.accessor || col.accessorKey;
                          content = key.split('.').reduce((acc, part) => acc && acc[part], item);
                        }

                        return (
                          <td
                            key={colIdx}
                            className={`py-3.5 px-4 ${col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'}`}
                          >
                            {content}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Bottom Pagination Bar */}
        <div className="p-4 bg-slate-50/60 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          
          {/* Entries Info */}
          <div className="text-slate-500 font-medium">
            Menampilkan <strong className="text-slate-800">{startIdx}</strong> sampai <strong className="text-slate-800">{endIdx}</strong> dari total <strong className="text-slate-800 font-mono">{effectiveTotalItems}</strong> data
            {isServer && <span className="ml-2 text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded font-bold font-mono">API Pagination</span>}
          </div>

          {/* Page Buttons */}
          <div className="flex items-center gap-1 self-center sm:self-auto">
            {/* First Page */}
            <button
              onClick={() => handlePageSelect(1)}
              disabled={activePage === 1 || isLoading}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-slate-600 cursor-pointer"
              title="Halaman Pertama"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>

            {/* Prev Page */}
            <button
              onClick={() => handlePageSelect(Math.max(1, activePage - 1))}
              disabled={activePage === 1 || isLoading}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-slate-600 cursor-pointer"
              title="Halaman Sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Current Page Pill */}
            <span className="px-3 py-1 font-bold text-xs bg-emerald-900 text-amber-300 rounded-lg shadow-xs font-mono">
              {activePage} / {totalPages}
            </span>

            {/* Next Page */}
            <button
              onClick={() => handlePageSelect(Math.min(totalPages, activePage + 1))}
              disabled={activePage >= totalPages || isLoading}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-slate-600 cursor-pointer"
              title="Halaman Selanjutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Last Page */}
            <button
              onClick={() => handlePageSelect(totalPages)}
              disabled={activePage >= totalPages || isLoading}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-slate-600 cursor-pointer"
              title="Halaman Terakhir"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
