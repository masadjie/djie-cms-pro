const { minioClient, DEFAULT_BUCKET, ensureBucketExists } = require('../config/minio');
const { LampiranBerita, Berita } = require('../models');
const logger = require('../config/logger');

async function seedDefaultStorageFiles() {
  try {
    await ensureBucketExists(DEFAULT_BUCKET);

    const count = await LampiranBerita.count();
    if (count > 0) return;

    // Get first berita
    const firstBerita = await Berita.findOne({ order: [['id', 'ASC']] });

    const sampleFiles = [
      {
        nama_lampiran: 'Surat Edaran Bupati Aceh Tamiang tentang Periodisasi Kenaikan Pangkat 2026.pdf',
        original_filename: 'SE_Bupati_Kenaikan_Pangkat_6_Periode_2026.pdf',
        kategori_dokumen: 'SURAT_EDARAN',
        file_extension: 'pdf',
        file_type: 'application/pdf',
        file_size_bytes: 1485200, // 1.4 MB
        content_sample: 'SURAT EDARAN BUPATI ACEH TAMIANG TENTANG KENAIKAN PANGKAT PNS 6 PERIODE TAHUN 2026.'
      },
      {
        nama_lampiran: 'Petunjuk Teknis & Alur Usulan Integrasi SIASN BKPSDM Tamiang.pdf',
        original_filename: 'Juknis_Alur_SIASN_BKPSDM_2026.pdf',
        kategori_dokumen: 'JUKNIS',
        file_extension: 'pdf',
        file_type: 'application/pdf',
        file_size_bytes: 2840100, // 2.8 MB
        content_sample: 'PANDUAN PETUNJUK TEKNIS DAN ALUR USULAN LAYANAN INTEGRASI SIASN BKN KABUPATEN ACEH TAMIANG.'
      },
      {
        nama_lampiran: 'Formulir Daftar Riwayat Hidup & Kelengkapan Berkas Mutasi.docx',
        original_filename: 'Format_Kelengkapan_Berkas_Mutasi_PNS.docx',
        kategori_dokumen: 'FORMULIR',
        file_extension: 'docx',
        file_type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        file_size_bytes: 495000, // 495 KB
        content_sample: 'FORMAT BLANGKO LAMPIRAN KELENGKAPAN BERKAS MUTASI ANTAR INSTANSI BKPSDM ACEH TAMIANG.'
      },
      {
        nama_lampiran: 'Daftar Nominatif Penetapan Kebutuhan Formasi PPPK & CPNS.xlsx',
        original_filename: 'Rekapitulasi_Formasi_CASN_Aceh_Tamiang.xlsx',
        kategori_dokumen: 'SK',
        file_extension: 'xlsx',
        file_type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        file_size_bytes: 840000, // 840 KB
        content_sample: 'REKAPITULASI PENETAPAN KEBUTUHAN FORMASI PEGAWAI PEMERINTAH DENGAN PERJANJIAN KERJA.'
      }
    ];

    for (let i = 0; i < sampleFiles.length; i++) {
      const sf = sampleFiles[i];
      const objectName = `documents/${Date.now()}-${sf.original_filename}`;
      const buffer = Buffer.from(sf.content_sample, 'utf-8');

      try {
        await minioClient.putObject(DEFAULT_BUCKET, objectName, buffer, buffer.length, {
          'Content-Type': sf.file_type,
          'Original-Name': sf.original_filename
        });

        await LampiranBerita.create({
          berita_id: i === 0 && firstBerita ? firstBerita.id : null,
          nama_lampiran: sf.nama_lampiran,
          original_filename: sf.original_filename,
          file_path: objectName,
          file_url: `/api/v1/storage/download/${objectName}`,
          file_type: sf.file_type,
          file_size_bytes: sf.file_size_bytes,
          file_extension: sf.file_extension,
          kategori_dokumen: sf.kategori_dokumen,
          downloads_count: Math.floor(Math.random() * 45) + 12,
          bucket_name: DEFAULT_BUCKET,
          object_name: objectName
        });
      } catch (err) {
        logger.warn(`MinIO seed file warning: ${err.message}`);
      }
    }

    logger.info('✅ Default official documents seeded to MinIO Object Storage & database.');
  } catch (err) {
    logger.warn(`seedDefaultStorageFiles warning: ${err.message}`);
  }
}

module.exports = { seedDefaultStorageFiles };
