import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Check,
  X,
  Sun,
  Moon,
  Monitor,
  ChevronDown,
  Search,
  Download,
  Plus,
  BarChart3,
  Settings,
  Network,
  ArrowRight,
} from 'lucide-react';

type ThemeOption = 'light' | 'dark' | 'system';

interface OnboardingState {
  termsAccepted: boolean | null;
  theme: ThemeOption | null;
  timezone: string;
  customer: string;
}

const TOTAL_STEPS = 9;

const TIMEZONES = [
  'UTC-12:00', 'UTC-11:00', 'UTC-10:00', 'UTC-09:00', 'UTC-08:00',
  'UTC-07:00', 'UTC-06:00', 'UTC-05:00', 'UTC-04:00', 'UTC-03:00',
  'UTC-02:00', 'UTC-01:00', 'UTC+00:00', 'UTC+01:00', 'UTC+02:00',
  'UTC+03:00', 'UTC+04:00', 'UTC+05:00', 'UTC+05:30', 'UTC+06:00',
  'UTC+07:00', 'UTC+08:00', 'UTC+09:00', 'UTC+10:00', 'UTC+11:00',
  'UTC+12:00',
];

const CUSTOMERS = [
  'All Customers',
  'Bratislava LAB',
  'Comerica',
  'dev test tenant 0001',
  'inventory-importer test on dev 10000',
  'Enterprise Corp',
  'Global Networks LLC',
  'Pacific Telecom',
];

const SECTION_WALKTHROUGHS = [
  {
    title: 'Create.',
    subtitle: 'Create a new connection.',
    features: [
      {
        name: 'Step-by-Step Wizard',
        description: 'Guided connection setup with detailed configuration options',
      },
      {
        name: 'Visual Designer',
        description: 'Design your network topology using an interactive canvas',
      },
      {
        name: 'API Configuration',
        description: 'Configure your connection using JSON and API endpoints',
      },
    ],
  },
  {
    title: 'Manage.',
    subtitle: 'Manage your individual and grouped connections.',
    features: [
      {
        name: 'Connection Grid',
        description: 'View all connections at a glance with status indicators',
      },
      {
        name: 'Group Management',
        description: 'Organize connections into logical groups for easier management',
      },
      {
        name: 'Bulk Operations',
        description: 'Apply changes across multiple connections simultaneously',
      },
    ],
  },
  {
    title: 'Monitor.',
    subtitle: 'Near real-time monitoring for your network.',
    features: [
      {
        name: 'Performance Metrics',
        description: 'Track bandwidth, latency, jitter, and packet loss in real time',
      },
      {
        name: 'Alert Management',
        description: 'Set up custom alerts and notification rules',
      },
      {
        name: 'Reporting',
        description: 'Generate detailed reports for compliance and analysis',
      },
    ],
  },
  {
    title: 'Configure.',
    subtitle: 'Configure system settings and preferences.',
    features: [
      {
        name: 'User Management',
        description: 'Control access with role-based permissions',
      },
      {
        name: 'Policy Engine',
        description: 'Define and enforce network policies across connections',
      },
      {
        name: 'Billing & Usage',
        description: 'Track costs and optimize resource utilization',
      },
    ],
  },
];

