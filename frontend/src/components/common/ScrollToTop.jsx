import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop Component
 * Ensures every route navigation or slug change instantly resets the window
 * scroll position to the top of the viewport (top: 0, left: 0), preventing
 * the browser from maintaining the previous page's scroll position or scrolling
 * to the bottom when navigating to article details.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Immediate scroll reset
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });

    // Fallback for documentElement/body on mobile browsers (Safari/Chrome mobile)
    if (document.documentElement) {
      document.documentElement.scrollTop = 0;
    }
    if (document.body) {
      document.body.scrollTop = 0;
    }
  }, [pathname]);

  return null;
}
