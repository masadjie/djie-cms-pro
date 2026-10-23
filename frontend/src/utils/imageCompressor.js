/**
 * High-Performance Client-Side Image Compression & WebP Converter
 * Converts JPEG/PNG/BMP to modern optimized WebP format with resizing
 */

export const compressImageToWebP = async (file, options = {}) => {
  const {
    maxWidth = 1280,
    maxHeight = 800,
    quality = 0.78,
    outputType = 'image/webp'
  } = options;

  // If not an image, return original file unchanged
  if (!file || !file.type.startsWith('image/')) {
    return file;
  }

  // If already a small SVG or GIF animation, preserve original
  if (file.type === 'image/svg+xml' || file.type === 'image/gif') {
    return file;
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate aspect ratio constraint
        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        // High quality bicubic resampling
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file); // fallback to original
              return;
            }

            // Create new WebP File object
            const originalBaseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
            const newFileName = `${originalBaseName.replace(/[^a-zA-Z0-9_-]/g, '_')}.webp`;
            
            const compressedFile = new File([blob], newFileName, {
              type: outputType,
              lastModified: Date.now()
            });

            // If compressed is somehow larger than original, return original
            if (compressedFile.size > file.size && file.type === 'image/webp') {
              resolve(file);
            } else {
              resolve(compressedFile);
            }
          },
          outputType,
          quality
        );
      };

      img.onerror = () => {
        resolve(file); // fallback on error
      };
    };

    reader.onerror = () => {
      resolve(file);
    };
  });
};

/**
 * Convert Base64 data URL to File object
 */
export const base64ToFile = (dataUrl, filename = 'pasted_image.webp') => {
  try {
    const arr = dataUrl.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : 'image/png';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  } catch (err) {
    console.error('Failed to parse base64 to file:', err);
    return null;
  }
};

/**
 * Format bytes to readable string (e.g. 1.25 MB)
 */
export const formatBytes = (bytes, decimals = 2) => {
  if (!bytes || bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

