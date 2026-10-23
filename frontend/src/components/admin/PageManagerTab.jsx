import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import { Plus, Trash2, FileText, Eye, Edit3, ExternalLink, Sparkles } from 'lucide-react';
import DataTable from '../common/DataTable';
import Badge from '../common/Badge';
import { useConfirm } from '../common/ConfirmDialog';

export default function PageManagerTab() {
  const confirm = useConfirm();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  const { data: pageData, isLoading } = useQuery({
    queryKey: ['adminPageList', page, limit, search, status],
    queryFn: async () => {
      try {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(limit)
        });
        if (search) params.append('search', search);
        if (status) params.append('status', status);
        const res = await api.get(`/cms/pages?${params.toString()}`);
        return res?.data || res || { data: [], pagination: { total: 0 } };
      } catch (err) {
        return { data: [], pagination: { total: 0 } };
      }
    }
  });

  const pageItems = Array.isArray(pageData) 
    ? pageData 
    : (Array.isArray(pageData?.data) ? pageData.data : []);

  const totalPagesCount = pageData?.pagination?.total 
    || (Array.isArray(pageData?.data) ? pageData.pagination?.total : 0) 
    || (Array.isArray(pageData) ? pageData.length : 0) 
    || 0;

  const deleteMutation = useMutation({
    mutationFn: async (id) => await api.delete(`/cms/pages/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminPageList'] });
      queryClient.invalidateQueries({ queryKey: ['adminMenuList'] });
      queryClient.invalidateQueries({ queryKey: ['cmsAnalytics'] });
    }
  });

  const columns = [
    {
      header: 'No',
      width: '60px',
      align: 'center',
      render: (_, index) => <span className="font-mono text-slate-400 font-bold">#{index}</span>
    },
    {
      header: 'Judul Halaman (Page Title)',
      accessor: 'title',
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-50 text-emerald-800 rounded-lg shrink-0">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <p className="font-bold text-slate-900">{item.title}</p>
            <p className="text-[11px] font-mono text-emerald-700">/page/{item.slug}</p>
          </div>
        </div>
      )
    },
    {
      header: 'Template',
      render: (item) => (
        <span className="text-[10px] font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded uppercase">
          {item.template || 'DEFAULT'}
        </span>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (item) => (
        <Badge variant={item.status === 'PUBLISHED' ? 'emerald' : 'amber'} size="sm">
          {item.status}
        </Badge>
      )
    },
    {
      header: 'Views',
      accessor: 'views_count',
      align: 'center',
      render: (item) => <span className="font-mono font-bold text-slate-700">{item.views_count || 0}</span>
    },
    {
      header: 'Tanggal Dibuat',
      render: (item) => (
        <span className="text-slate-500">{new Date(item.created_at).toLocaleDateString('id-ID')}</span>
      )
    },
    {
      header: 'Aksi',
      align: 'right',
      render: (item) => (
        <div className="flex items-center justify-end gap-1.5">
          <a
            href={`/page/${item.slug}`}
            target="_blank"
            rel="noreferrer"
            className="p-1.5 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors text-xs font-bold inline-flex items-center gap-1"
            title="Lihat Halaman Publik"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Lihat</span>
          </a>
          <button
            type="button"
            onClick={() => navigate(`/admin/pages/edit/${item.id}`)}
            className="p-1.5 text-blue-700 hover:text-blue-950 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
            title="Edit Halaman (Page Builder)"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>
          <button
            type="button"
            onClick={async () => {
              const ok = await confirm({
                title: 'Hapus Halaman Statis',
                message: `Apakah Anda yakin ingin menghapus halaman "${item.title}"? Tautan publik menuju halaman ini tidak akan dapat diakses lagi.`,
                confirmText: 'Ya, Hapus Halaman',
                variant: 'danger'
              });
              if (ok) {
                deleteMutation.mutate(item.id);
              }
            }}
            className="p-1.5 text-red-700 hover:text-red-900 bg-red-50 hover:bg-red-100 rounded-lg transition-colors text-xs cursor-pointer"
            title="Hapus Halaman"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-slate-900">Manajemen Halaman Statis (CMS Pages)</h2>
          <p className="text-xs text-slate-500">Buat dan kelola halaman informasi resmi portal (Visi Misi, Struktur Organisasi, Profil PPID, dll).</p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/admin/pages/create')}
          className="px-4 py-2.5 bg-blue-800 hover:bg-blue-700 active:scale-95 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 text-amber-300" />
          <span>Buat Halaman Baru (Page Builder)</span>
        </button>
      </div>

      <DataTable
        columns={columns}
        data={pageItems}
        isLoading={isLoading}
        serverSide={true}
        totalItems={totalPagesCount}
        currentPage={page}
        pageSize={limit}
        onPageChange={setPage}
        onPageSizeChange={(newSize) => {
          setLimit(newSize);
          setPage(1);
        }}
        onSearchChange={(query) => {
          setSearch(query);
          setPage(1);
        }}
        onFilterChange={(filters) => {
          setStatus(filters.status || '');
          setPage(1);
        }}
        searchPlaceholder="Cari judul halaman atau slug..."
        filters={[
          {
            key: 'status',
            label: 'Status',
            options: [
              { label: 'PUBLISHED', value: 'PUBLISHED' },
              { label: 'DRAFT', value: 'DRAFT' }
            ]
          }
        ]}
        emptyMessage="Belum ada halaman statis yang dibuat."
      />
    </div>
  );
}
