import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { 
  AlertTriangle, 
  Trash2, 
  Info, 
  CheckCircle2, 
  X, 
  AlertCircle 
} from 'lucide-react';

const ConfirmDialogContext = createContext(null);

export function ConfirmDialogProvider({ children }) {
  const [dialogState, setDialogState] = useState({
    isOpen: false,
    isAlertOnly: false,
    title: 'Konfirmasi Tindakan',
    message: '',
    confirmText: 'Ya, Lanjutkan',
    cancelText: 'Batal',
    variant: 'danger', // 'danger' | 'warning' | 'info' | 'success'
    resolve: null
  });

  const confirm = useCallback((options) => {
    return new Promise((resolve) => {
      if (typeof options === 'string') {
        options = { message: options };
      }

      setDialogState({
        isOpen: true,
        isAlertOnly: false,
        title: options.title || (options.variant === 'warning' ? 'Peringatan' : options.variant === 'info' ? 'Informasi' : 'Konfirmasi Tindakan'),
        message: options.message || 'Apakah Anda yakin ingin melanjutkan tindakan ini?',
        confirmText: options.confirmText || (options.variant === 'danger' ? 'Ya, Hapus' : 'Ya, Lanjutkan'),
        cancelText: options.cancelText || 'Batal',
        variant: options.variant || 'danger',
        resolve
      });
    });
  }, []);

  const showAlert = useCallback((options) => {
    return new Promise((resolve) => {
      if (typeof options === 'string') {
        options = { message: options };
      }

      const variant = options.variant || 'warning';
      setDialogState({
        isOpen: true,
        isAlertOnly: true,
        title: options.title || (variant === 'danger' ? 'Terjadi Kesalahan' : variant === 'success' ? 'Berhasil' : 'Perhatian'),
        message: options.message || '',
        confirmText: options.confirmText || 'Mengerti',
        cancelText: '',
        variant,
        resolve
      });
    });
  }, []);

  // Globally override window.alert so all existing and future alert calls render the modern modal dialog
  useEffect(() => {
    const originalAlert = window.alert;
    window.alert = (message) => {
      const msgStr = typeof message === 'string' ? message : JSON.stringify(message);
      const isErr = msgStr.toLowerCase().includes('gagal') || msgStr.toLowerCase().includes('error') || msgStr.toLowerCase().includes('tidak diizinkan') || msgStr.toLowerCase().includes('tidak valid');
      showAlert({
        title: isErr ? 'Pemberitahuan Sistem' : 'Informasi',
        message: msgStr,
        variant: isErr ? 'danger' : 'warning',
        confirmText: 'Tutup'
      });
    };

    return () => {
      window.alert = originalAlert;
    };
  }, [showAlert]);

  const handleClose = (result) => {
    if (dialogState.resolve) {
      dialogState.resolve(result);
    }
    setDialogState((prev) => ({ ...prev, isOpen: false }));
  };

  const getVariantStyles = () => {
    switch (dialogState.variant) {
      case 'warning':
        return {
          iconBg: 'bg-amber-50 text-amber-600 border-amber-200',
          confirmBtn: 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/20',
          IconComponent: AlertTriangle
        };
      case 'info':
        return {
          iconBg: 'bg-blue-50 text-blue-600 border-blue-200',
          confirmBtn: 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20',
          IconComponent: Info
        };
      case 'success':
        return {
          iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-200',
          confirmBtn: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20',
          IconComponent: CheckCircle2
        };
      case 'danger':
      default:
        return {
          iconBg: 'bg-red-50 text-red-600 border-red-200',
          confirmBtn: 'bg-red-600 hover:bg-red-700 text-white shadow-red-600/20',
          IconComponent: dialogState.isAlertOnly ? AlertCircle : Trash2
        };
    }
  };

  const { iconBg, confirmBtn, IconComponent } = getVariantStyles();

  return (
    <ConfirmDialogContext.Provider value={{ confirm, alert: showAlert }}>
      {children}

      {dialogState.isOpen && (
        <div 
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => handleClose(false)}
        >
          <div 
            className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 sm:p-7 relative scale-in-center animate-in zoom-in-95 duration-200 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            {/* Top Accent Gradient Line */}
            <div className={`absolute top-0 left-0 right-0 h-1.5 ${
              dialogState.variant === 'danger' ? 'bg-gradient-to-r from-red-500 to-rose-600' :
              dialogState.variant === 'warning' ? 'bg-gradient-to-r from-amber-500 to-yellow-500' :
              dialogState.variant === 'success' ? 'bg-gradient-to-r from-emerald-500 to-teal-500' :
              'bg-gradient-to-r from-blue-500 to-indigo-500'
            }`} />

            {/* Close Button */}
            <button
              onClick={() => handleClose(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-4 pt-1">
              {/* Icon Container */}
              <div className={`p-3.5 rounded-2xl border flex-shrink-0 shadow-xs ${iconBg}`}>
                <IconComponent className="w-6 h-6" />
              </div>

              {/* Text Content */}
              <div className="flex-1 min-w-0 pt-0.5">
                <h3 className="text-base font-bold text-slate-900 tracking-tight leading-snug">
                  {dialogState.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed font-normal whitespace-pre-line break-words">
                  {dialogState.message}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 sm:mt-7 flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              {!dialogState.isAlertOnly && (
                <button
                  type="button"
                  onClick={() => handleClose(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
                >
                  {dialogState.cancelText}
                </button>
              )}
              <button
                type="button"
                autoFocus
                onClick={() => handleClose(true)}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md active:scale-95 cursor-pointer ${
                  dialogState.isAlertOnly ? 'w-full text-center ' + confirmBtn : confirmBtn
                }`}
              >
                {dialogState.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmDialogContext.Provider>
  );
}

export function useConfirm() {
  const context = useContext(ConfirmDialogContext);
  if (!context) {
    throw new Error('useConfirm must be used within a ConfirmDialogProvider');
  }
  return context.confirm;
}

export function useCustomAlert() {
  const context = useContext(ConfirmDialogContext);
  if (!context) {
    throw new Error('useCustomAlert must be used within a ConfirmDialogProvider');
  }
  return context.alert;
}
