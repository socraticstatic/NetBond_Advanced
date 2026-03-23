import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Bug, Lightbulb, MessageSquare, Star, CheckCircle } from 'lucide-react';
import { Button } from '../common/Button';

type FeedbackType = 'bug' | 'feature' | 'general';
type Step = 'select' | 'form' | 'confirm';

interface BugFormData {
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical' | '';
  screenshot: boolean;
}

interface FeatureFormData {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | '';
  useCase: string;
}

interface GeneralFormData {
  title: string;
  description: string;
  rating: number;
}

type FormData = BugFormData | FeatureFormData | GeneralFormData;

const defaultBugData: BugFormData = { title: '', description: '', severity: '', screenshot: false };
const defaultFeatureData: FeatureFormData = { title: '', description: '', priority: '', useCase: '' };
const defaultGeneralData: GeneralFormData = { title: '', description: '', rating: 0 };

const feedbackTypes = [
  {
    id: 'bug' as FeedbackType,
    label: 'Report a Bug',
    description: 'Something isn\'t working as expected',
    icon: Bug,
    color: 'text-red-500',
    bg: 'bg-red-50 hover:bg-red-100 border-red-200',
  },
  {
    id: 'feature' as FeedbackType,
    label: 'Suggest a Feature',
    description: 'Share an idea to improve the platform',
    icon: Lightbulb,
    color: 'text-amber-500',
    bg: 'bg-amber-50 hover:bg-amber-100 border-amber-200',
  },
  {
    id: 'general' as FeedbackType,
    label: 'General Feedback',
    description: 'Share your thoughts or experience',
    icon: MessageSquare,
    color: 'text-fw-link',
    bg: 'bg-blue-50 hover:bg-blue-100 border-blue-200',
  },
];