// Shared layout wrapper for all onboarding steps
function OnboardingLayout({
  currentStep,
  children,
  actions,
}: {
  currentStep: number;
  children: React.ReactNode;
  actions: React.ReactNode;
}) {
  const progressWidth = (currentStep / TOTAL_STEPS) * 100;

  return (
    <div className="min-h-screen bg-fw-base flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4">
        <div className="flex items-center gap-2">
          {/* AT&T logo placeholder */}
          <svg width="54" height="16" viewBox="0 0 54 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="8" cy="8" r="8" fill="#009fdb" />
            <circle cx="8" cy="8" r="5" fill="white" />
            <circle cx="8" cy="8" r="3" fill="#009fdb" />
          </svg>
          <span className="text-figma-lg font-bold text-fw-heading tracking-[-0.03em]">NetBond</span>
        </div>
      </header>

      {/* Content area */}
      <div className="flex-1 flex">
        {/* Left content */}
        <div className="flex-1 flex flex-col justify-center px-16 max-w-[600px]">
          {children}

          {/* Actions */}
          <div className="flex items-center gap-3 mt-8">
            {actions}
          </div>

          {/* Progress indicator */}
          <div className="flex items-center gap-3 mt-8">
            <span className="text-figma-sm font-medium text-fw-link tracking-[-0.03em]">
              {currentStep}
            </span>
            <div className="w-36 h-1 rounded-full bg-fw-secondary overflow-hidden">
              <div
                className="h-full rounded-full bg-fw-active transition-all duration-300"
                style={{ width: `${progressWidth}%` }}
              />
            </div>
            <span className="text-figma-sm font-medium text-fw-disabled tracking-[-0.03em]">
              {TOTAL_STEPS}
            </span>
          </div>
        </div>

        {/* Right decorative panel - app wireframe skeleton */}
        <div className="hidden lg:block flex-1 p-4">
          <div className="w-full h-full rounded-3xl bg-fw-wash flex items-center justify-center p-8">
            {/* Wireframe skeleton of the app */}
            <div className="w-full max-w-[480px] bg-fw-base rounded-2xl shadow-sm border border-fw-secondary p-5 space-y-4">
              {/* Nav bar skeleton */}
              <div className="flex items-center gap-3 mb-2">
                <div className="h-3 w-3 rounded-full bg-fw-secondary" />
                <div className="h-2.5 w-20 rounded bg-fw-secondary" />
                <div className="flex-1" />
                <div className="h-2.5 w-12 rounded bg-fw-secondary" />
                <div className="h-2.5 w-12 rounded bg-fw-secondary" />
              </div>
              {/* Content rows */}
              <div className="space-y-3">
                <div className="h-2 w-[70%] rounded bg-fw-secondary" />
                <div className="h-2 w-full rounded bg-fw-secondary" />
                <div className="h-2 w-[85%] rounded bg-fw-secondary" />
              </div>
              {/* Card area */}
              <div className="rounded-lg bg-fw-wash p-4 space-y-3">
                <div className="flex gap-3">
                  <div className="h-2.5 w-16 rounded bg-fw-secondary" />
                  <div className="h-2.5 w-24 rounded bg-fw-secondary" />
                </div>
                <div className="h-2 w-full rounded bg-fw-secondary" />
                <div className="h-2 w-[60%] rounded bg-fw-secondary" />
              </div>
              {/* Bottom row */}
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-fw-secondary" />
                <div className="h-2.5 w-28 rounded bg-fw-secondary" />
                <div className="flex-1" />
                <div className="h-6 w-16 rounded-full bg-fw-secondary" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Step 1: Terms & Conditions
function TermsStep({
  onAgree,
  onDisagree,
}: {
  onAgree: () => void;
  onDisagree: () => void;
}) {
  return (
    <OnboardingLayout
      currentStep={1}
      actions={
        <>
          <button
            onClick={onAgree}
            className="inline-flex items-center gap-2 h-10 px-6 bg-fw-primary text-white rounded-full text-figma-base font-medium tracking-[-0.03em] hover:bg-fw-ctaPrimaryHover transition-colors"
          >
            <Check className="w-5 h-5" />
            Agree
          </button>
          <button
            onClick={onDisagree}
            className="inline-flex items-center gap-2 h-10 px-6 bg-fw-base text-fw-link border border-fw-secondary rounded-full text-figma-base font-medium tracking-[-0.03em] hover:bg-fw-wash transition-colors"
          >
            <X className="w-5 h-5" />
            Disagree
          </button>
        </>
      }
    >
      <h2 className="text-figma-xl font-bold text-fw-heading tracking-[-0.03em] mb-2">
        Terms & Conditions
      </h2>
      <p className="text-figma-base font-medium text-fw-body tracking-[-0.03em] mb-6">
        By checking the box and submitting the form, you acknowledge that you have read,
        understood, and agree to these Terms & Conditions.
      </p>

      {/* Scrollable T&C content */}
      <div className="relative">
        <div className="h-[400px] overflow-y-auto rounded-2xl bg-fw-base border border-fw-secondary p-6">
          <div className="space-y-4">
            {/* Skeleton text lines to represent legal content */}
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="space-y-2">
                {i % 5 === 0 && (
                  <div className="h-4 w-[40%] rounded-md bg-fw-wash" />
                )}
                <div className="h-2 w-full rounded-md bg-fw-wash" />
                <div className="h-2 w-full rounded-md bg-fw-wash" />
                {i % 3 === 0 && <div className="h-2 w-[60%] rounded-md bg-fw-wash" />}
                <div className="h-2 w-full rounded-md bg-fw-wash" />
                <div className="h-2 w-[75%] rounded-md bg-fw-wash" />
              </div>
            ))}
          </div>
        </div>
        {/* Scroll indicator */}
        <div className="absolute right-2 top-4 w-1 h-12 rounded bg-fw-secondary" />
      </div>

      {/* Download link */}
      <button className="inline-flex items-center gap-2 mt-4 text-figma-sm font-medium text-fw-link tracking-[-0.03em] hover:text-fw-linkHover transition-colors">
        <Download className="w-4 h-4" />
        Download Terms & Conditions
      </button>
    </OnboardingLayout>
  );
}

