/**
 * Preset Custom HTML Content Blocks for BKPSDM / RSUD Visual Editor
 */

export const getCustomBlockHtml = (type) => {
  switch (type) {
    case 'callout_info':
      return `
        <div style="background-color: #ecfdf5; border-left: 4px solid #059669; padding: 1rem; border-radius: 0.5rem; margin: 1.25rem 0;">
          <p style="margin: 0; color: #064e3b; font-weight: 700; font-size: 0.95rem;">PENGUMUMAN PENTING:</p>
          <p style="margin: 0.35rem 0 0 0; color: #065f46; font-size: 0.875rem;">Pastikan seluruh dokumen persyaratan telah berformat PDF dengan ukuran maksimal 2MB sebelum diunggah ke portal resmi.</p>
        </div>
        <p><br></p>
      `;

    case 'callout_warning':
      return `
        <div style="background-color: #fffbeb; border-left: 4px solid #d97706; padding: 1rem; border-radius: 0.5rem; margin: 1.25rem 0;">
          <p style="margin: 0; color: #78350f; font-weight: 700; font-size: 0.95rem;">PERHATIAN / CATATAN KHUSUS:</p>
          <p style="margin: 0.35rem 0 0 0; color: #92400e; font-size: 0.875rem;">Pelayanan kepegawaian BKPSDM Kabupaten Aceh Tamiang bebas dari segala bentuk pungutan liar (Gratis 100%).</p>
        </div>
        <p><br></p>
      `;

    case 'callout_danger':
      return `
        <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 1rem; border-radius: 0.5rem; margin: 1.25rem 0;">
          <p style="margin: 0; color: #991b1b; font-weight: 700; font-size: 0.95rem;">LARANGAN / SANKSI TEGAS:</p>
          <p style="margin: 0.35rem 0 0 0; color: #b91c1c; font-size: 0.875rem;">Setiap bentuk pemalsuan berkas atau kecurangan administrasi kepegawaian akan ditindak tegas sesuai ketentuan PP Nomor 94 Tahun 2021.</p>
        </div>
        <p><br></p>
      `;

    case 'callout_tip':
      return `
        <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 1rem; border-radius: 0.5rem; margin: 1.25rem 0;">
          <p style="margin: 0; color: #1e40af; font-weight: 700; font-size: 0.95rem;">TIPS & PETUNJUK TEKNIS:</p>
          <p style="margin: 0.35rem 0 0 0; color: #1d4ed8; font-size: 0.875rem;">Gunakan browser Google Chrome versi terbaru dan koneksi internet stabil saat mengakses sistem layanan kepegawaian SIASN.</p>
        </div>
        <p><br></p>
      `;

    case 'table':
      return `
        <table style="width: 100%; border-collapse: collapse; margin: 1.25rem 0; font-size: 0.875rem; border: 1px solid #e2e8f0;">
          <thead>
            <tr style="background-color: #064e3b; color: #ffffff;">
              <th style="padding: 0.75rem 1rem; border: 1px solid #cbd5e1; text-align: left;">No</th>
              <th style="padding: 0.75rem 1rem; border: 1px solid #cbd5e1; text-align: left;">Tahapan Pelaksanaan</th>
              <th style="padding: 0.75rem 1rem; border: 1px solid #cbd5e1; text-align: left;">Jadwal / Periode</th>
              <th style="padding: 0.75rem 1rem; border: 1px solid #cbd5e1; text-align: left;">Keterangan</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 0.65rem 1rem; border: 1px solid #e2e8f0;">1</td>
              <td style="padding: 0.65rem 1rem; border: 1px solid #e2e8f0; font-weight: 600;">Pendaftaran & Verifikasi Berkas</td>
              <td style="padding: 0.65rem 1rem; border: 1px solid #e2e8f0;">1 - 15 Bulan Berjalan</td>
              <td style="padding: 0.65rem 1rem; border: 1px solid #e2e8f0;">Online melalui SIASN</td>
            </tr>
            <tr style="background-color: #f8fafc;">
              <td style="padding: 0.65rem 1rem; border: 1px solid #e2e8f0;">2</td>
              <td style="padding: 0.65rem 1rem; border: 1px solid #e2e8f0; font-weight: 600;">Penerbitan Persetujuan Teknis (Pertek)</td>
              <td style="padding: 0.65rem 1rem; border: 1px solid #e2e8f0;">20 - 25 Bulan Berjalan</td>
              <td style="padding: 0.65rem 1rem; border: 1px solid #e2e8f0;">BKN Kantor Regional XIII</td>
            </tr>
          </tbody>
        </table>
        <p><br></p>
      `;

    case 'quote':
      return `
        <blockquote style="border-left: 4px solid #f59e0b; padding-left: 1rem; margin: 1.25rem 0; font-style: italic; color: #334155; background: #fffdf5; padding: 0.75rem 1rem; border-radius: 0 0.5rem 0.5rem 0;">
          "Transformasi digital manajemen ASN di Aceh Tamiang adalah komitmen nyata mewujudkan birokrasi yang bersih, transparan, dan berkeadilan."
        </blockquote>
        <p><br></p>
      `;

    case 'hr':
      return `<hr style="border: 0; height: 1px; background: #e2e8f0; margin: 2rem 0;"><p><br></p>`;

    case 'lead_paragraph':
      return `<p style="font-size: 1.15rem; line-height: 1.75; color: #1e293b; font-weight: 500; margin: 1rem 0;"><strong>Aceh Tamiang, BKPSDM</strong> &ndash; Ketik pembuka inti berita di sini...</p><p><br></p>`;

    default:
      return '';
  }
};
