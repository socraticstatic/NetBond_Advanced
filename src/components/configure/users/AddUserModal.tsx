import { useState } from 'react';
import { X, UserPlus } from 'lucide-react';
import { UserType } from '../types';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (userData: Omit<UserType, 'id' | 'lastActive'>) => void;
}

const ROLES = [
  'Administrator',
  'Network Engineer',
  'Security Analyst',
  'Support Engineer',
  'Read Only'
];

export function AddUserModal({ isOpen, onClose, onSave }: AddUserModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    status: 'active',
    connectionAccess: []
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.role) {
      newErrors.role = 'Role is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 transition-opacity bg-fw-neutral bg-opacity-75" onClick={onClose} />

        {/* Modal panel */}
        <div className="inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-fw-base rounded-2xl shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              onClick={onClose}
              className="text-fw-bodyLight hover:text-fw-body focus:outline-none"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="sm:flex sm:items-start">
            <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 mx-auto bg-fw-accent rounded-full sm:mx-0 sm:h-10 sm:w-10">
              <UserPlus className="w-6 h-6 text-fw-link" />
            </div>
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 className="text-figma-lg font-bold leading-6 text-fw-heading tracking-[-0.03em]">
                Add New User
              </h3>
              <div className="mt-2">
                <p className="text-figma-base font-medium text-fw-bodyLight tracking-[-0.03em]">
                  Create a new user account with specified permissions
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {/* Name */}
            <div>
              <label className="block text-figma-base font-medium text-fw-body tracking-[-0.03em]">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`mt-1 block w-full h-9 rounded-lg text-figma-base font-medium tracking-[-0.03em] text-fw-heading px-3 shadow-sm ${
                  errors.name ? 'border-fw-error' : 'border-fw-secondary'
                } focus:border-fw-active focus:ring-fw-active`}
              />
              {errors.name && (
                <p className="mt-1 text-figma-sm font-medium text-fw-error tracking-[-0.03em]">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-figma-base font-medium text-fw-body tracking-[-0.03em]">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`mt-1 block w-full h-9 rounded-lg text-figma-base font-medium tracking-[-0.03em] text-fw-heading px-3 shadow-sm ${
                  errors.email ? 'border-fw-error' : 'border-fw-secondary'
                } focus:border-fw-active focus:ring-fw-active`}
              />
              {errors.email && (
                <p className="mt-1 text-figma-sm font-medium text-fw-error tracking-[-0.03em]">{errors.email}</p>
              )}
            </div>

            {/* Role */}
            <div>
              <label className="block text-figma-base font-medium text-fw-body tracking-[-0.03em]">Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className={`mt-1 block w-full h-9 rounded-lg text-figma-base font-medium tracking-[-0.03em] text-fw-heading px-3 shadow-sm ${
                  errors.role ? 'border-fw-error' : 'border-fw-secondary'
                } focus:border-fw-active focus:ring-fw-active`}
              >
                <option value="">Select a role</option>
                {ROLES.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
              {errors.role && (
                <p className="mt-1 text-figma-sm font-medium text-fw-error tracking-[-0.03em]">{errors.role}</p>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="block text-figma-base font-medium text-fw-body tracking-[-0.03em]">Status</label>
              <div className="mt-2 space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    checked={formData.status === 'active'}
                    onChange={() => setFormData({ ...formData, status: 'active' })}
                    className="text-fw-cobalt-600 border-fw-secondary focus:ring-fw-active"
                  />
                  <span className="ml-2 text-figma-base font-medium text-fw-body tracking-[-0.03em]">Active</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    checked={formData.status === 'inactive'}
                    onChange={() => setFormData({ ...formData, status: 'inactive' })}
                    className="text-fw-cobalt-600 border-fw-secondary focus:ring-fw-active"
                  />
                  <span className="ml-2 text-figma-base font-medium text-fw-body tracking-[-0.03em]">Inactive</span>
                </label>
              </div>
            </div>
          </div>

          <div className="mt-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={handleSubmit}
              className="inline-flex justify-center w-full px-4 py-2 h-9 text-figma-base font-medium tracking-[-0.03em] text-white bg-fw-cobalt-600 border border-transparent rounded-full shadow-sm hover:bg-fw-cobalt-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fw-active transition-colors sm:ml-3 sm:w-auto"
            >
              Add User
            </button>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex justify-center w-full px-4 py-2 h-9 mt-3 text-figma-base font-medium tracking-[-0.03em] text-fw-body bg-fw-base border border-fw-secondary rounded-full shadow-sm hover:bg-fw-wash focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fw-active transition-colors sm:mt-0 sm:w-auto"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}