// T&C Denied redirect modal
function TermsDeniedModal({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-fw-heading/80" onClick={onClose} />
      <div className="relative bg-fw-base rounded-3xl p-8 max-w-[441px] w-full mx-4 shadow-xl">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-fw-active flex items-center justify-center">
            <ArrowRight className="w-8 h-8 text-white" />
          </div>
        </div>

        <h3 className="text-figma-xl font-bold text-fw-heading tracking-[-0.03em] text-center mb-4">
          Redirecting to Business Center
        </h3>
        <p className="text-figma-base font-medium text-fw-body tracking-[-0.03em] text-center mb-8">
          You have not accepted our Terms and Conditions. Acceptance of these terms is a
          prerequisite for accessing and using our platform. You will now be redirected to
          the Business Center.
        </p>

        <div className="flex justify-center">
          <button
            onClick={() => navigate('/login')}
            className="inline-flex items-center gap-2 h-10 px-6 bg-fw-primary text-white rounded-full text-figma-base font-medium tracking-[-0.03em] hover:bg-fw-ctaPrimaryHover transition-colors"
          >
            Return to Login
          </button>
        </div>
      </div>
    </div>
  );
}

// Step 2: Theme Selection
function ThemeStep({
  selected,
  onSelect,
  onContinue,
}: {
  selected: ThemeOption | null;
  onSelect: (theme: ThemeOption) => void;
  onContinue: () => void;
}) {
  const themes: { key: ThemeOption; label: string; icon: typeof Sun }[] = [
    { key: 'light', label: 'Light mode', icon: Sun },
    { key: 'dark', label: 'Dark mode', icon: Moon },
    { key: 'system', label: 'System', icon: Monitor },
  ];

  return (
    <OnboardingLayout
      currentStep={2}
      actions={
        <button
          onClick={onContinue}
          disabled={!selected}
          className={`inline-flex items-center gap-2 h-10 px-6 rounded-full text-figma-base font-medium tracking-[-0.03em] transition-colors ${
            selected
              ? 'bg-fw-primary text-white hover:bg-fw-ctaPrimaryHover'
              : 'bg-fw-disabled text-fw-disabled cursor-not-allowed'
          }`}
        >
          <Check className="w-5 h-5" />
          Continue
        </button>
      }
    >
      <h2 className="text-figma-xl font-bold text-fw-heading tracking-[-0.03em] mb-2">
        What light mode suits you best?
      </h2>
      <p className="text-figma-base font-medium text-fw-body tracking-[-0.03em] mb-8">
        Select your preferred light mode to create a comfortable environment.
      </p>

      {/* Theme cards */}
      <div className="flex gap-4">
        {themes.map(({ key, label, icon: Icon }) => {
          const isSelected = selected === key;
          const isDark = key === 'dark';

          return (
            <button
              key={key}
              onClick={() => onSelect(key)}
              className="flex flex-col items-center gap-3 group"
            >
              {/* Preview card 146x146 r=16 */}
              <div
                className={`w-[146px] h-[146px] rounded-2xl border-2 transition-colors overflow-hidden relative ${
                  isSelected ? 'border-fw-active' : 'border-transparent'
                } ${isDark ? 'bg-fw-heading' : 'bg-fw-wash'}`}
              >
                {/* Mini UI preview */}
                <div className="p-2">
                  {/* Top bar */}
                  <div className="flex gap-1 mb-1.5">
                    <div className={`h-1.5 w-10 rounded-full ${isDark ? 'bg-fw-body' : 'bg-fw-secondary'}`} />
                    <div className={`h-1.5 w-10 rounded-full ${isDark ? 'bg-fw-body' : 'bg-fw-secondary'}`} />
                    <div className={`h-1.5 w-10 rounded-full ${isDark ? 'bg-fw-body' : 'bg-fw-secondary'}`} />
                  </div>
                  {/* Search bar */}
                  <div className={`h-2.5 w-full rounded ${isDark ? 'bg-black' : 'bg-white'} mb-2`} />
                  {/* Content area */}
                  <div className={`h-[70px] w-full rounded ${isDark ? 'bg-black' : 'bg-white'} p-2`}>
                    <div className={`h-1.5 w-[60%] rounded ${isDark ? 'bg-fw-body' : 'bg-fw-secondary'} mb-1`} />
                    <div className={`h-1 w-[40%] rounded ${isDark ? 'bg-fw-body' : 'bg-fw-secondary'} mb-2`} />
                    <div className="flex gap-1">
                      <div className={`h-1.5 w-3 rounded ${isDark ? 'bg-fw-body' : 'bg-fw-secondary'}`} />
                      <div className={`h-1.5 w-8 rounded ${isDark ? 'bg-fw-body' : 'bg-fw-secondary'}`} />
                    </div>
                  </div>
                  {/* Bottom bar */}
                  <div className="flex items-center gap-1 mt-1.5">
                    <div className={`h-2 w-[55%] rounded ${isDark ? 'bg-fw-body' : 'bg-fw-secondary'}`} />
                    <div className="flex-1" />
                    <div className={`h-2.5 w-8 rounded-full ${isDark ? 'bg-fw-body' : 'bg-fw-secondary'}`} />
                  </div>
                </div>

                {/* System split for system theme */}
                {key === 'system' && (
                  <div className="absolute inset-0 overflow-hidden rounded-2xl">
                    <div className="absolute right-0 top-0 w-1/2 h-full bg-fw-heading opacity-90" />
                  </div>
                )}
              </div>

              {/* Label */}
              <div className="flex items-center gap-1.5">
                <Icon className={`w-5 h-5 ${isSelected ? 'text-fw-link' : 'text-fw-heading'}`} />
                <span
                  className={`text-figma-base font-medium tracking-[-0.03em] ${
                    isSelected ? 'text-fw-link' : 'text-fw-heading'
                  }`}
                >
                  {label}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </OnboardingLayout>
  );
}

// Step 3: Timezone
function TimezoneStep({
  timezone,
  onSelect,
  onContinue,
}: {
  timezone: string;
  onSelect: (tz: string) => void;
  onContinue: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <OnboardingLayout
      currentStep={3}
      actions={
        <button
          onClick={onContinue}
          className="inline-flex items-center gap-2 h-10 px-6 bg-fw-primary text-white rounded-full text-figma-base font-medium tracking-[-0.03em] hover:bg-fw-ctaPrimaryHover transition-colors"
        >
          <Check className="w-5 h-5" />
          Continue
        </button>
      }
    >
      <h2 className="text-figma-xl font-bold text-fw-heading tracking-[-0.03em] mb-2">
        What time zone do you operate in?
      </h2>
      <p className="text-figma-base font-medium text-fw-body tracking-[-0.03em] mb-8">
        Setting your time zone helps us tailor updates to your schedule.
      </p>

      {/* Timezone dropdown */}
      <div className="relative w-full max-w-[492px]">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full h-9 px-3 rounded-lg border border-fw-secondary bg-fw-base text-figma-base text-fw-body tracking-[-0.03em] hover:border-fw-active transition-colors"
        >
          <span>{timezone || 'Select timezone'}</span>
          <ChevronDown className={`w-5 h-5 text-fw-link transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-fw-base border border-fw-secondary rounded-lg shadow-lg max-h-[240px] overflow-y-auto z-10">
            {TIMEZONES.map((tz) => (
              <button
                key={tz}
                onClick={() => {
                  onSelect(tz);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-figma-base tracking-[-0.03em] hover:bg-fw-wash transition-colors ${
                  timezone === tz ? 'text-fw-link font-medium bg-fw-wash' : 'text-fw-body'
                }`}
              >
                {tz}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* World map placeholder */}
      <div className="mt-8 w-full max-w-[504px] h-[285px] rounded-2xl bg-fw-wash border border-fw-secondary flex items-center justify-center">
        <span className="text-figma-sm text-fw-bodyLight tracking-[-0.03em]">World Map</span>
      </div>
    </OnboardingLayout>
  );
}

// Step 4: Customer Selection
function CustomerStep({
  customer,
  onSelect,
  onContinue,
}: {
  customer: string;
  onSelect: (c: string) => void;
  onContinue: () => void;
}) {
  const [search, setSearch] = useState('');
  const filtered = CUSTOMERS.filter((c) =>
    c.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <OnboardingLayout
      currentStep={4}
      actions={
        <button
          onClick={onContinue}
          className="inline-flex items-center gap-2 h-10 px-6 bg-fw-primary text-white rounded-full text-figma-base font-medium tracking-[-0.03em] hover:bg-fw-ctaPrimaryHover transition-colors"
        >
          <Check className="w-5 h-5" />
          Continue
        </button>
      }
    >
      <h2 className="text-figma-xl font-bold text-fw-heading tracking-[-0.03em] mb-2">
        Who would you like to start working with?
      </h2>
      <p className="text-figma-base font-medium text-fw-body tracking-[-0.03em] mb-6">
        To get everything running smoothly, please choose your customer.
      </p>

      {/* Search field */}
      <div className="relative w-full max-w-[488px] mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-fw-link" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search Customers"
          className="w-full h-9 pl-10 pr-3 rounded-[18px] border border-fw-secondary bg-fw-base text-figma-base text-fw-heading tracking-[-0.03em] placeholder:text-fw-body focus:outline-none focus:border-fw-active focus:ring-1 focus:ring-fw-active transition-colors"
        />
      </div>

      {/* Customer chips */}
      <div className="flex flex-wrap gap-2 mb-6">
        {filtered.map((c) => (
          <button
            key={c}
            onClick={() => onSelect(c)}
            className={`inline-flex items-center gap-2 h-5 text-figma-base font-medium tracking-[-0.03em] transition-colors ${
              customer === c ? 'text-fw-link' : 'text-fw-heading'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                customer === c
                  ? 'border-fw-active bg-fw-active'
                  : 'border-fw-secondary'
              }`}
            >
              {customer === c && (
                <div className="w-3 h-3 rounded-full bg-white" />
              )}
            </div>
            {c}
          </button>
        ))}
      </div>

      {/* Scrollbar indicator */}
      <div className="w-1 h-[68px] rounded bg-fw-secondary" />
    </OnboardingLayout>
  );
}

// Steps 5-8: Section Walkthroughs
function WalkthroughStep({
  stepNumber,
  section,
  onContinue,
}: {
  stepNumber: number;
  section: (typeof SECTION_WALKTHROUGHS)[number];
  onContinue: () => void;
}) {
  const sectionIcons: Record<string, typeof Plus> = {
    'Create.': Plus,
    'Manage.': Network,
    'Monitor.': BarChart3,
    'Configure.': Settings,
  };
  const Icon = sectionIcons[section.title] || Plus;

  return (
    <OnboardingLayout
      currentStep={stepNumber}
      actions={
        <button
          onClick={onContinue}
          className="inline-flex items-center gap-2 h-10 px-6 bg-fw-primary text-white rounded-full text-figma-base font-medium tracking-[-0.03em] hover:bg-fw-ctaPrimaryHover transition-colors"
        >
          <Check className="w-5 h-5" />
          Continue
        </button>
      }
    >
      <h2 className="text-figma-xl font-bold text-fw-heading tracking-[-0.03em] mb-2">
        {section.title}
      </h2>
      <p className="text-figma-base font-medium text-fw-body tracking-[-0.03em] mb-8">
        {section.subtitle}
      </p>

      {/* Feature cards */}
      <div className="flex gap-4">
        {section.features.map((feature, i) => (
          <div
            key={i}
            className="w-[136px] flex flex-col"
          >
            {/* Preview thumbnail */}
            <div className="w-[136px] h-[136px] rounded-2xl bg-fw-wash mb-3 flex items-center justify-center">
              <Icon className="w-8 h-8 text-fw-bodyLight" />
            </div>
            <h4 className="text-figma-lg font-bold text-fw-heading tracking-[-0.03em] mb-1">
              {feature.name}
            </h4>
            <p className="text-figma-base font-medium text-fw-body tracking-[-0.03em]">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </OnboardingLayout>
  );
}

// Step 9: Completion
function CompletionStep() {
  const navigate = useNavigate();

  return (
    <OnboardingLayout
      currentStep={9}
      actions={
        <button
          onClick={() => navigate('/manage')}
          className="inline-flex items-center gap-2 h-10 px-6 bg-fw-base text-fw-link border border-fw-secondary rounded-full text-figma-base font-medium tracking-[-0.03em] hover:bg-fw-wash transition-colors"
        >
          <Check className="w-5 h-5" />
          Complete
        </button>
      }
    >
      {/* Success icon */}
      <div className="w-12 h-12 rounded-full bg-fw-success flex items-center justify-center mb-6">
        <Check className="w-6 h-6 text-white" />
      </div>

      <h2 className="text-figma-xl font-bold text-fw-heading tracking-[-0.03em] mb-2">
        Everything is set!
      </h2>

      <p className="text-figma-base font-medium text-fw-body tracking-[-0.03em] mb-8">
        Your setup is finished. Now you're ready<br />
        to create, monitor, manage and configure.
      </p>

      {/* First-Steps Guide card */}
      <div className="w-full max-w-[500px] rounded-xl border border-fw-secondary bg-fw-base overflow-hidden">
        <div className="flex">
          {/* Guide thumbnail */}
          <div className="w-40 h-40 bg-fw-wash shrink-0 flex items-center justify-center">
            {/* Mini document preview */}
            <div className="w-32 h-36 bg-fw-base rounded shadow-sm p-3">
              <div className="h-1.5 w-12 rounded bg-fw-wash mb-2" />
              <div className="space-y-1.5">
                <div className="h-1 w-full rounded bg-fw-wash" />
                <div className="h-1 w-full rounded bg-fw-wash" />
                <div className="h-1 w-[60%] rounded bg-fw-wash" />
                <div className="h-1 w-full rounded bg-fw-wash" />
                <div className="h-1 w-full rounded bg-fw-wash" />
                <div className="h-1 w-[45%] rounded bg-fw-wash" />
                <div className="h-1 w-full rounded bg-fw-wash" />
                <div className="h-1 w-full rounded bg-fw-wash" />
                <div className="h-1 w-[75%] rounded bg-fw-wash" />
              </div>
            </div>
          </div>

          {/* Guide info */}
          <div className="flex-1 p-4">
            <h3 className="text-figma-lg font-bold text-fw-heading tracking-[-0.03em] mb-2">
              First-Steps Guide
            </h3>
            <p className="text-figma-base font-medium text-fw-body tracking-[-0.03em] mb-4">
              This guide will show you the first steps in the app, with easy instructions and visuals.
            </p>
            <button className="inline-flex items-center gap-2 h-9 px-5 bg-fw-primary text-white rounded-full text-figma-base font-medium tracking-[-0.03em] hover:bg-fw-ctaPrimaryHover transition-colors">
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>
        </div>

        {/* Wireframe skeleton content */}
        <div className="px-4 pb-4">
          <div className="h-px bg-fw-secondary mb-4" />
          <div className="space-y-3">
            {[1, 2].map((row) => (
              <div key={row} className="flex items-center gap-3 p-3 rounded-lg bg-fw-wash">
                <div className="w-[228px] flex gap-3">
                  <div className="w-8 h-5 rounded-2xl bg-fw-secondary" />
                  <div className="flex-1 space-y-1">
                    <div className="h-5 w-[117px] rounded bg-fw-secondary" />
                    <div className="h-4 w-[80px] rounded bg-fw-secondary" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </OnboardingLayout>
  );
}

// Main Wizard
export function OnboardingWizard() {
  const [step, setStep] = useState(1);
  const [showDeniedModal, setShowDeniedModal] = useState(false);
  const [state, setState] = useState<OnboardingState>({
    termsAccepted: null,
    theme: null,
    timezone: 'UTC+02:00',
    customer: '',
  });

  const next = useCallback(() => setStep((s) => Math.min(s + 1, TOTAL_STEPS)), []);

  const handleTermsAgree = useCallback(() => {
    setState((s) => ({ ...s, termsAccepted: true }));
    next();
  }, [next]);

  const handleTermsDisagree = useCallback(() => {
    setState((s) => ({ ...s, termsAccepted: false }));
    setShowDeniedModal(true);
  }, []);

  const handleThemeSelect = useCallback((theme: ThemeOption) => {
    setState((s) => ({ ...s, theme }));
  }, []);

  const handleTimezoneSelect = useCallback((timezone: string) => {
    setState((s) => ({ ...s, timezone }));
  }, []);

  const handleCustomerSelect = useCallback((customer: string) => {
    setState((s) => ({ ...s, customer }));
  }, []);

  if (showDeniedModal) {
    return <TermsDeniedModal onClose={() => setShowDeniedModal(false)} />;
  }

  switch (step) {
    case 1:
      return <TermsStep onAgree={handleTermsAgree} onDisagree={handleTermsDisagree} />;
    case 2:
      return (
        <ThemeStep
          selected={state.theme}
          onSelect={handleThemeSelect}
          onContinue={next}
        />
      );
    case 3:
      return (
        <TimezoneStep
          timezone={state.timezone}
          onSelect={handleTimezoneSelect}
          onContinue={next}
        />
      );
    case 4:
      return (
        <CustomerStep
          customer={state.customer}
          onSelect={handleCustomerSelect}
          onContinue={next}
        />
      );
    case 5:
    case 6:
    case 7:
    case 8:
      return (
        <WalkthroughStep
          stepNumber={step}
          section={SECTION_WALKTHROUGHS[step - 5]}
          onContinue={next}
        />
      );
    case 9:
      return <CompletionStep />;
    default:
      return <CompletionStep />;
  }
}