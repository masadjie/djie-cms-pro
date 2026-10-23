import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { 
  Share2, 
  Check, 
  MessageCircle, 
  Facebook, 
  Send, 
  Linkedin, 
  Copy, 
  Sparkles,
  TrendingUp,
  Activity
} from 'lucide-react';

export default function SocialShareButtons({ title, url, slug }) {
  const [copied, setCopied] = useState(false);
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

  // Fetch live sharing analytics
  const { data: analyticsData, refetch } = useQuery({
    queryKey: ['shareAnalytics', slug],
    queryFn: async () => {
      if (!slug) return { totalShares: 0, breakdown: {} };
      try {
        const res = await api.get(`/berita/${slug}/share-analytics`);
        return res?.data || res || { totalShares: 0, breakdown: {} };
      } catch (e) {
        return { totalShares: 0, breakdown: {} };
      }
    },
    enabled: Boolean(slug)
  });

  const totalShares = analyticsData?.totalShares || 0;
  const breakdown = analyticsData?.breakdown || {};

  // Track sharing event to backend analytics
  const trackShare = async (platform) => {
    if (!slug) return;
    try {
      await api.post(`/berita/${slug}/share`, { platform });
      refetch();
    } catch (err) {
      // silent fallback
    }
  };

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      trackShare('copy_link');
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const shareWhatsapp = () => {
    trackShare('whatsapp');
    const text = encodeURIComponent(`*${title}*\n\nBaca selengkapnya di Portal Resmi BKPSDM Aceh Tamiang:\n${shareUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const shareFacebook = () => {
    trackShare('facebook');
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const shareTwitter = () => {
    trackShare('twitter');
    const text = encodeURIComponent(`${title} - BKPSDM Aceh Tamiang`);
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${text}`, '_blank');
  };

  const shareTelegram = () => {
    trackShare('telegram');
    const text = encodeURIComponent(`${title}\n${shareUrl}`);
    window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${text}`, '_blank');
  };

  const shareLinkedin = () => {
    trackShare('linkedin');
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full bg-slate-50/80 p-3 sm:p-4 rounded-2xl border border-slate-200/80">
      
      {/* Left: Share Analytics Counter */}
      <div className="flex items-center gap-2.5 shrink-0">
        <div className="p-2 bg-emerald-800 text-amber-300 rounded-xl shadow-2xs">
          <Share2 className="w-4 h-4" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-black text-slate-900">Bagikan Artikel</span>
            <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              {totalShares}x Dibagikan
            </span>
          </div>
          <p className="text-[10px] text-slate-500">
            Sebarkan informasi resmi ke rekan ASN & masyarakat
          </p>
        </div>
      </div>

      {/* Right: Comprehensive & Interactive Social Share Buttons */}
      <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-auto">
        
        {/* WhatsApp */}
        <button
          type="button"
          onClick={shareWhatsapp}
          className="px-3 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] active:scale-95 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          title="Bagikan ke WhatsApp"
        >
          <MessageCircle className="w-3.5 h-3.5 fill-white" />
          <span>WhatsApp</span>
          {breakdown.whatsapp > 0 && (
            <span className="text-[9px] bg-white/25 px-1.5 py-0.2 rounded-full font-mono">
              {breakdown.whatsapp}
            </span>
          )}
        </button>

        {/* Telegram */}
        <button
          type="button"
          onClick={shareTelegram}
          className="px-3 py-1.5 rounded-xl bg-[#0088cc] hover:bg-[#0077b5] active:scale-95 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          title="Bagikan ke Telegram"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Telegram</span>
          {breakdown.telegram > 0 && (
            <span className="text-[9px] bg-white/25 px-1.5 py-0.2 rounded-full font-mono">
              {breakdown.telegram}
            </span>
          )}
        </button>

        {/* Facebook */}
        <button
          type="button"
          onClick={shareFacebook}
          className="px-3 py-1.5 rounded-xl bg-[#1877F2] hover:bg-[#166fe5] active:scale-95 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          title="Bagikan ke Facebook"
        >
          <Facebook className="w-3.5 h-3.5 fill-white" />
          <span>Facebook</span>
          {breakdown.facebook > 0 && (
            <span className="text-[9px] bg-white/25 px-1.5 py-0.2 rounded-full font-mono">
              {breakdown.facebook}
            </span>
          )}
        </button>

        {/* X / Twitter */}
        <button
          type="button"
          onClick={shareTwitter}
          className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-black active:scale-95 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          title="Bagikan ke X (Twitter)"
        >
          <span className="font-mono text-xs font-black">𝕏</span>
          <span>Twitter</span>
          {breakdown.twitter > 0 && (
            <span className="text-[9px] bg-white/25 px-1.5 py-0.2 rounded-full font-mono">
              {breakdown.twitter}
            </span>
          )}
        </button>

        {/* LinkedIn */}
        <button
          type="button"
          onClick={shareLinkedin}
          className="px-2.5 py-1.5 rounded-xl bg-[#0A66C2] hover:bg-[#095196] active:scale-95 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer"
          title="Bagikan ke LinkedIn"
        >
          <Linkedin className="w-3.5 h-3.5 fill-white" />
        </button>

        {/* Salin Tautan */}
        <button
          type="button"
          onClick={handleCopy}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 cursor-pointer ${
            copied
              ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
              : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
          }`}
          title="Salin Tautan Berita"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-amber-300" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
          <span>{copied ? 'Tersalin!' : 'Salin Tautan'}</span>
          {breakdown.copy_link > 0 && (
            <span className="text-[9px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded-full font-mono">
              {breakdown.copy_link}
            </span>
          )}
        </button>

      </div>

    </div>
  );
}
