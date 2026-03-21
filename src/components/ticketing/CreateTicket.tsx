import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, X, Check, Paperclip, Trash2 } from 'lucide-react';
import { Button } from '../common/Button';

interface AttachmentFile {
  name: string;
  size: string;
  type: string;
}

export function CreateTicket() {
  const navigate = useNavigate();
  const [contact, setContact] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [attachments, setAttachments] = useState<AttachmentFile[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!contact.trim()) newErrors.contact = 'Contact is required';
    if (!category) newErrors.category = 'Category is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      setSubmitted(true);
    }
  };

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newAttachments: AttachmentFile[] = Array.from(files).map(f => ({
      name: f.name,
      size: `${(f.size / 1024).toFixed(1)} KB`,
      type: f.name.split('.').pop()?.toUpperCase() || 'FILE',
    }));
    setAttachments(prev => [...prev, ...newAttachments]);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    const newAttachments: AttachmentFile[] = Array.from(files).map(f => ({
      name: f.name,
      size: `${(f.size / 1024).toFixed(1)} KB`,
      type: f.name.split('.').pop()?.toUpperCase() || 'FILE',
    }));
    setAttachments(prev => [...prev, ...newAttachments]);
  }, []);

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  if (submitted) {
    return (
      <div className="max-w-md mx-auto py-16 flex flex-col items-center text-center">
        <div className="w-[317px] h-[252px] bg-fw-neutral rounded-2xl mb-8 flex items-center justify-center">
          <Check className="h-16 w-16 text-fw-bodyLight" />
        </div>
        <h2 className="text-figma-xl font-medium text-fw-heading tracking-[-0.03em] mb-2">
          Your ticket was created!
        </h2>
        <p className="text-figma-base font-medium text-fw-body tracking-[-0.03em] mb-8">
          Our support will get in contact with you soon.
        </p>
        <div className="flex gap-3 w-full max-w-[317px]">
          <Button
            variant="outline"
            onClick={() => navigate('/tickets')}
            className="flex-1"
          >
            View tickets
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setSubmitted(false);
              setContact('');
              setCategory('');
              setDescription('');
              setAttachments([]);
            }}
            className="flex-1"
          >
            Create another
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Back link */}
      <button
        onClick={() => navigate('/tickets')}
        className="inline-flex items-center gap-1 text-figma-base font-medium text-fw-link tracking-[-0.03em] mb-6 hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to tickets
      </button>

      <div className="max-w-[400px]">
        {/* Form fields */}
        <div className="space-y-5">
          {/* Contact */}
          <div>
            <label className="block text-figma-base font-medium text-fw-heading tracking-[-0.03em] mb-2">
              Your contact
            </label>
            <input
              type="text"
              value={contact}
              onChange={e => { setContact(e.target.value); setErrors(prev => ({ ...prev, contact: '' })); }}
              className={`w-full h-9 px-3 rounded-lg border bg-fw-base text-figma-base text-fw-heading tracking-[-0.03em] focus:outline-none focus:ring-1 focus:ring-fw-active ${
                errors.contact ? 'border-fw-error' : 'border-fw-secondary'
              }`}
              placeholder="Enter your contact info"
            />
            {errors.contact && (
              <p className="mt-1 text-figma-sm text-fw-error tracking-[-0.03em]">{errors.contact}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-figma-base font-medium text-fw-heading tracking-[-0.03em] mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={e => { setCategory(e.target.value); setErrors(prev => ({ ...prev, category: '' })); }}
              className={`w-full h-9 px-3 rounded-lg border bg-fw-base text-figma-base text-fw-heading tracking-[-0.03em] focus:outline-none focus:ring-1 focus:ring-fw-active appearance-none cursor-pointer ${
                errors.category ? 'border-fw-error' : 'border-fw-secondary'
              }`}
            >
              <option value="">Select category</option>
              <option value="access-request">Access Request</option>
              <option value="user-access">User Access</option>
              <option value="decommission">Decommission Rule</option>
              <option value="connectivity">Connectivity Issue</option>
              <option value="billing">Billing</option>
              <option value="other">Other</option>
            </select>
            {errors.category && (
              <p className="mt-1 text-figma-sm text-fw-error tracking-[-0.03em]">{errors.category}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-figma-base font-medium text-fw-heading tracking-[-0.03em] mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={e => { setDescription(e.target.value); setErrors(prev => ({ ...prev, description: '' })); }}
              rows={4}
              className={`w-full px-3 py-2 rounded-lg border bg-fw-base text-figma-base text-fw-heading tracking-[-0.03em] focus:outline-none focus:ring-1 focus:ring-fw-active resize-none ${
                errors.description ? 'border-fw-error' : 'border-fw-secondary'
              }`}
              placeholder="Describe your issue"
            />
            {errors.description && (
              <p className="mt-1 text-figma-sm text-fw-error tracking-[-0.03em]">{errors.description}</p>
            )}
          </div>

          {/* Attachments */}
          <div>
            <label className="block text-figma-base font-medium text-fw-heading tracking-[-0.03em] mb-2">
              Attachment
            </label>
            <div
              onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`relative rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
                isDragging ? 'border-fw-active bg-fw-active/5' : 'border-fw-secondary bg-fw-wash'
              }`}
            >
              <Upload className="h-6 w-6 text-fw-bodyLight mx-auto mb-2" />
              <p className="text-figma-sm font-medium text-fw-body tracking-[-0.03em] mb-1">
                Drag and drop files here
              </p>
              <p className="text-figma-sm text-fw-bodyLight tracking-[-0.03em] mb-3">
                or
              </p>
              <label className="inline-flex items-center justify-center h-8 px-4 rounded-full border border-fw-active text-figma-sm font-medium text-fw-link cursor-pointer hover:bg-fw-active/5 transition-colors">
                Browse files
                <input
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
            </div>

            {/* Attachment list */}
            {attachments.length > 0 && (
              <div className="mt-3 space-y-2">
                {attachments.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-fw-base border border-fw-secondary"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-fw-wash">
                        <span className="text-figma-sm font-bold text-fw-heading">{file.type}</span>
                      </div>
                      <div>
                        <p className="text-figma-base font-medium text-fw-heading tracking-[-0.03em]">{file.name}</p>
                        <p className="text-figma-sm text-fw-bodyLight tracking-[-0.03em]">{file.size}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeAttachment(index)}
                      className="p-1.5 rounded hover:bg-fw-wash text-fw-body hover:text-fw-error transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Submit button */}
        <div className="mt-8">
          <Button
            variant="secondary"
            fullWidth
            icon={Check}
            onClick={handleSubmit}
            disabled={!contact && !category && !description}
          >
            Create ticket
          </Button>
        </div>
      </div>
    </div>
  );
}
