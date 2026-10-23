/**
 * Video Embed and Platform Helper for YouTube, Instagram, and TikTok
 * Support for Djie CMS Pro 2026
 */

/**
 * Detect video platform from URL
 * @param {string} url
 * @returns {'YOUTUBE' | 'INSTAGRAM' | 'TIKTOK' | null}
 */
export const detectVideoPlatform = (url) => {
  if (!url) return null;
  const cleanUrl = url.trim().toLowerCase();
  if (cleanUrl.includes('youtube.com') || cleanUrl.includes('youtu.be')) return 'YOUTUBE';
  if (cleanUrl.includes('instagram.com') || cleanUrl.includes('instagr.am')) return 'INSTAGRAM';
  if (cleanUrl.includes('tiktok.com')) return 'TIKTOK';
  return null;
};

/**
 * Extract YouTube ID
 * @param {string} url
 */
export const extractYouTubeId = (url) => {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
};

/**
 * Extract Instagram shortcode / Reel ID
 * e.g. instagram.com/p/C3abcde123/ or instagram.com/reel/C3abcde123/
 * @param {string} url
 */
export const extractInstagramId = (url) => {
  if (!url) return null;
  const match = url.match(/instagram\.com\/(?:p|reel|tv)\/([A-Za-z0-9_-]+)/);
  return match ? match[1] : null;
};

/**
 * Extract TikTok video ID
 * e.g. tiktok.com/@user/video/7123456789012345678 or tiktok.com/v/7123456789012345678
 * @param {string} url
 */
export const extractTikTokId = (url) => {
  if (!url) return null;
  const match = url.match(/tiktok\.com\/(?:@[\w.-]+\/video\/|v\/|embed\/v2\/)(\d+)/);
  if (match) return match[1];
  // Direct numeric ID fallback
  const directDigits = url.match(/\/(\d{15,22})/);
  return directDigits ? directDigits[1] : null;
};

/**
 * Generate normalized embed URL for iframe
 * @param {string} url
 * @param {string} platform ('YOUTUBE' | 'INSTAGRAM' | 'TIKTOK')
 */
export const getEmbedUrl = (url, platform) => {
  if (!url) return '';
  const detected = platform || detectVideoPlatform(url);

  if (detected === 'YOUTUBE') {
    const id = extractYouTubeId(url);
    return id ? `https://www.youtube-nocookie.com/embed/${id}` : url;
  }

  if (detected === 'INSTAGRAM') {
    const id = extractInstagramId(url);
    if (id) {
      return `https://www.instagram.com/p/${id}/embed/captioned/`;
    }
    // If already an embed url
    if (url.includes('/embed')) return url;
    const clean = url.split('?')[0].replace(/\/+$/, '');
    return `${clean}/embed/captioned/`;
  }

  if (detected === 'TIKTOK') {
    const id = extractTikTokId(url);
    if (id) {
      return `https://www.tiktok.com/embed/v2/${id}`;
    }
    return url;
  }

  return url;
};

/**
 * Generate default or high-res thumbnail for video if available
 * @param {string} url
 * @param {string} platform
 */
export const getVideoThumbnail = (url, platform) => {
  const detected = platform || detectVideoPlatform(url);

  if (detected === 'YOUTUBE') {
    const id = extractYouTubeId(url);
    return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
  }

  // Instagram and TikTok dynamic embeds render natively in iframe
  return null;
};
