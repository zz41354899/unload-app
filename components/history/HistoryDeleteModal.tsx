import React from 'react';
import { AlertCircle } from 'lucide-react';

export interface HistoryDeleteModalProps {
  t: (key: string) => string;
  deleteId: string | null;
  onCancel: () => void;
  onConfirm: () => void;
}

export const HistoryDeleteModal: React.FC<HistoryDeleteModalProps> = ({
  t,
  deleteId,
  onCancel,
  onConfirm,
}) => {
  if (!deleteId) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-sm w-full transform transition-all scale-100">
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-6 h-6 text-red-500" />
          </div>
          <h3 className="text-xl font-bold text-text mb-2">{t('history.modal.title')}</h3>
          <p className="text-gray-500 mb-8 text-sm leading-relaxed">
            {t('history.modal.message')}
          </p>
          <div className="flex w-full gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-colors text-sm"
            >
              {t('history.modal.cancel')}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20 text-sm"
            >
              {t('history.modal.confirm')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
