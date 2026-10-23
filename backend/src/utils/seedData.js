const { sequelize, User, OPD, KategoriLayanan, Layanan, SyaratLayanan, KategoriBerita, Berita, Agenda } = require('../models');
const logger = require('../config/logger');

async function seed() {
  try {
    await sequelize.sync({ force: true });
    logger.info('🔄 Database disetel ulang untuk seeding BKPSDM Aceh Tamiang...');

    // 1. Seed Master Unit / Bidang BKPSDM Aceh Tamiang
    const opds = await OPD.bulkCreate([
      {
        kode_opd: 'BKPSDM-MUTASI',
        nama_opd: 'Bidang Mutasi dan Status Kepegawaian',
        singkatan: 'Bidang Mutasi BKPSDM',
        deskripsi: 'Pelayanan mutasi antar-dinas/daerah, kenaikan pangkat reguler dan fungsional, serta penyesuaian ijazah.',
        alamat: 'Komplek Perkantoran Pemkab Aceh Tamiang, Jl. Ir. H. Juanda No. 1, Karang Baru',
        email_resmi: 'mutasi.bkpsdm@acehtamiangkab.go.id',
        telepon: '(0641) 333111',
        website: 'https://bkpsdm.acehtamiangkab.go.id'
      },
      {
        kode_opd: 'BKPSDM-BANGKOM',
        nama_opd: 'Bidang Pengembangan Kompetensi dan Kinerja Aparatur',
        singkatan: 'Bidang Bangkom BKPSDM',
        deskripsi: 'Pelayanan tugas belajar, izin belajar, diklat teknis/kepemimpinan, e-kinerja SKP, dan TPP ASN.',
        alamat: 'Komplek Perkantoran Pemkab Aceh Tamiang, Jl. Ir. H. Juanda No. 1, Karang Baru',
        email_resmi: 'bangkom.bkpsdm@acehtamiangkab.go.id',
        telepon: '(0641) 333222',
        website: 'https://bkpsdm.acehtamiangkab.go.id'
      },
      {
        kode_opd: 'BKPSDM-PENGADAAN',
        nama_opd: 'Bidang Pengadaan, Pemberhentian dan Informasi Kepegawaian',
        singkatan: 'Bidang Pengadaan & Pensiun',
        deskripsi: 'Pelayanan seleksi CASN (CPNS/PPPK), pemberhentian/pensiun ASN, Karpeg/Karis/Karsu, dan SIMPEG.',
        alamat: 'Komplek Perkantoran Pemkab Aceh Tamiang, Jl. Ir. H. Juanda No. 1, Karang Baru',
        email_resmi: 'pengadaan.bkpsdm@acehtamiangkab.go.id',
        telepon: '(0641) 333333',
        website: 'https://bkpsdm.acehtamiangkab.go.id'
      },
      {
        kode_opd: 'BKPSDM-SEKRETARIAT',
        nama_opd: 'Sekretariat BKPSDM Kabupaten Aceh Tamiang',
        singkatan: 'Sekretariat BKPSDM',
        deskripsi: 'Pelayanan persuratan, permohonan informasi PPID kepegawaian, dan konsultasi kode etik/disiplin ASN.',
        alamat: 'Komplek Perkantoran Pemkab Aceh Tamiang, Jl. Ir. H. Juanda No. 1, Karang Baru',
        email_resmi: 'bkpsdm@acehtamiangkab.go.id',
        telepon: '(0641) 333444',
        website: 'https://bkpsdm.acehtamiangkab.go.id'
      }
    ]);

    // 2. Seed Kategori Layanan Kepegawaian BKPSDM
    const kategoris = await KategoriLayanan.bulkCreate([
      {
        nama_kategori: 'Mutasi & Kenaikan Pangkat',
        slug: 'mutasi-kenaikan-pangkat',
        deskripsi: 'Kenaikan Pangkat Otomatis BKN, Mutasi Antar-Dinas/Instansi, Penyesuaian Ijazah, Ujian Dinas.',
        ikon: 'TrendingUp',
        urutan: 1
      },
      {
        nama_kategori: 'Pengembangan Kompetensi & Diklat',
        slug: 'pengembangan-kompetensi-diklat',
        deskripsi: 'Izin Belajar, Tugas Belajar, Pelatihan Kepemimpinan (PKP/PKA), Sertifikasi dan Bimtek Kepegawaian.',
        ikon: 'GraduationCap',
        urutan: 2
      },
      {
        nama_kategori: 'Pengadaan CASN & Status Pegawai',
        slug: 'pengadaan-casn-status-pegawai',
        deskripsi: 'Seleksi CPNS & PPPK, Penetapan NIP/NIPPPK, Karpeg/Karis/Karsu Digital, Pendataan Non-ASN.',
        ikon: 'Users',
        urutan: 3
      },
      {
        nama_kategori: 'Cuti, Disiplin & Pensiun',
        slug: 'cuti-disiplin-pensiun',
        deskripsi: 'Cuti Tahunan/Melahirkan/Sakit/CLTN, Layanan Pensiun BUP/Janda/Duda, Penegakan Disiplin ASN.',
        ikon: 'Clock',
        urutan: 4
      },
      {
        nama_kategori: 'Kinerja, TPP & Kesejahteraan',
        slug: 'kinerja-tpp-kesejahteraan',
        deskripsi: 'Sinkronisasi e-Kinerja BKN, Verifikasi Pembayaran TPP ASN, Tanda Kehormatan Satyalancana.',
        ikon: 'CheckCircle2',
        urutan: 5
      }
    ]);

    // 3. Seed Users
    const bidangMutasi = opds.find((o) => o.kode_opd === 'BKPSDM-MUTASI');
    const bidangBangkom = opds.find((o) => o.kode_opd === 'BKPSDM-BANGKOM');

    const users = await User.bulkCreate([
      {
        name: 'Administrator Utama BKPSDM Aceh Tamiang',
        email: 'admin.bkpsdm@acehtamiangkab.go.id',
        password: 'Password123!',
        role: 'SUPER_ADMIN'
      },
      {
        name: 'Admin CMS BKPSDM',
        email: 'admin@acehtamiangkab.go.id',
        password: 'admin123',
        role: 'SUPER_ADMIN'
      },
      {
        name: 'Redaktur & Editor Berita BKPSDM',
        email: 'editor.berita@acehtamiangkab.go.id',
        password: 'Password123!',
        role: 'EDITOR'
      },
      {
        name: 'Tim Verifikator SIASN BKN',
        email: 'verifikator.siasn@acehtamiangkab.go.id',
        password: 'Password123!',
        role: 'VERIFIKATOR'
      },
      {
        name: 'Petugas Pelayanan Mutasi & Pangkat',
        email: 'petugas.mutasi@acehtamiangkab.go.id',
        password: 'Password123!',
        role: 'ADMIN_OPD',
        opd_id: bidangMutasi.id
      },
      {
        name: 'Petugas Pelayanan Bangkom & Kinerja',
        email: 'petugas.bangkom@acehtamiangkab.go.id',
        password: 'Password123!',
        role: 'ADMIN_OPD',
        opd_id: bidangBangkom.id
      },
      {
        name: 'Ahmad Fauzi, S.STP (PNS Aceh Tamiang)',
        nik: '1116010101900001',
        email: 'asn.tamiang@gmail.com',
        phone: '081234567890',
        password: 'Password123!',
        role: 'WARGA'
      }
    ], { individualHooks: true });

    // 4. Seed Layanan Kepegawaian BKPSDM
    const katMutasi = kategoris.find((k) => k.slug === 'mutasi-kenaikan-pangkat');
    const katBangkom = kategoris.find((k) => k.slug === 'pengembangan-kompetensi-diklat');
    const katPengadaan = kategoris.find((k) => k.slug === 'pengadaan-casn-status-pegawai');
    const katCuti = kategoris.find((k) => k.slug === 'cuti-disiplin-pensiun');
    const katKinerja = kategoris.find((k) => k.slug === 'kinerja-tpp-kesejahteraan');

    const layanans = await Layanan.bulkCreate([
      {
        kode_layanan: 'BKPSDM-KP-01',
        nama_layanan: 'Usul Kenaikan Pangkat (KP) PNS Periode 6 Kali Setahun',
        slug: 'usul-kenaikan-pangkat-pns-periode-6-kali',
        opd_id: bidangMutasi.id,
        kategori_id: katMutasi.id,
        deskripsi: 'Layanan pemrosesan usulan Kenaikan Pangkat Reguler, Pilihan (Jabatan Fungsional/Struktural), dan Penyesuaian Ijazah yang terintegrasi langsung dengan SIASN BKN.',
        dasar_hukum: 'Peraturan BKN No. 4 Tahun 2023 tentang Periodisasi Kenaikan Pangkat PNS (Februari, April, Juni, Agustus, Oktober, Desember).',
        biaya: 'Gratis (Rp 0)',
        estimasi_waktu: '5 - 14 Hari Kerja',
        output_layanan: 'Surat Keputusan (SK) Kenaikan Pangkat Digital Bertandatangan Elektronik BKN',
        tipe_layanan: 'ONLINE_FULL',
        is_populer: true
      },
      {
        kode_layanan: 'BKPSDM-IBEL-02',
        nama_layanan: 'Penerbitan Surat Izin Belajar / Tugas Belajar ASN',
        slug: 'penerbitan-surat-izin-belajar-tugas-belajar',
        opd_id: bidangBangkom.id,
        kategori_id: katBangkom.id,
        deskripsi: 'Pemberian rekomendasi dan izin resmi peningkatan kualifikasi pendidikan formal (S1/S2/S3) bagi Pegawai Negeri Sipil di lingkungan Pemerintah Kabupaten Aceh Tamiang.',
        dasar_hukum: 'SE MenPAN-RB No. 28 Tahun 2021 tentang Pengembangan Kompetensi Pegawai Negeri Sipil Melalui Jalur Pendidikan.',
        biaya: 'Gratis (Rp 0)',
        estimasi_waktu: '3 - 7 Hari Kerja',
        output_layanan: 'Surat Keputusan Izin Belajar / Tugas Belajar Bupati Aceh Tamiang',
        tipe_layanan: 'ONLINE_FULL',
        is_populer: true
      },
      {
        kode_layanan: 'BKPSDM-CASN-03',
        nama_layanan: 'Pemberkasan & Penetapan NIP CASN / PPPK Formasi Daerah',
        slug: 'pemberkasan-penetapan-nip-casn-pppk',
        opd_id: opds.find((o) => o.kode_opd === 'BKPSDM-PENGADAAN').id,
        kategori_id: katPengadaan.id,
        deskripsi: 'Layanan verifikasi berkas digital kelulusan seleksi CPNS dan PPPK hingga penerbitan Pertimbangan Teknis (Pertek) BKN dan Surat Keputusan Pengangkatan.',
        dasar_hukum: 'PermenPAN-RB tentang Pengadaan Pegawai ASN dan Petunjuk Teknis BKN.',
        biaya: 'Gratis (Rp 0)',
        estimasi_waktu: '14 - 30 Hari Kerja',
        output_layanan: 'Surat Keputusan (SK) Pengangkatan CPNS/PPPK dan Petikan SK',
        tipe_layanan: 'ONLINE_FULL',
        is_populer: true
      },
      {
        kode_layanan: 'BKPSDM-PENSIUN-04',
        nama_layanan: 'Layanan Usul Pensiun BUP & Janda/Duda Terintegrasi SIASN',
        slug: 'usul-pensiun-bup-janda-duda-siasn',
        opd_id: opds.find((o) => o.kode_opd === 'BKPSDM-PENGADAAN').id,
        kategori_id: katCuti.id,
        deskripsi: 'Pengajuan pensiun Batas Usia Pensiun (BUP), Pensiun Atas Permintaan Sendiri (APS), dan Pensiun Janda/Duda/Yatim secara otomatis melalui sistem satu data kepegawaian.',
        dasar_hukum: 'UU No. 20 Tahun 2023 tentang Aparatur Sipil Negara & PP No. 11 Tahun 2017.',
        biaya: 'Gratis (Rp 0)',
        estimasi_waktu: '10 - 20 Hari Kerja',
        output_layanan: 'SK Pensiun BKN / Presiden & Surat Pengantar Pembayaran Tabungan Hari Tua (Taspen)',
        tipe_layanan: 'ONLINE_FULL',
        is_populer: true
      },
      {
        kode_layanan: 'BKPSDM-CUTI-05',
        nama_layanan: 'Persetujuan Cuti Tahunan, Cuti Sakit & Cuti Besar ASN',
        slug: 'persetujuan-cuti-tahunan-sakit-besar-asn',
        opd_id: opds.find((o) => o.kode_opd === 'BKPSDM-SEKRETARIAT').id,
        kategori_id: katCuti.id,
        deskripsi: 'Layanan verifikasi dan penerbitan izin cuti ASN di luar kewenangan kepala dinas definitif (Cuti Besar, Cuti Sakit menahun, Cuti Alasan Penting, Cuti di Luar Tanggungan Negara).',
        dasar_hukum: 'Peraturan BKN No. 24 Tahun 2017 jo. Peraturan BKN No. 7 Tahun 2021 tentang Tata Cara Pemberian Cuti PNS.',
        biaya: 'Gratis (Rp 0)',
        estimasi_waktu: '1 - 3 Hari Kerja',
        output_layanan: 'Surat Izin Cuti Resmi Kepala BKPSDM / Bupati Aceh Tamiang',
        tipe_layanan: 'ONLINE_FULL',
        is_populer: true
      },
      {
        kode_layanan: 'BKPSDM-KINERJA-06',
        nama_layanan: 'Sinkronisasi e-Kinerja BKN & Rekomendasi Pembayaran TPP',
        slug: 'sinkronisasi-e-kinerja-bkn-rekomendasi-tpp',
        opd_id: bidangBangkom.id,
        kategori_id: katKinerja.id,
        deskripsi: 'Layanan verifikasi capaian Sasaran Kinerja Pegawai (SKP) periodik dan tahunan untuk dasar penerbitan rekomendasi pencairan Tambahan Penghasilan Pegawai (TPP).',
        dasar_hukum: 'PermenPAN-RB No. 6 Tahun 2022 tentang Pengelolaan Kinerja Pegawai ASN & Perbup Aceh Tamiang tentang TPP ASN.',
        biaya: 'Gratis (Rp 0)',
        estimasi_waktu: '1 - 2 Hari Kerja',
        output_layanan: 'Surat Rekomendasi Kinerja & Rekapitulasi Pembayaran TPP Terverifikasi',
        tipe_layanan: 'ONLINE_FULL',
        is_populer: true
      }
    ]);

    // 5. Seed Syarat Layanan
    const kpLayanan = layanans.find((l) => l.kode_layanan === 'BKPSDM-KP-01');
    const ibelLayanan = layanans.find((l) => l.kode_layanan === 'BKPSDM-IBEL-02');

    await SyaratLayanan.bulkCreate([
      {
        layanan_id: kpLayanan.id,
        nama_syarat: 'Salinan SK Pangkat Terakhir (Legalisir / Scan Asli)',
        is_mandatory: true,
        tipe_file: 'pdf',
        max_size_mb: 2,
        urutan: 1
      },
      {
        layanan_id: kpLayanan.id,
        nama_syarat: 'Penilaian Kinerja Pegawai (SKP) 2 Tahun Terakhir Predikat Baik',
        is_mandatory: true,
        tipe_file: 'pdf',
        max_size_mb: 5,
        urutan: 2
      },
      {
        layanan_id: kpLayanan.id,
        nama_syarat: 'Surat Pengantar dari Kepala OPD / Instansi Pengusul',
        is_mandatory: true,
        tipe_file: 'pdf',
        max_size_mb: 2,
        urutan: 3
      },
      {
        layanan_id: ibelLayanan.id,
        nama_syarat: 'Surat Keterangan Diterima dari Perguruan Tinggi Terakreditasi',
        is_mandatory: true,
        tipe_file: 'pdf',
        max_size_mb: 3,
        urutan: 1
      },
      {
        layanan_id: ibelLayanan.id,
        nama_syarat: 'Jadwal Perkuliahan / Surat Pernyataan Tidak Mengganggu Jam Dinas',
        is_mandatory: true,
        tipe_file: 'pdf',
        max_size_mb: 2,
        urutan: 2
      }
    ]);

    // 6. Seed Kategori Berita BKPSDM
    const katBeritas = await KategoriBerita.bulkCreate([
      {
        nama_kategori: 'Pengumuman CASN',
        slug: 'pengumuman-casn',
        deskripsi: 'Informasi resmi seleksi penerimaan CPNS, PPPK Guru, PPPK Tenaga Kesehatan, dan Teknis.',
        urutan: 1
      },
      {
        nama_kategori: 'Mutasi & Kepangkatan',
        slug: 'mutasi-kepangkatan',
        deskripsi: 'Berita periodisasi kenaikan pangkat, uji penyesuaian ijazah, ujian dinas, dan perpindahan tugas.',
        urutan: 2
      },
      {
        nama_kategori: 'Bangkom & Diklat',
        slug: 'bangkom-diklat',
        deskripsi: 'Pelatihan kepemimpinan, bimbingan teknis, beasiswa tugas belajar, dan sertifikasi ASN.',
        urutan: 3
      },
      {
        nama_kategori: 'Kinerja & Disiplin ASN',
        slug: 'kinerja-disiplin-asn',
        deskripsi: 'Penerapan Merit System, regulasi e-Kinerja BKN, presensi, evaluasi berkala, dan penegakan PP 94/2021.',
        urutan: 4
      },
      {
        nama_kategori: 'Kesejahteraan & Pensiun',
        slug: 'kesejahteraan-pensiun',
        deskripsi: 'Pelayanan Taspen, SK Pensiun digital, TPP daerah, dan jaminan kesehatan/kesejahteraan ASN.',
        urutan: 5
      }
    ]);

    // 7. Seed Berita & Artikel SEO-Friendly BKPSDM Aceh Tamiang
    const adminUser = users[0];
    const katCasn = katBeritas.find((k) => k.slug === 'pengumuman-casn');
    const katMut = katBeritas.find((k) => k.slug === 'mutasi-kepangkatan');
    const katBang = katBeritas.find((k) => k.slug === 'bangkom-diklat');
    const katKin = katBeritas.find((k) => k.slug === 'kinerja-disiplin-asn');

    await Berita.bulkCreate([
      {
        title: 'BKPSDM Aceh Tamiang Terapkan Percepatan Kenaikan Pangkat 6 Periode Berbasis SIASN BKN',
        slug: 'bkpsdm-aceh-tamiang-terapkan-percepatan-kenaikan-pangkat-6-periode-siasn',
        excerpt: 'Pemerintah Kabupaten Aceh Tamiang melalui BKPSDM resmi memberlakukan layanan periodisasi Kenaikan Pangkat (KP) 6 kali dalam setahun secara digital terintegrasi BKN.',
        content: `
          <p><strong>Karang Baru, Humas BKPSDM</strong> — Pemerintah Kabupaten Aceh Tamiang melalui Badan Kepegawaian dan Pengembangan Sumber Daya Manusia (BKPSDM) secara resmi menerapkan kebijakan baru Badan Kepegawaian Negara (BKN) terkait periodisasi kenaikan pangkat Pegawai Negeri Sipil (PNS) menjadi enam periode dalam setahun.</p>
          <p>Kepala BKPSDM Kabupaten Aceh Tamiang menjelaskan bahwa kebijakan ini mengacu pada Peraturan BKN Nomor 4 Tahun 2023. Jika sebelumnya kenaikan pangkat hanya dilaksanakan dua kali setahun (April dan Oktober), kini dibuka pada bulan <strong>Februari, April, Juni, Agustus, Oktober, dan Desember</strong>.</p>
          <h3>Keuntungan Integrasi SIASN bagi ASN Aceh Tamiang</h3>
          <ul>
            <li><strong>Proses Lebih Cepat:</strong> Berkas langsung divalidasi secara elektronik tanpa perlu tumpukan fisik.</li>
            <li><strong>Transparansi Status:</strong> ASN dapat memantau pergerakan usulan mereka melalui aplikasi MyASN dan portal resmi BKPSDM.</li>
            <li><strong>Tanda Tangan Elektronik:</strong> SK Kenaikan Pangkat diterbitkan dengan sertifikat digital BKN dan ber-barcode resmi.</li>
          </ul>
          <p>Seluruh pengelola kepegawaian di masing-masing Organisasi Perangkat Daerah (OPD) diimbau untuk segera memperbarui data kinerja pegawai (SKP) pada e-Kinerja BKN sebelum batas waktu pengusulan setiap periodenya.</p>
        `,
        cover_image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80',
        cover_caption: 'Koordinasi Pelayanan Kenaikan Pangkat SIASN di Kantor BKPSDM Aceh Tamiang',
        kategori_id: katMut.id,
        author_id: adminUser.id,
        author_name: 'Bidang Mutasi & Status Kepegawaian BKPSDM',
        status: 'PUBLISHED',
        published_at: new Date(Date.now() - 2 * 3600 * 1000),
        views_count: 1248,
        is_featured: true,
        is_pinned: true,
        meta_title: 'Percepatan Kenaikan Pangkat 6 Periode SIASN BKN | BKPSDM Aceh Tamiang',
        meta_description: 'Informasi resmi pelaksanaan periodisasi Kenaikan Pangkat 6 kali setahun berbasis SIASN BKN di lingkungan Pemerintah Kabupaten Aceh Tamiang.',
        meta_keywords: 'Kenaikan Pangkat PNS Aceh Tamiang, SIASN BKN, Periodisasi KP 6 Kali, BKPSDM Aceh Tamiang, Karir ASN',
        read_time_minutes: 4
      },
      {
        title: 'Jadwal dan Ketentuan Pelaksanaan Ujian Dinas & Uji Penyesuaian Ijazah ASN Aceh Tamiang 2026',
        slug: 'jadwal-ketentuan-ujian-dinas-dan-penyesuaian-ijazah-asn-aceh-tamiang-2026',
        excerpt: 'BKPSDM Kabupaten Aceh Tamiang mengumumkan jadwal seleksi Ujian Dinas Tingkat I, Tingkat II, serta Ujian Penyesuaian Kenaikan Pangkat Ijazah (UPKPI) dengan sistem CAT.',
        content: `
          <p><strong>Karang Baru</strong> — Dalam rangka pengembangan kompetensi serta pembinaan karir Pegawai Negeri Sipil, BKPSDM Kabupaten Aceh Tamiang akan menyelenggarakan Ujian Dinas Tingkat I, Tingkat II, dan Penyesuaian Ijazah berbasis <em>Computer Assisted Test (CAT)</em>.</p>
          <p>Kegiatan ini merupakan syarat mutlak bagi PNS yang akan pindah golongan dari Golongan II ke Golongan III (Ujian Dinas Tk I), maupun dari Golongan III ke Golongan IV (Ujian Dinas Tk II), serta bagi PNS yang telah memperoleh ijazah sarjana/magister yang telah disetujui izin belajarnya.</p>
          <h3>Persyaratan Berkas Pendaftaran:</h3>
          <ol>
            <li>Surat Usulan dari Kepala Perangkat Daerah pengusul.</li>
            <li>Salinan SK Pangkat Terakhir dilegalisir.</li>
            <li>Salinan Ijazah dan Transkrip Nilai yang telah diakui oleh Kementerian / Lembaga terkait.</li>
            <li>Salinan Surat Izin Belajar / Tugas Belajar yang sah.</li>
            <li>Penilaian SKP 2 Tahun terakhir dengan nilai minimal 'Baik'.</li>
          </ol>
        `,
        cover_image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80',
        cover_caption: 'Laboratorium CAT BKPSDM Aceh Tamiang',
        kategori_id: katBang.id,
        author_id: adminUser.id,
        author_name: 'Bidang Pengembangan Kompetensi BKPSDM',
        status: 'PUBLISHED',
        published_at: new Date(Date.now() - 8 * 3600 * 1000),
        views_count: 856,
        is_featured: true,
        is_pinned: false,
        meta_title: 'Jadwal Ujian Dinas & Ujian Penyesuaian Ijazah ASN Aceh Tamiang 2026',
        meta_description: 'Informasi persyaratan, pendaftaran dan jadwal pelaksanaan Ujian Dinas Tk I/II dan PI bagi PNS Pemkab Aceh Tamiang.',
        meta_keywords: 'Ujian Dinas Aceh Tamiang, CAT BKPSDM, Ujian Penyesuaian Ijazah PNS, UPKPI 2026',
        read_time_minutes: 3
      },
      {
        title: 'Penetapan Usul NIP dan Jadwal Penyerahan SK PPPK Tenaga Guru dan Teknis Formasi Daerah',
        slug: 'penetapan-usul-nip-dan-penyerahan-sk-pppk-guru-teknis-aceh-tamiang',
        excerpt: 'Proses verifikasi berkas penetapan Nomor Induk Pegawai Pemerintah dengan Perjanjian Kerja (NI PPPK) memasuki tahap akhir di Kanreg XIII BKN Banda Aceh.',
        content: `
          <p><strong>Karang Baru</strong> — Kabar gembira bagi seluruh calon Pegawai Pemerintah dengan Perjanjian Kerja (PPPK) Kabupaten Aceh Tamiang. Berdasarkan hasil koordinasi dengan Kantor Regional XIII BKN, proses penerbitan Pertimbangan Teknis (Pertek) NI PPPK telah mencapai 98%.</p>
          <p>Pemerintah Kabupaten Aceh Tamiang menjadwalkan proses penyerahan Petikan Surat Keputusan (SK) dan penandatanganan Perjanjian Kerja secara serentak di hadapan Pj. Bupati Aceh Tamiang pada pertengahan bulan ini.</p>
        `,
        cover_image: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80',
        cover_caption: 'Proses Verifikasi Berkas CASN di Aula BKPSDM',
        kategori_id: katCasn.id,
        author_id: adminUser.id,
        author_name: 'Bidang Pengadaan & Informasi Kepegawaian',
        status: 'PUBLISHED',
        published_at: new Date(Date.now() - 24 * 3600 * 1000),
        views_count: 2140,
        is_featured: false,
        is_pinned: false,
        meta_title: 'Penetapan NIP & Penyerahan SK PPPK Kabupaten Aceh Tamiang',
        meta_description: 'Update penetapan Nomor Induk PPPK Tenaga Guru, Kesehatan dan Teknis Pemerintah Kabupaten Aceh Tamiang.',
        meta_keywords: 'NIP PPPK Aceh Tamiang, Penyerahan SK PPPK, CASN Aceh Tamiang, Honorer',
        read_time_minutes: 3
      },
      {
        title: 'Batas Akhir Sinkronisasi SKP & e-Kinerja BKN Triwulan Berjalan Bagi ASN Aceh Tamiang',
        slug: 'batas-akhir-sinkronisasi-skp-e-kinerja-bkn-triwulan-asn-aceh-tamiang',
        excerpt: 'BKPSDM mengimbau seluruh ASN dan Kepala OPD untuk menuntaskan penilaian kinerja berkala pada aplikasi e-Kinerja BKN sebelum tenggat waktu sistem ditutup.',
        content: `
          <p><strong>Karang Baru</strong> — Selaras dengan implementasi PermenPAN-RB Nomor 6 Tahun 2022 tentang Pengelolaan Kinerja Pegawai Aparatur Sipil Negara, seluruh ASN di lingkungan Pemerintah Kabupaten Aceh Tamiang diwajibkan melakukan input dan penetapan predikat kinerja triwulanan pada portal <em>e-Kinerja BKN</em>.</p>
          <p>Sinkronisasi ini menjadi dasar utama dalam verifikasi pencairan Tambahan Penghasilan Pegawai (TPP) serta syarat mutlak pengusulan Kenaikan Pangkat dan Layanan Mutasi.</p>
        `,
        cover_image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
        cover_caption: 'Dashboard Pengelolaan e-Kinerja BKN',
        kategori_id: katKin.id,
        author_id: adminUser.id,
        author_name: 'Bidang Bangkom & Kinerja ASN',
        status: 'PUBLISHED',
        published_at: new Date(Date.now() - 36 * 3600 * 1000),
        views_count: 642,
        is_featured: false,
        is_pinned: false,
        meta_title: 'Batas Sinkronisasi SKP e-Kinerja BKN ASN Kab. Aceh Tamiang',
        meta_description: 'Panduan dan batas waktu penilaian SKP triwulan e-Kinerja BKN untuk pencairan TPP ASN Aceh Tamiang.',
        meta_keywords: 'e-Kinerja BKN, SKP ASN Aceh Tamiang, TPP Pegawai, Penilaian Kinerja',
        read_time_minutes: 3
      }
    ]);

    // 8. Seed Agenda Kegiatan BKPSDM
    await Agenda.bulkCreate([
      {
        title: 'Bimbingan Teknis Penyusunan SKP & Penerapan Merit System ASN 2026',
        slug: 'bimtek-skp-merit-system-asn-2026',
        kategori: 'Pengembangan Kompetensi',
        deskripsi: 'Pelatihan implementasi evaluasi kinerja berkala pegawai, pemetaan talent pool, dan optimalisasi indeks profesionalitas ASN di lingkungan Pemkab Aceh Tamiang.',
        lokasi: 'Aula Gedung Utama BKPSDM Kabupaten Aceh Tamiang',
        tipe_pelaksanaan: 'OFFLINE',
        start_time: new Date('2026-10-12T08:00:00+07:00'),
        end_time: new Date('2026-10-14T16:00:00+07:00'),
        is_active: true
      },
      {
        title: 'Uji Kompetensi Kenaikan Jenjang Jabatan Fungsional Tertentu (JFT)',
        slug: 'uji-kompetensi-kenaikan-jenjang-jft-2026',
        kategori: 'Jabatan Fungsional',
        deskripsi: 'Pelaksanaan asesmen kompetensi teknis, manajerial, dan sosio-kultural bagi pejabat fungsional yang akan naik jenjang jabatan.',
        lokasi: 'Laboratorium CAT BKPSDM Aceh Tamiang',
        tipe_pelaksanaan: 'OFFLINE',
        start_time: new Date('2026-10-19T08:30:00+07:00'),
        end_time: new Date('2026-10-19T15:30:00+07:00'),
        is_active: true
      },
      {
        title: 'Sosialisasi Kebijakan Cuti & Disiplin ASN Berdasarkan PP 94/2021',
        slug: 'sosialisasi-kebijakan-cuti-disiplin-pp94-2021',
        kategori: 'Disiplin & Regulasi',
        deskripsi: 'Sosialisasi tata cara pengajuan cuti serta ketentuan penegakan disiplin dan kewajiban masuk kerja bagi aparatur sipil negara.',
        lokasi: 'Aula Utama Setdakab Aceh Tamiang',
        tipe_pelaksanaan: 'HYBRID',
        start_time: new Date('2026-10-22T09:00:00+07:00'),
        end_time: new Date('2026-10-22T12:00:00+07:00'),
        is_active: true
      }
    ]);

    logger.info('✅ Seeding Database BKPSDM Aceh Tamiang (MySQL + Berita + Layanan + Agenda + Redis Cache ready) Selesai!');
  } catch (error) {
    logger.error('❌ Gagal menjalankan seed data:', error);
  } finally {
    process.exit();
  }
}

seed();
