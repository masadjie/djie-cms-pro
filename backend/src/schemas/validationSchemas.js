const { z } = require('zod');

const registerWargaSchema = z.object({
  nik: z.string().length(16, 'NIK harus tepat 16 digit'),
  name: z.string().min(3, 'Nama minimal 3 karakter').max(150),
  email: z.string().email('Format email tidak valid'),
  phone: z.string().min(10, 'Nomor HP minimal 10 digit').max(18),
  password: z
    .string()
    .min(8, 'Password minimal 8 karakter sesuai standar keamanan ISO 27001')
    .regex(/[A-Z]/, 'Password wajib mengandung setidaknya 1 huruf kapital (A-Z)')
    .regex(/[0-9]/, 'Password wajib mengandung setidaknya 1 angka (0-9)')
});

const loginSchema = z.object({
  identifier: z.string().min(3, 'Email atau NIK wajib diisi'),
  password: z.string().min(6, 'Password wajib diisi')
});

const createLayananSchema = z.object({
  opd_id: z.string().uuid('ID OPD tidak valid'),
  kategori_id: z.string().uuid('ID Kategori tidak valid'),
  kode_layanan: z.string().min(3).max(50),
  nama_layanan: z.string().min(3).max(255),
  deskripsi: z.string().min(10),
  dasar_hukum: z.string().optional(),
  biaya: z.string().default('Gratis (Rp 0)'),
  estimasi_waktu: z.string().default('1 - 3 Hari Kerja'),
  output_layanan: z.string().optional(),
  tipe_layanan: z.enum(['ONLINE_FULL', 'SEMI_ONLINE', 'INFORMASI_OFFLINE', 'LINK_EKSTERNAL']),
  link_eksternal: z.string().url().optional().or(z.literal('')),
  jam_operasional: z.string().optional(),
  kontak_pengaduan: z.string().optional(),
  is_populer: z.boolean().optional(),
  syarat_dokumen: z.array(
    z.object({
      nama_syarat: z.string().min(3),
      deskripsi: z.string().optional(),
      tipe_file: z.string().default('pdf,jpg,png'),
      max_size_mb: z.number().default(2),
      is_mandatory: z.boolean().default(true)
    })
  ).optional()
});

const createPermohonanSchema = z.object({
  layanan_id: z.string().uuid('ID Layanan tidak valid'),
  nik_pemohon: z.string().length(16, 'NIK harus 16 digit'),
  nama_pemohon: z.string().min(3),
  telepon_pemohon: z.string().min(10),
  alamat_pemohon: z.string().optional(),
  catatan_pemohon: z.string().optional(),
  data_berkas: z.record(z.any()).optional()
});

const updateStatusPermohonanSchema = z.object({
  status: z.enum([
    'DIAJUKAN',
    'VERIFIKASI_BERKAS',
    'DIPROSES_OPD',
    'MENUNGGU_PERBAIKAN',
    'SELESAI',
    'DITOLAK'
  ]),
  catatan_petugas: z.string().optional(),
  file_output_url: z.string().optional()
});

module.exports = {
  registerWargaSchema,
  loginSchema,
  createLayananSchema,
  createPermohonanSchema,
  updateStatusPermohonanSchema
};
