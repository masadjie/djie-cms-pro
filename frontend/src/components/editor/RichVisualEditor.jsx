import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Eye } from 'lucide-react';
import api from '../../services/api';
import { compressImageToWebP } from '../../utils/imageCompressor';
import MediaLibraryModal from '../admin/MediaLibraryModal';
import EditorHeaderToolbar from './EditorHeaderToolbar';
import ImageResizerToolbar from './ImageResizerToolbar';
import { getCustomBlockHtml } from './EditorCustomBlocks';

export default function RichVisualEditor({
  value = '',
  onChange,
  placeholder = 'Mulai ketik naskah artikel, pengumuman, atau panduan kedinasan di sini...',
  minHeight = '420px'
}) {
  const [mode, setMode] = useState('visual'); // 'visual' | 'code' | 'preview'
  const [isFullscreen, setIsFullscreen] = useState(false);
  const visualRef = useRef(null);
  const isUpdatingFromProp = useRef(false);
  const [selectedImg, setSelectedImg] = useState(null);

  // Sync value to visual editable div when not active or switching
  useEffect(() => {
    if (visualRef.current && mode === 'visual') {
      if (visualRef.current.innerHTML !== value) {
        isUpdatingFromProp.current = true;
        visualRef.current.innerHTML = value || '';
        isUpdatingFromProp.current = false;
      }
    }
  }, [value, mode]);

  // Handle content change in Visual Mode
  const handleVisualInput = useCallback(() => {
    if (isUpdatingFromProp.current) return;
    if (visualRef.current) {
      const html = visualRef.current.innerHTML;
      if (onChange) {
        onChange(html);
      }
    }
  }, [onChange]);

  // Click or Double Click on image inside editor to select it for resizing
  useEffect(() => {
    const handleEditorClick = (e) => {
      if (e.target && e.target.tagName === 'IMG') {
        setSelectedImg(e.target);
      } else if (!e.target.closest('.image-resizer-toolbar')) {
        setSelectedImg(null);
      }
    };

    const handleEditorDblClick = (e) => {
      if (e.target && e.target.tagName === 'IMG') {
        setSelectedImg(e.target);
        // Toggle width between 100% and 50%
        const currentW = e.target.style.width;
        const newW = currentW === '100%' ? '50%' : '100%';
        e.target.style.width = newW;
        e.target.style.maxWidth = '100%';
        e.target.style.height = 'auto';
        e.target.style.display = 'block';
        e.target.style.marginLeft = 'auto';
        e.target.style.marginRight = 'auto';
        handleVisualInput();
      }
    };

    const el = visualRef.current;
    if (el) {
      el.addEventListener('click', handleEditorClick);
      el.addEventListener('dblclick', handleEditorDblClick);
      return () => {
        el.removeEventListener('click', handleEditorClick);
        el.removeEventListener('dblclick', handleEditorDblClick);
      };
    }
  }, [mode, handleVisualInput]);

  // Image resize action helper
  const setImageSize = (widthPercent, align = null) => {
    if (!selectedImg) return;
    selectedImg.style.width = widthPercent;
    selectedImg.style.maxWidth = '100%';
    selectedImg.style.height = 'auto';
    selectedImg.style.display = 'block';
    selectedImg.removeAttribute('width');
    selectedImg.removeAttribute('height');

    if (align === 'center') {
      selectedImg.style.marginLeft = 'auto';
      selectedImg.style.marginRight = 'auto';
    } else if (align === 'left') {
      selectedImg.style.marginLeft = '0';
      selectedImg.style.marginRight = 'auto';
    } else if (align === 'right') {
      selectedImg.style.marginLeft = 'auto';
      selectedImg.style.marginRight = '0';
    }

    handleVisualInput();
  };

  // Clean HTML from Microsoft Word / Office (Strip Times New Roman, Calibri, font-family, font-size)
  const cleanWordHtml = (html) => {
    let clean = html;
    // Remove Word conditional comments, xml, and style tags
    clean = clean.replace(/<!--\[if[\s\S]*?<!\[endif\]-->/gi, '');
    clean = clean.replace(/<style[\s\S]*?<\/style>/gi, '');
    clean = clean.replace(/<xml[\s\S]*?<\/xml>/gi, '');
    clean = clean.replace(/<\/?o:[^>]*>/gi, '');
    clean = clean.replace(/<\/?v:[^>]*>/gi, '');
    clean = clean.replace(/<\/?w:[^>]*>/gi, '');
    clean = clean.replace(/<\/?m:[^>]*>/gi, '');
    clean = clean.replace(/class="?Mso[a-zA-Z0-9]*"?/gi, '');
    clean = clean.replace(/style="[^"]*mso-[^"]*"/gi, '');
    // Hapus inline font-family bawaan Word agar selalu mengikuti font website
    clean = clean.replace(/font-family:[^;"]*;?/gi, '');
    clean = clean.replace(/font-size:[^;"]*;?/gi, '');
    clean = clean.replace(/line-height:[^;"]*;?/gi, '');
    // Bersihkan tag font jadul
    clean = clean.replace(/<\/?font[^>]*>/gi, '');
    // Bersihkan style kosong
    clean = clean.replace(/style="\s*"/gi, '');
    return clean;
  };

  // Handle Paste Event (prioritizing rich text from Word and standalone images)
  const handlePaste = async (e) => {
    const clipboardData = e.clipboardData;
    if (!clipboardData) return;

    const html = clipboardData.getData('text/html');
    const plainText = clipboardData.getData('text/plain');

    // Case 1: Pasting rich HTML (from Microsoft Word, Google Docs, or Websites)
    if (html && html.trim().length > 0) {
      // If Word pasted HTML contains actual text, insert cleaned HTML
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const textOnly = doc.body.textContent || '';
      
      // If there is meaningful text or mixed content, insert clean HTML text directly
      if (textOnly.trim().length > 0 || doc.body.querySelectorAll('table, p, h1, h2, h3, h4, ul, ol').length > 0) {
        e.preventDefault();
        const cleaned = cleanWordHtml(html);
        document.execCommand('insertHTML', false, cleaned);
        handleVisualInput();
        return;
      }
    }

    // Case 2: Pasting pure image (e.g. screenshot or copied image file without text)
    const items = clipboardData.items;
    let imageFile = null;
    if (items && (!plainText || plainText.trim().length === 0)) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type && items[i].type.startsWith('image/')) {
          imageFile = items[i].getAsFile();
          break;
        }
      }
    }

    if (imageFile) {
      e.preventDefault();
      try {
        setEditorImageUploading(true);
        const compressed = await compressImageToWebP(imageFile, { maxWidth: 1920, maxHeight: 1080, quality: 0.85 });
        const formData = new FormData();
        formData.append('file', compressed);
        formData.append('nama_lampiran', `Pasted Image: ${compressed.name || 'word_paste.webp'}`);
        formData.append('kategori_dokumen', 'LAMPIRAN_RESMI');

        const res = await api.post('/storage/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        const uploadedUrl = res?.data?.file_url;
        if (uploadedUrl && visualRef.current) {
          const imgHtml = `
            <figure style="margin: 1.5rem 0; text-align: center;">
              <img src="${uploadedUrl}" alt="Pasted Image" style="width: 100%; max-width: 100%; height: auto; border-radius: 0.75rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); margin: 0 auto; display: block;" />
            </figure>
            <p><br></p>
          `;
          document.execCommand('insertHTML', false, imgHtml);
          handleVisualInput();
        }
      } catch (err) {
        console.error('Failed to upload pasted image to MinIO:', err);
      } finally {
        setEditorImageUploading(false);
      }
      return;
    }

    // Case 3: Fallback plain text paste
    if (!html && plainText) {
      e.preventDefault();
      const paragraphs = plainText
        .split(/\r?\n\r?\n/)
        .map((p) => `<p>${p.replace(/\r?\n/g, '<br>')}</p>`)
        .join('');
      document.execCommand('insertHTML', false, paragraphs);
      handleVisualInput();
    }
  };

  // Execute formatting command in Visual Mode
  const execCmd = (command, val = null) => {
    if (mode !== 'visual') {
      setMode('visual');
      setTimeout(() => {
        if (visualRef.current) {
          visualRef.current.focus();
          document.execCommand(command, false, val);
          handleVisualInput();
        }
      }, 50);
      return;
    }

    if (visualRef.current) {
      visualRef.current.focus();
      document.execCommand(command, false, val);
      handleVisualInput();
    }
  };

  // Insert Custom Blocks
  const insertCustomBlock = (type) => {
    if (mode !== 'visual') setMode('visual');

    setTimeout(() => {
      if (!visualRef.current) return;
      visualRef.current.focus();

      const blockHtml = getCustomBlockHtml(type);
      if (blockHtml) {
        document.execCommand('insertHTML', false, blockHtml);
        handleVisualInput();
      }
    }, 50);
  };

  // Direct Image Upload from Device to MinIO
  const editorImageInputRef = useRef(null);
  const [editorImageUploading, setEditorImageUploading] = useState(false);

  const handleUploadImageFile = async (e) => {
    let file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Tipe file tidak diizinkan. Harap pilih berkas gambar (JPG, PNG, WebP).');
      if (editorImageInputRef.current) editorImageInputRef.current.value = '';
      return;
    }

    setEditorImageUploading(true);
    try {
      file = await compressImageToWebP(file, { maxWidth: 1920, maxHeight: 1080, quality: 0.85 });
      const formData = new FormData();
      formData.append('file', file);
      formData.append('nama_lampiran', `Konten Berita: ${file.name}`);
      formData.append('kategori_dokumen', 'LAMPIRAN_RESMI');

      const res = await api.post('/storage/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const uploadedUrl = res?.data?.file_url;
      if (uploadedUrl) {
        if (mode !== 'visual') setMode('visual');
        setTimeout(() => {
          if (visualRef.current) {
            visualRef.current.focus();
            const imgHtml = `
              <figure style="margin: 1.75rem 0; text-align: center;">
                <img src="${uploadedUrl}" alt="${file.name}" style="max-width: 100%; width: 100%; height: auto; border-radius: 0.75rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); margin: 0 auto; display: block;" />
                <figcaption style="font-size: 0.75rem; color: #64748b; margin-top: 0.5rem; font-style: italic;">Dokumentasi Humas BKPSDM Aceh Tamiang</figcaption>
              </figure>
              <p><br></p>
            `;
            document.execCommand('insertHTML', false, imgHtml);
            handleVisualInput();
          }
        }, 50);
      }
    } catch (err) {
      alert(err?.message || 'Gagal mengunggah foto ke konten.');
    } finally {
      setEditorImageUploading(false);
      if (editorImageInputRef.current) editorImageInputRef.current.value = '';
    }
  };

  // Media Library Modal state for Visual Editor
  const [editorMediaModalOpen, setEditorMediaModalOpen] = useState(false);

  // Insert Image from MinIO Media Library
  const handleSelectFromMediaLibrary = (ids, files) => {
    if (files && files.length > 0) {
      if (mode !== 'visual') setMode('visual');
      setTimeout(() => {
        if (visualRef.current) {
          visualRef.current.focus();
          files.forEach((file) => {
            const isPdf = file.file_extension?.toLowerCase() === 'pdf' || file.file_url?.toLowerCase().endsWith('.pdf');
            let blockHtml = '';

            if (isPdf) {
              blockHtml = `
                <div style="margin: 1.5rem 0; border: 1px solid #cbd5e1; border-radius: 0.75rem; overflow: hidden; background: #f8fafc; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
                  <div style="background: #064e3b; color: white; padding: 0.65rem 1rem; display: flex; align-items: center; justify-content: space-between; font-size: 0.85rem; font-weight: 700;">
                    <span>Pratinjau Dokumen PDF: ${file.nama_lampiran || file.original_filename}</span>
                    <a href="${file.file_url}" target="_blank" rel="noopener noreferrer" style="color: #fef08a; text-decoration: underline; font-size: 0.75rem;">Unduh PDF &rarr;</a>
                  </div>
                  <iframe src="${file.file_url}#toolbar=0" style="width: 100%; height: 500px; border: none; display: block;" title="${file.nama_lampiran}"></iframe>
                </div>
                <p><br></p>
              `;
            } else {
              blockHtml = `
                <figure style="margin: 1.75rem 0; text-align: center;">
                  <img src="${file.file_url}" alt="${file.nama_lampiran || 'Dokumentasi'}" style="max-width: 100%; width: 100%; height: auto; border-radius: 0.75rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); margin: 0 auto; display: block;" />
                  <figcaption style="font-size: 0.75rem; color: #64748b; margin-top: 0.5rem; font-style: italic;">${file.nama_lampiran || 'Dokumentasi Humas BKPSDM Aceh Tamiang'}</figcaption>
                </figure>
                <p><br></p>
              `;
            }

            document.execCommand('insertHTML', false, blockHtml);
          });
          handleVisualInput();
        }
      }, 50);
    }
    setEditorMediaModalOpen(false);
  };

  // Embed YouTube Video Helper
  const handleInsertYouTube = () => {
    const rawUrl = prompt('Masukkan URL Video YouTube (contoh: https://www.youtube.com/watch?v=dQw4w9WgXcQ atau https://youtu.be/...):');
    if (!rawUrl) return;

    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = rawUrl.trim().match(regExp);

    if (match && match[2].length === 11) {
      const videoId = match[2];
      const embedHtml = `
        <div style="margin: 1.75rem 0; position: relative; width: 100%; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 0.75rem; box-shadow: 0 4px 10px rgba(0,0,0,0.15);">
          <iframe 
            src="https://www.youtube.com/embed/${videoId}" 
            title="Video YouTube" 
            style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            allowfullscreen>
          </iframe>
        </div>
        <p><br></p>
      `;
      execCmd('insertHTML', embedHtml);
    } else {
      alert('Format URL YouTube tidak valid. Harap gunakan link video YouTube resmi.');
    }
  };

  // Embed PDF Document via URL
  const handleInsertPdf = () => {
    const pdfUrl = prompt('Masukkan URL Berkas PDF (https://...):');
    if (!pdfUrl) return;

    const pdfHtml = `
      <div style="margin: 1.5rem 0; border: 1px solid #cbd5e1; border-radius: 0.75rem; overflow: hidden; background: #f8fafc; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
        <div style="background: #064e3b; color: white; padding: 0.65rem 1rem; display: flex; align-items: center; justify-content: space-between; font-size: 0.85rem; font-weight: 700;">
          <span>Pratinjau Dokumen PDF Resmi</span>
          <a href="${pdfUrl}" target="_blank" rel="noopener noreferrer" style="color: #fef08a; text-decoration: underline; font-size: 0.75rem;">Buka / Unduh Dokumen &rarr;</a>
        </div>
        <iframe src="${pdfUrl}#toolbar=0" style="width: 100%; height: 500px; border: none; display: block;" title="Dokumen PDF"></iframe>
      </div>
      <p><br></p>
    `;

    execCmd('insertHTML', pdfHtml);
  };

  // Insert Image Dialog (via URL)
  const handleInsertImage = () => {
    const url = prompt('Masukkan URL Gambar (https://...):');
    if (url) {
      const imgHtml = `
        <figure style="margin: 1.5rem 0; text-align: center;">
          <img src="${url}" alt="Ilustrasi Berita" style="max-width: 100%; width: 100%; height: auto; border-radius: 0.75rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); margin: 0 auto; display: block;" />
          <figcaption style="font-size: 0.75rem; color: #64748b; margin-top: 0.5rem; font-style: italic;">Dokumentasi Humas BKPSDM Aceh Tamiang</figcaption>
        </figure>
        <p><br></p>
      `;
      execCmd('insertHTML', imgHtml);
    }
  };

  // Insert Link Dialog
  const handleInsertLink = () => {
    const url = prompt('Masukkan URL Link tujuan (contoh: https://bkpsdm.acehtamiangkab.go.id/layanan):');
    if (url) {
      execCmd('createLink', url);
    }
  };

  // Content Statistics
  const textContent = (value || '').replace(/<[^>]*>?/gm, ' ').trim();
  const wordCount = textContent.length > 0 ? textContent.split(/\s+/).length : 0;
  const charCount = textContent.length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className={`bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col transition-all ${
      isFullscreen ? 'fixed inset-4 z-50 shadow-2xl' : 'relative'
    }`}>
      
      {/* 1. TOP TOOLBAR BAR (Modular Component) */}
      <EditorHeaderToolbar
        mode={mode}
        setMode={setMode}
        execCmd={execCmd}
        insertCustomBlock={insertCustomBlock}
        handleInsertLink={handleInsertLink}
        editorImageInputRef={editorImageInputRef}
        handleUploadImageFile={handleUploadImageFile}
        editorImageUploading={editorImageUploading}
        setEditorMediaModalOpen={setEditorMediaModalOpen}
        handleInsertImage={handleInsertImage}
        handleInsertYouTube={handleInsertYouTube}
        handleInsertPdf={handleInsertPdf}
        wordCount={wordCount}
        charCount={charCount}
        readingTime={readingTime}
        isFullscreen={isFullscreen}
        setIsFullscreen={setIsFullscreen}
      />

      {/* 2. EDITOR CANVAS AREA */}
      <div className="flex-1 bg-white relative flex flex-col">
        
        {/* MODE 1: VISUAL (WYSIWYG) */}
        {mode === 'visual' && (
          <div className="relative flex-1 flex flex-col">
            {/* FLOATING IMAGE RESIZE & ALIGNMENT TOOLBAR */}
            <ImageResizerToolbar
              selectedImg={selectedImg}
              setImageSize={setImageSize}
              onDelete={() => {
                const fig = selectedImg.closest('figure');
                if (fig) {
                  fig.remove();
                } else {
                  selectedImg.remove();
                }
                setSelectedImg(null);
                handleVisualInput();
              }}
            />

            <div
              ref={visualRef}
              contentEditable
              onInput={handleVisualInput}
              onBlur={handleVisualInput}
              onPaste={handlePaste}
              style={{ minHeight }}
              data-placeholder={placeholder}
              className="w-full p-4 sm:p-8 lg:p-10 focus:outline-none prose prose-slate max-w-none text-slate-800 text-sm sm:text-[15px] leading-relaxed overflow-y-auto selection:bg-emerald-100 selection:text-emerald-900 empty:before:content-[attr(data-placeholder)] empty:before:text-slate-300 empty:before:pointer-events-none [&_img]:cursor-pointer [&_img]:rounded-xl [&_img]:transition-all [&_img:hover]:ring-2 [&_img:hover]:ring-emerald-500 [&_img]:max-w-full"
            />
          </div>
        )}

        {/* MODE 2: CODE (RAW HTML) TEXTAREA */}
        {mode === 'code' && (
          <div className="flex-1 flex flex-col">
            <div className="bg-slate-900 text-slate-400 px-4 py-2 text-[11px] font-mono flex items-center justify-between border-b border-slate-800">
              <span>Mode Editor HTML Mentah (Source Code)</span>
              <span className="text-emerald-400 font-bold">&lt;/&gt; HTML5 Standard</span>
            </div>
            <textarea
              style={{ minHeight }}
              value={value}
              onChange={(e) => onChange && onChange(e.target.value)}
              placeholder="<p>Tuliskan kode HTML di sini...</p>"
              className="w-full flex-1 p-6 sm:p-8 font-mono text-xs leading-relaxed bg-slate-950 text-emerald-400 focus:outline-none resize-y selection:bg-emerald-800 selection:text-white"
            />
          </div>
        )}

        {/* MODE 3: LIVE PREVIEW */}
        {mode === 'preview' && (
          <div className="p-6 sm:p-10 overflow-y-auto" style={{ minHeight }}>
            <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-4 mb-6 flex items-center gap-2.5 text-xs text-emerald-900 font-semibold">
              <Eye className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Pratinjau visual langsung naskah artikel sebagaimana akan tampil kepada masyarakat.</span>
            </div>

            <article 
              className="prose prose-slate max-w-none text-slate-800 text-[15px] leading-relaxed space-y-4"
              dangerouslySetInnerHTML={{ __html: value || '<p class="text-slate-300 italic">Belum ada konten yang ditulis...</p>' }}
            />
          </div>
        )}

      </div>

      {/* MEDIA LIBRARY MODAL FOR VISUAL EDITOR */}
      <MediaLibraryModal
        isOpen={editorMediaModalOpen}
        onClose={() => setEditorMediaModalOpen(false)}
        title="Sisipkan Media dari Pustaka MinIO"
        confirmText="Sisipkan ke Naskah"
        onSelectFiles={handleSelectFromMediaLibrary}
      />

    </div>
  );
}
