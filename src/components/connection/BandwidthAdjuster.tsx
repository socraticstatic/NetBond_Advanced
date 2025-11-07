import { useState } from 'react';
import { ArrowUpDown, Check, X, TrendingUp, Zap, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BandwidthAdjusterProps {
  currentBandwidth: string;
  onBandwidthChange: (newBandwidth: string) => void;
  connectionId: string;
  connectionName: string;
}

const BANDWIDTH_OPTIONS = [
  { value: '50 Mbps', label: '50 Mbps', price: '$199/mo', tier: 'basic' },
  { value: '100 Mbps', label: '100 Mbps', price: '$299/mo', tier: 'basic' },
  { value: '200 Mbps', label: '200 Mbps', price: '$449/mo', tier: 'standard' },
  { value: '500 Mbps', label: '500 Mbps', price: '$799/mo', tier: 'standard' },
  { value: '1 Gbps', label: '1 Gbps', price: '$1,299/mo', tier: 'premium', recommended: true },
  { value: '2 Gbps', label: '2 Gbps', price: '$2,199/mo', tier: 'premium' },
  { value: '5 Gbps', label: '5 Gbps', price: '$4,499/mo', tier: 'enterprise' },
  { value: '10 Gbps', label: '10 Gbps', price: '$7,999/mo', tier: 'enterprise' },
  { value: '100 Gbps', label: '100 Gbps', price: '$49,999/mo', tier: 'enterprise' },
];

export function BandwidthAdjuster({ currentBandwidth, onBandwidthChange, connectionId, connectionName }: BandwidthAdjusterProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedBandwidth, setSelectedBandwidth] = useState(currentBandwidth);
  const [isConfirming, setIsConfirming] = useState(false);

  const currentOption = BANDWIDTH_OPTIONS.find(opt => opt.value === currentBandwidth);
  const selectedOption = BANDWIDTH_OPTIONS.find(opt => opt.value === selectedBandwidth);

  const handleSave = () => {
    if (selectedBandwidth === currentBandwidth) {
      setIsEditing(false);
      return;
    }

    setIsConfirming(true);

    // Simulate API call
    setTimeout(() => {
      onBandwidthChange(selectedBandwidth);
      setIsConfirming(false);
      setIsEditing(false);

      window.addToast({
        type: 'success',
        title: 'Bandwidth Updated',
        message: `Successfully changed bandwidth to ${selectedBandwidth}`,
        duration: 4000
      });
    }, 1500);
  };

  const handleCancel = () => {
    setSelectedBandwidth(currentBandwidth);
    setIsEditing(false);
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'basic': return 'from-fw-gray-400 to-fw-gray-600';
      case 'standard': return 'from-fw-blue-functional to-fw-cobalt-600';
      case 'premium': return 'from-fw-cobalt-600 to-fw-cobalt-700';
      case 'enterprise': return 'from-fw-cobalt-700 to-fw-cobalt-800';
      default: return 'from-fw-gray-500 to-fw-gray-700';
    }
  };

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'basic': return { text: 'Basic', class: 'bg-fw-gray-200 text-fw-gray-700' };
      case 'standard': return { text: 'Standard', class: 'bg-fw-blue-light text-fw-cobalt-700' };
      case 'premium': return { text: 'Premium', class: 'bg-gradient-to-r from-fw-cobalt-600 to-fw-cobalt-700 text-white' };
      case 'enterprise': return { text: 'Enterprise', class: 'bg-gradient-to-r from-fw-cobalt-700 to-fw-cobalt-800 text-white' };
      default: return { text: 'Basic', class: 'bg-fw-gray-200 text-fw-gray-700' };
    }
  };

  if (!isEditing) {
    return (
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-fw-blue-light to-fw-base rounded-xl border border-fw-cobalt-100">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-fw-cobalt-700 to-fw-cobalt-800 flex items-center justify-center">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-fw-bodyLight">Bandwidth</span>
              {currentOption && (
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${getTierBadge(currentOption.tier).class}`}>
                  {getTierBadge(currentOption.tier).text}
                </span>
              )}
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-bold text-fw-heading">{currentBandwidth}</span>
              {currentOption && (
                <span className="text-sm text-fw-bodyLight">{currentOption.price}</span>
              )}
            </div>
          </div>
        </div>
        <button
          onClick={() => setIsEditing(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-fw-ctaPrimary hover:bg-fw-ctaPrimaryHover text-fw-linkPrimary rounded-lg transition-all font-medium text-sm"
        >
          <ArrowUpDown className="h-4 w-4" />
          <span>Adjust</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-fw-secondary p-6 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-fw-heading">Adjust Bandwidth</h3>
          <p className="text-sm text-fw-bodyLight mt-0.5">Select your new bandwidth allocation</p>
        </div>
        <button
          onClick={handleCancel}
          className="p-2 text-fw-bodyLight hover:text-fw-body rounded-lg hover:bg-fw-wash transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Current Selection Display */}
      <AnimatePresence mode="wait">
        {selectedOption && selectedBandwidth !== currentBandwidth && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 p-4 bg-gradient-to-r from-fw-blue-light to-fw-cobalt-100 rounded-lg border border-fw-cobalt-100"
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-fw-cobalt-600 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-fw-heading mb-1">
                  Changing from {currentBandwidth} → {selectedBandwidth}
                </p>
                <p className="text-xs text-fw-body">
                  {currentOption && selectedOption && (
                    <>
                      Price change: {currentOption.price} → <span className="font-semibold">{selectedOption.price}</span>
                    </>
                  )}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bandwidth Options Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
        {BANDWIDTH_OPTIONS.map((option) => {
          const isSelected = selectedBandwidth === option.value;
          const isCurrent = currentBandwidth === option.value;
          const tierBadge = getTierBadge(option.tier);

          return (
            <motion.button
              key={option.value}
              onClick={() => setSelectedBandwidth(option.value)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`
                relative p-4 rounded-xl border-2 transition-all text-left
                ${isSelected
                  ? 'border-fw-active bg-fw-blue-light shadow-md'
                  : 'border-fw-secondary bg-fw-base hover:border-fw-active hover:bg-fw-wash'
                }
                ${isCurrent ? 'ring-2 ring-fw-cobalt-100' : ''}
              `}
            >
              {/* Recommended Badge */}
              {option.recommended && (
                <div className="absolute -top-2 right-3">
                  <span className="px-2 py-0.5 bg-gradient-to-r from-complementary-orange to-fw-orange-600 text-white text-xs font-medium rounded-full shadow-sm">
                    Recommended
                  </span>
                </div>
              )}

              {/* Current Badge */}
              {isCurrent && (
                <div className="absolute -top-2 left-3">
                  <span className="px-2 py-0.5 bg-fw-cobalt-700 text-white text-xs font-medium rounded-full shadow-sm">
                    Current
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between mb-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${tierBadge.class}`}>
                  {tierBadge.text}
                </span>
                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-fw-active flex items-center justify-center">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                )}
              </div>

              <div className="mb-1">
                <span className="text-xl font-bold text-fw-heading">{option.label}</span>
              </div>
              <div className="text-sm font-medium text-fw-body">{option.price}</div>
            </motion.button>
          );
        })}
      </div>

      {/* Info Notice */}
      <div className="flex items-start space-x-3 p-4 bg-fw-wash rounded-lg border border-fw-secondary mb-6">
        <AlertCircle className="h-5 w-5 text-fw-info flex-shrink-0 mt-0.5" />
        <div className="flex-1 text-sm text-fw-body">
          <p className="font-medium text-fw-heading mb-1">Change takes effect immediately</p>
          <p className="text-xs text-fw-bodyLight">
            Your bandwidth will be updated within 2-3 minutes. Billing will be prorated based on the change date.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <button
          onClick={handleCancel}
          className="flex-1 px-4 py-3 bg-transparent border border-fw-secondary text-fw-body hover:bg-fw-wash rounded-lg transition-all font-medium"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={isConfirming || selectedBandwidth === currentBandwidth}
          className={`
            flex-1 px-4 py-3 rounded-lg transition-all font-medium flex items-center justify-center space-x-2
            ${isConfirming
              ? 'bg-fw-gray-400 text-white cursor-wait'
              : selectedBandwidth === currentBandwidth
                ? 'bg-fw-disabled text-fw-disabled cursor-not-allowed'
                : 'bg-fw-ctaPrimary hover:bg-fw-ctaPrimaryHover text-fw-linkPrimary'
            }
          `}
        >
          {isConfirming ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <Zap className="h-4 w-4" />
              </motion.div>
              <span>Updating...</span>
            </>
          ) : (
            <>
              <Check className="h-4 w-4" />
              <span>Confirm Change</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