export function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<Step>('select');
  const [feedbackType, setFeedbackType] = useState<FeedbackType | null>(null);
  const [bugData, setBugData] = useState<BugFormData>(defaultBugData);
  const [featureData, setFeatureData] = useState<FeatureFormData>(defaultFeatureData);
  const [generalData, setGeneralData] = useState<GeneralFormData>(defaultGeneralData);

  const reset = () => {
    setStep('select');
    setFeedbackType(null);
    setBugData(defaultBugData);
    setFeatureData(defaultFeatureData);
    setGeneralData(defaultGeneralData);
  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(reset, 300);
  };

  const handleTypeSelect = (type: FeedbackType) => {
    setFeedbackType(type);
    setStep('form');
  };

  const handleSubmit = () => {
    setStep('confirm');
  };

  const handleDone = () => {
    handleClose();
  };

  const canSubmit = (): boolean => {
    if (!feedbackType) return false;
    if (feedbackType === 'bug') return bugData.title.trim().length > 0 && bugData.description.trim().length > 0;
    if (feedbackType === 'feature') return featureData.title.trim().length > 0 && featureData.description.trim().length > 0;
    if (feedbackType === 'general') return generalData.title.trim().length > 0 && generalData.description.trim().length > 0;
    return false;
  };

  const panelVariants = {
    hidden: { x: '100%', opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { type: 'spring', damping: 28, stiffness: 280 } },
    exit: { x: '100%', opacity: 0, transition: { duration: 0.2 } },
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 16 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.2 } },
    exit: { opacity: 0, x: -16, transition: { duration: 0.15 } },
  };

  return (
    <>
      {/* Trigger tab - right edge, mid-height */}
      {!isOpen && (
      <div
        className="fixed right-0 z-[60]"
        style={{ top: '50%', transform: 'translateY(-50%)' }}
      >
        {/* Desktop: vertical text tab */}
        <button
          onClick={(e) => { e.stopPropagation(); setIsOpen(true); }}
          className="hidden sm:block bg-fw-link text-white px-3 py-2 rounded-l-lg text-[13px] font-medium tracking-[-0.02em] shadow-md hover:bg-fw-linkHover transition-colors"
          style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
          aria-label="Open feedback panel"
        >
          Feedback
        </button>
        {/* Mobile: small icon button */}
        <button
          onClick={(e) => { e.stopPropagation(); setIsOpen(true); }}
          className="sm:hidden bg-fw-link text-white p-2.5 rounded-l-lg shadow-md hover:bg-fw-linkHover transition-colors"
          aria-label="Open feedback panel"
        >
          <MessageSquare className="h-4 w-4" />
        </button>
      </div>
      )}

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/20"
            onClick={handleClose}
          />
        )}
      </AnimatePresence>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="panel"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed right-0 top-0 h-full w-full sm:w-[380px] bg-fw-base border-l border-fw-secondary shadow-xl z-[61] rounded-l-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-fw-secondary shrink-0">
              <div>
                <h2 className="text-[16px] font-semibold text-fw-heading tracking-[-0.03em]">
                  {step === 'select' && 'Share Feedback'}
                  {step === 'form' && feedbackType === 'bug' && 'Report a Bug'}
                  {step === 'form' && feedbackType === 'feature' && 'Suggest a Feature'}
                  {step === 'form' && feedbackType === 'general' && 'General Feedback'}
                  {step === 'confirm' && 'Thank You'}
                </h2>
                {step === 'form' && (
                  <button
                    onClick={() => setStep('select')}
                    className="text-[12px] text-fw-link hover:underline mt-0.5"
                  >
                    Back to options
                  </button>
                )}
              </div>
              <button
                onClick={handleClose}
                className="text-fw-secondary hover:text-fw-heading transition-colors p-1 rounded-md hover:bg-fw-wash"
                aria-label="Close feedback panel"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto">
              <AnimatePresence mode="wait">
                {step === 'select' && (
                  <motion.div
                    key="select"
                    variants={stepVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="p-5 space-y-3"
                  >
                    <p className="text-[13px] text-fw-body mb-4">
                      How would you like to help?
                    </p>
                    {feedbackTypes.map((type) => {
                      const Icon = type.icon;
                      return (
                        <button
                          key={type.id}
                          onClick={() => handleTypeSelect(type.id)}
                          className={`w-full text-left flex items-start gap-3 p-4 rounded-xl border transition-colors ${type.bg}`}
                        >
                          <Icon className={`h-5 w-5 mt-0.5 shrink-0 ${type.color}`} />
                          <div>
                            <div className="text-[14px] font-medium text-fw-heading tracking-[-0.02em]">
                              {type.label}
                            </div>
                            <div className="text-[12px] text-fw-body mt-0.5">
                              {type.description}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </motion.div>
                )}

                {step === 'form' && feedbackType === 'bug' && (
                  <motion.div
                    key="bug-form"
                    variants={stepVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="p-5 space-y-4"
                  >
                    <div>
                      <label className="fw-label fw-label-required">Title</label>
                      <input
                        className="fw-input"
                        placeholder="Brief summary of the bug"
                        value={bugData.title}
                        onChange={(e) => setBugData({ ...bugData, title: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="fw-label fw-label-required">Description</label>
                      <textarea
                        className="fw-textarea"
                        rows={4}
                        placeholder="Steps to reproduce, what you expected, what happened..."
                        value={bugData.description}
                        onChange={(e) => setBugData({ ...bugData, description: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="fw-label">Severity</label>
                      <select
                        className="fw-select"
                        value={bugData.severity}
                        onChange={(e) => setBugData({ ...bugData, severity: e.target.value as BugFormData['severity'] })}
                      >
                        <option value="">Select severity</option>
                        <option value="low">Low - Minor inconvenience</option>
                        <option value="medium">Medium - Affects workflow</option>
                        <option value="high">High - Blocks key functionality</option>
                        <option value="critical">Critical - System unusable</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="screenshot"
                        checked={bugData.screenshot}
                        onChange={(e) => setBugData({ ...bugData, screenshot: e.target.checked })}
                        className="h-4 w-4 rounded border-fw-secondary text-fw-link focus:ring-fw-link"
                      />
                      <label htmlFor="screenshot" className="text-[13px] text-fw-body cursor-pointer">
                        Include screenshot (page will be captured on submit)
                      </label>
                    </div>
                  </motion.div>
                )}

                {step === 'form' && feedbackType === 'feature' && (
                  <motion.div
                    key="feature-form"
                    variants={stepVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="p-5 space-y-4"
                  >
                    <div>
                      <label className="fw-label fw-label-required">Title</label>
                      <input
                        className="fw-input"
                        placeholder="Short name for the feature"
                        value={featureData.title}
                        onChange={(e) => setFeatureData({ ...featureData, title: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="fw-label fw-label-required">Description</label>
                      <textarea
                        className="fw-textarea"
                        rows={4}
                        placeholder="Describe the feature and how it should work..."
                        value={featureData.description}
                        onChange={(e) => setFeatureData({ ...featureData, description: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="fw-label">Priority</label>
                      <select
                        className="fw-select"
                        value={featureData.priority}
                        onChange={(e) => setFeatureData({ ...featureData, priority: e.target.value as FeatureFormData['priority'] })}
                      >
                        <option value="">Select priority</option>
                        <option value="low">Low - Nice to have</option>
                        <option value="medium">Medium - Would improve workflow</option>
                        <option value="high">High - Critical for my use case</option>
                      </select>
                    </div>
                    <div>
                      <label className="fw-label">Use Case</label>
                      <textarea
                        className="fw-textarea"
                        rows={3}
                        placeholder="How would this feature help you day-to-day?"
                        value={featureData.useCase}
                        onChange={(e) => setFeatureData({ ...featureData, useCase: e.target.value })}
                      />
                    </div>
                  </motion.div>
                )}

                {step === 'form' && feedbackType === 'general' && (
                  <motion.div
                    key="general-form"
                    variants={stepVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="p-5 space-y-4"
                  >
                    <div>
                      <label className="fw-label fw-label-required">Title</label>
                      <input
                        className="fw-input"
                        placeholder="Subject of your feedback"
                        value={generalData.title}
                        onChange={(e) => setGeneralData({ ...generalData, title: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="fw-label fw-label-required">Description</label>
                      <textarea
                        className="fw-textarea"
                        rows={5}
                        placeholder="Share your thoughts..."
                        value={generalData.description}
                        onChange={(e) => setGeneralData({ ...generalData, description: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="fw-label">Overall Rating</label>
                      <div className="flex items-center gap-1 mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setGeneralData({ ...generalData, rating: star })}
                            className="p-0.5 transition-transform hover:scale-110"
                            aria-label={`Rate ${star} out of 5`}
                          >
                            <Star
                              className={`h-6 w-6 transition-colors ${
                                star <= generalData.rating
                                  ? 'text-amber-400 fill-amber-400'
                                  : 'text-fw-disabled'
                              }`}
                            />
                          </button>
                        ))}
                        {generalData.rating > 0 && (
                          <span className="text-[12px] text-fw-body ml-2">
                            {generalData.rating}/5
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 'confirm' && (
                  <motion.div
                    key="confirm"
                    variants={stepVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="p-5 flex flex-col items-center justify-center min-h-[300px] text-center"
                  >
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', damping: 16, stiffness: 200, delay: 0.1 }}
                    >
                      <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <h3 className="text-[18px] font-semibold text-fw-heading tracking-[-0.03em] mb-2">
                        Feedback received
                      </h3>
                      <p className="text-[13px] text-fw-body max-w-[260px]">
                        Thank you for helping us improve. Your feedback has been submitted and will be reviewed by our team.
                      </p>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            {(step === 'form' || step === 'confirm') && (
              <div className="px-5 py-4 border-t border-fw-secondary shrink-0 flex items-center gap-3">
                {step === 'form' && (
                  <>
                    <Button
                      variant="primary"
                      onClick={handleSubmit}
                      disabled={!canSubmit()}
                    >
                      Submit Feedback
                    </Button>
                    <Button variant="ghost" onClick={handleClose}>
                      Cancel
                    </Button>
                  </>
                )}
                {step === 'confirm' && (
                  <Button variant="primary" onClick={handleDone} fullWidth>
                    Done
                  </Button>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
