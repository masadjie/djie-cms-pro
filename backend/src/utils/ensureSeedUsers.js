const bcrypt = require('bcryptjs');
const {
  User,
  MenuNavigasi,
  DokumenPublik,
  GaleriMedia,
  BannerSlider,
  AuditLog,
  Halaman,
  KategoriBerita,
  Berita,
  Agenda,
  PengaturanWeb,
  Testimoni
} = require('../models');
const logger = require('../config/logger');

/**
 * Seed Minimal Core Structure (Menus, Default Pages, Master Categories)
 */
async function seedCoreStructure() {
  try {
    // 1. Kategori Berita Dasar
    const defaultKategori = [
      { nama_kategori: 'Berita & Pengumuman', slug: 'berita-pengumuman', urutan: 1, is_active: true },
      { nama_kategori: 'Kegiatan Resmi', slug: 'kegiatan-resmi', urutan: 2, is_active: true },
      { nama_kategori: 'Layanan Publik', slug: 'layanan-publik', urutan: 3, is_active: true },
      { nama_kategori: 'Regulasi & Kebijakan', slug: 'regulasi-kebijakan', urutan: 4, is_active: true }
    ];

    for (const kat of defaultKategori) {
      await KategoriBerita.findOrCreate({
        where: { slug: kat.slug },
        defaults: kat
      });
    }

    // 2. Halaman Statis Inti (Profil, Visi Misi, Tupoksi, Maklumat)
    const defaultPages = [
      {
        title: 'Profil & Sejarah Instansi',
        slug: 'profil-instansi',
        excerpt: 'Profil resmi, struktur organisasi, dan sejarah pembentukan instansi.',
        content: '<h2>Tentang Instansi</h2><p>Selamat datang di portal resmi instansi kami. Kami berkomitmen untuk memberikan pelayanan publik yang prima, transparan, akuntabel, dan bebas dari pungutan liar demi kemajuan masyarakat.</p><h3>Visi</h3><p>Mewujudkan tata kelola pemerintahan yang profesional, transparan, dan berbasis teknologi digital terpadu.</p><h3>Misi</h3><ol><li>Meningkatkan kualitas pelayanan publik yang mudah, cepat, dan terjangkau.</li><li>Mendorong digitalisasi birokrasi dan keterbukaan informasi publik.</li><li>Meningkatkan integritas dan profesionalitas aparatur.</li></ol>',
        status: 'PUBLISHED'
      },
      {
        title: 'Visi, Misi & Rencana Strategis',
        slug: 'visi-misi',
        excerpt: 'Arah pembangunan dan sasaran strategis pelayanan publik pemerintah daerah.',
        content: '<h2>Visi & Misi</h2><p>Menjadi instansi terdepan dalam pelayanan masyarakat yang modern dan berintegritas.</p>',
        status: 'PUBLISHED'
      },
      {
        title: 'Tugas Pokok & Fungsi (Tupoksi)',
        slug: 'tupoksi',
        excerpt: 'Rincian tugas pokok, kewenangan, dan fungsi operasional kedinasan.',
        content: '<h2>Tupoksi Instansi</h2><p>Melaksanakan urusan pemerintahan dan tugas pembantuan sesuai bidang kewenangan yang ditetapkan perundang-undangan.</p>',
        status: 'PUBLISHED'
      },
      {
        title: 'Maklumat Pelayanan Publik',
        slug: 'maklumat-pelayanan',
        excerpt: 'Komitmen pelayanan prima dan standar etika pelayanan kepada seluruh masyarakat.',
        content: '<h2>Maklumat Pelayanan</h2><p>Dengan ini kami menyatakan sanggup menyelenggarakan pelayanan sesuai standar pelayanan yang telah ditetapkan dan siap menerima sanksi apabila tidak menepati janji.</p>',
        status: 'PUBLISHED'
      }
    ];

    for (const p of defaultPages) {
      await Halaman.findOrCreate({
        where: { slug: p.slug },
        defaults: p
      });
    }

    // 3. Menu Navigasi Standar Pemerintahan
    const existingMenuCount = await MenuNavigasi.count();
    if (existingMenuCount === 0) {
      const coreMenus = [
        { label: 'Beranda', url: '/', tipe: 'LINK', icon: 'Home', urutan: 1, is_active: true },
        { label: 'Berita & Publikasi', url: '/berita', tipe: 'LINK', icon: 'Newspaper', urutan: 2, is_active: true },
        { label: 'Katalog Layanan', url: '/katalog', tipe: 'LINK', icon: 'Building2', urutan: 3, is_active: true },
        { label: 'Galeri & Dokumentasi', url: '/galeri', tipe: 'LINK', icon: 'ImageIcon', urutan: 4, is_active: true },
        { label: 'Profil Instansi', url: '/page/profil-instansi', tipe: 'LINK', icon: 'Info', urutan: 5, is_active: true }
      ];
      await MenuNavigasi.bulkCreate(coreMenus);
    }

    // 4. Pengaturan Tampilan & Kontak Minimal
    const defaultSettings = [
      { key_name: 'cms_is_installed', value: 'true', kategori_setting: 'UMUM' },
      { key_name: 'contact_phone', value: '(021) 1234567' },
      { key_name: 'social_whatsapp', value: '08123456789' },
      { key_name: 'show_whatsapp', value: 'true' }
    ];

    for (const s of defaultSettings) {
      await PengaturanWeb.upsert(s);
    }

    logger.info('✅ Struktur inti portal Djie CMS Pro berhasil disiapkan.');
  } catch (err) {
    logger.error('Error in seedCoreStructure:', err);
    throw err;
  }
}

