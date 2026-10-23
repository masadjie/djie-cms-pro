import React, { useState, useEffect } from 'react';

/**
 * TopProgressBar: Non-intrusive, sleek top loading bar 
 * Styled specifically with BKPSDM Aceh Tamiang Emerald & Gold branding.
 * Does NOT block or cover the screen.
 */
export default function TopProgressBar() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(25);

  useEffect(() => {
    const timer1 = setTimeout(() => setProgress(65), 120);
    const timer2 = setTimeout(() => setProgress(90), 280);
    const timer3 = setTimeout(() => {
      setProgress(100);
      setTimeout(() => setLoading(false), 200);
    }, 450);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  if (!loading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[99999] pointer-events-none h-[3px] bg-transparent">
      <div 
        className="h-full bg-gradient-to-r from-amber-400 via-emerald-600 to-teal-400 transition-all duration-200 ease-out shadow-[0_0_8px_rgba(16,185,129,0.7)]"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
