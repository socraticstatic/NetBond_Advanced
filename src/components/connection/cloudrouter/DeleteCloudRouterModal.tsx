import { useState } from 'react';
import { X, Trash2, AlertTriangle } from 'lucide-react';
import { Button } from '../../common/Button';

interface DeleteCloudRouterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  cloudRouterName: string;
}

export function DeleteCloudRouterModal({
  isOpen,
  onClose,
  onConfirm,
  cloudRouterName
}: DeleteCloudRouterModalProps) {
  const [confirmText, setConfirmText] = useState('');
  const expectedText = `delete ${cloudRouterName.toLowerCase()}`;
  const isConfirmEnabled = confirmText.toLowerCase() === expectedText;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-fw-base rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-fw-secondary flex items-center justify-between">
          <h3 className="text-lg font-medium text-fw-heading tracking-[-0.03em] flex items-center">
            Delete Cloud Router
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-fw-neutral transition-colors"
          >
            <X className="h-5 w-5 text-fw-bodyLight" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start mb-5">
            <div className="flex-shrink-0 bg-red-50 rounded-full p-2">
              <Trash2 className="h-6 w-6 text-fw-error" />
            </div>
            <div className="ml-4">
              <h4 className="text-base font-medium text-fw-heading tracking-[-0.03em]">Are you sure you want to delete this Cloud Router?</h4>
              <p className="mt-1 text-figma-base text-fw-bodyLight">
                Cloud Router <span className="font-semibold">{cloudRouterName}</span> will be permanently removed.
                This action cannot be undone.
              </p>
            </div>
          </div>

          {/* Warning */}
          <div className="bg-red-50 border border-fw-error rounded-lg p-4 mb-5">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-fw-error mt-0.5 mr-3 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-figma-base text-fw-error font-medium">
                  Network Impact Warning
                </p>
                <p className="text-figma-base text-fw-error mt-1">
                  Deleting this Cloud Router will remove all associated links and functions. This may cause network disruption for connected systems.
                </p>
              </div>
            </div>
          </div>

          {/* Confirmation input */}
          <div className="mb-4">
            <label className="block text-figma-base font-medium text-fw-body mb-1">
              To confirm, type <span className="font-mono font-semibold">delete {cloudRouterName.toLowerCase()}</span>
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="form-control"
              placeholder={`delete ${cloudRouterName.toLowerCase()}`}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-fw-wash border-t border-fw-secondary flex justify-end space-x-3">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            className="bg-fw-error hover:bg-fw-error focus:ring-fw-error"
            disabled={!isConfirmEnabled}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Delete Cloud Router
          </Button>
        </div>
      </div>
    </div>
  );
}