/**
 * Seed Sample / Dummy Demo Data (Berita, Agenda, Dokumen, Banner, Testimoni)
 */
async function seedDummyData() {
  try {
    const adminUser = await User.findOne({ where: { role: 'SUPER_ADMIN' } });
    const authorName = adminUser?.name || 'Redaksi Portal Resmi';

    // 1. Dummy Berita
    const katUmum = await KategoriBerita.findOne();
    const katId = katUmum?.id || 1;

    const dummyBerita = [
      {
        title: 'Lorem Ipsum Dolor Sit Amet Consectetur Adipiscing Elit',
        slug: 'lorem-ipsum-dolor-sit-amet',
        excerpt: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.',
        content: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p><p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>',
        cover_image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80',
        cover_caption: 'Lorem ipsum ilustrasi berita utama',
        kategori_id: katId,
        kategori_ids: [katId],
        author_name: 'John Doe',
        status: 'PUBLISHED',
        published_at: new Date(),
        is_featured: true,
        is_pinned: true,
        read_time_minutes: 5,
        views_count: 340
      },
      {
        title: 'Vestibulum Ante Ipsum Primis In Faucibus Orci Luctus',
        slug: 'vestibulum-ante-ipsum-primis',
        excerpt: 'Ultrices posuere cubilia curae integer lacinia ante vel nisl convallis, sed bibendum sem facilisis.',
        content: '<p>Curabitur sodales ligula in libero. Sed dignissim lacinia nunc. Curabitur tortor. Pellentesque nibh. Aenean quam. In scelerisque sem at dolor. Maecenas mattis. Sed convallis tristique sem.</p><p>Proin ut ligula vel nunc egestas porttitor. Morbi lectus risus, iaculis vel, suscipit quis, luctus non, massa. Fusce ac turpis quis ligula lacinia aliquet.</p>',
        cover_image: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80',
        cover_caption: 'Vestibulum ante ipsum primis',
        kategori_id: katId,
        kategori_ids: [katId],
        author_name: 'Jane Smith',
        status: 'PUBLISHED',
        published_at: new Date(),
        is_featured: true,
        is_pinned: false,
        read_time_minutes: 3,
        views_count: 215
      },
      {
        title: 'Cras Aliquet Varius Magna At Tempus Suspendisse Potenti',
        slug: 'cras-aliquet-varius-magna',
        excerpt: 'Nam elementum dolor vitae nisl imperdiet, id facilisis nunc scelerisque. Fusce pulvinar commodo libero.',
        content: '<p>Mauris ipsum. Nulla metus metus, ullamcorper vel, tincidunt sed, euismod in, nibh. Quisque volutpat condimentum velit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.</p><p>Nam nec ante. Sed lacinia, urna non tincidunt mattis, tortor neque adipiscing diam, a cursus ipsum ante quis turpis. Nulla facilisi. Ut fringilla.</p>',
        cover_image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
        cover_caption: 'Cras aliquet varius magna',
        kategori_id: katId,
        kategori_ids: [katId],
        author_name: 'Alex Johnson',
        status: 'PUBLISHED',
        published_at: new Date(),
        is_featured: false,
        is_pinned: false,
        read_time_minutes: 4,
        views_count: 180
      },
      {
        title: 'Aenean Vulputate Eleifend Tellus Aenean Leo Ligula',
        slug: 'aenean-vulputate-eleifend-tellus',
        excerpt: 'Porttitor eu consequat vitae eleifend ac enim. Aliquam lorem ante dapibus in viverra quis feugiat a tellus.',
        content: '<p>Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus.</p><p>Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum.</p>',
        cover_image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80',
        cover_caption: 'Aenean vulputate eleifend',
        kategori_id: katId,
        kategori_ids: [katId],
        author_name: 'John Doe',
        status: 'PUBLISHED',
        published_at: new Date(),
        is_featured: false,
        is_pinned: false,
        read_time_minutes: 2,
        views_count: 95
      }
    ];

    for (const b of dummyBerita) {
      await Berita.findOrCreate({
        where: { slug: b.slug },
        defaults: b
      });
    }

    // 2. Dummy Banner Slider
    const bannerCount = await BannerSlider.count();
    if (bannerCount === 0) {
      await BannerSlider.bulkCreate([
        {
          judul: 'Lorem Ipsum Dolor Sit Amet',
          subjudul: 'Consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore',
          gambar_url: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1920&q=85',
          target_url: '/berita',
          tipe: 'HERO_SLIDER',
          urutan: 1,
          is_active: true
        },
        {
          judul: 'Sed Ut Perspiciatis Unde Omnis',
          subjudul: 'Iste natus error sit voluptatem accusantium doloremque laudantium',
          gambar_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=85',
          target_url: '/katalog',
          tipe: 'HERO_SLIDER',
          urutan: 2,
          is_active: true
        },
        // Promo / Highlight Banners
        {
          judul: 'At Vero Eos Et Accusamus',
          subjudul: 'Nam libero tempore cum soluta nobis est eligendi optio cumque nihil.',
          gambar_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=85',
          target_url: '/katalog',
          tipe: 'PROMO_BANNER',
          urutan: 1,
          is_active: true
        },
        {
          judul: 'Temporibus Autem Quibusdam',
          subjudul: 'Et aut officiis debitis aut rerum necessitatibus saepe eveniet.',
          gambar_url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=85',
          target_url: '/berita',
          tipe: 'PROMO_BANNER',
          urutan: 2,
          is_active: true
        },
        {
          judul: 'Itaque Earum Rerum Hic Tenetur',
          subjudul: 'A sapiente delectus ut aut reiciendis voluptatibus maiores alias.',
          gambar_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=85',
          target_url: '/page/profil-instansi',
          tipe: 'PROMO_BANNER',
          urutan: 3,
          is_active: true
        }
      ]);
    }

    // 3. Dummy Dokumen Publik
    const docCount = await DokumenPublik.count();
    if (docCount === 0) {
      await DokumenPublik.bulkCreate([
        {
          judul: 'Standar Operasional Prosedur (SOP) Pelayanan',
          slug: 'sop-pelayanan-2026',
          nomor_surat: '001/SOP/2026',
          tahun: 2026,
          kategori: 'PANDUAN_SIKEPO',
          file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          file_size_kb: 120,
          download_count: 34,
          status: 'PUBLISHED'
        },
        {
          judul: 'Rencana Strategis (Renstra) Pelayanan Publik',
          slug: 'renstra-pelayanan-publik-2026',
          nomor_surat: '002/RENSTRA/2026',
          tahun: 2026,
          kategori: 'LAPORAN_KINERJA',
          file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          file_size_kb: 450,
          download_count: 56,
          status: 'PUBLISHED'
        }
      ]);
    }

    // 4. Dummy Galeri Media
    const galeriCount = await GaleriMedia.count();
    if (galeriCount === 0) {
      await GaleriMedia.bulkCreate([
        {
          judul: 'Dokumentasi Rapat Koordinasi Layanan',
          tipe: 'FOTO',
          media_url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
          album: 'Kegiatan Publikasi',
          caption: 'Pertemuan koordinasi peningkatan mutu standar pelayanan.',
          status: 'PUBLISHED'
        },
        {
          judul: 'Sosialisasi Digitalisasi Dokumen',
          tipe: 'FOTO',
          media_url: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80',
          album: 'Kegiatan Publikasi',
          caption: 'Penyuluhan pemanfaatan platform digital.',
          status: 'PUBLISHED'
        }
      ]);
    }

    // 5. Dummy Agenda
    const agendaCount = await Agenda.count();
    if (agendaCount === 0) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(9, 0, 0, 0);

      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 5);
      nextWeek.setHours(13, 30, 0, 0);

      await Agenda.bulkCreate([
        {
          title: 'Sosialisasi Penerapan Standar Layanan Elektronik',
          slug: 'sosialisasi-standar-layanan-elektronik',
          kategori: 'Sosialisasi',
          deskripsi: 'Pertemuan teknis pengenalan fitur portal publik bagi staf dan masyarakat.',
          lokasi: 'Aula Pertemuan Utama',
          tipe_pelaksanaan: 'OFFLINE',
          start_time: tomorrow,
          end_time: new Date(tomorrow.getTime() + 3 * 3600000),
          is_active: true
        },
        {
          title: 'Forum Konsultasi Publik Evaluasi Standar Pelayanan',
          slug: 'forum-konsultasi-publik-evaluasi-standar-pelayanan',
          kategori: 'Konsultasi Publik',
          deskripsi: 'Evaluasi kepuasan masyarakat terhadap kemudahan akses layanan informasi.',
          lokasi: 'Ruang Rapat Virtual (Zoom)',
          tipe_pelaksanaan: 'ONLINE',
          start_time: nextWeek,
          end_time: new Date(nextWeek.getTime() + 2 * 3600000),
          is_active: true
        }
      ]);
    }

    // 6. Dummy Testimoni
    const testiCount = await Testimoni.count();
    if (testiCount === 0) {
      await Testimoni.bulkCreate([
        {
          nama: 'Budi Santoso',
          jabatan: 'Masyarakat / Pengguna Layanan',
          instansi: 'Warga',
          avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
          rating: 5,
          pesan: 'Portal layanan publik ini sangat intuitif dan mudah dipahami. Pengumuman resmi dan berkas regulasi dapat diunduh langsung tanpa hambatan.',
          urutan: 1,
          is_active: true
        },
        {
          nama: 'Dewi Lestari',
          jabatan: 'Pegawai Organisasi Publik',
          instansi: 'Instansi Pengguna',
          avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
          rating: 5,
          pesan: 'Informasi agenda dan berita selalu mutakhir. Tampilan visualnya sangat bersih, modern, dan sangat nyaman dibuka lewat handphone.',
          urutan: 2,
          is_active: true
        }
      ]);
    }

    logger.info('✅ Sample / Dummy data Djie CMS Pro berhasil di-generate.');
  } catch (err) {
    logger.error('Error in seedDummyData:', err);
    throw err;
  }
}

module.exports = {
  seedCoreStructure,
  seedDummyData
};
