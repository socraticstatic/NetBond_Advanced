import { CheckCircle2 } from 'lucide-react';
import { CloudProvider } from '../../../types/connection';

interface ProviderSelectionProps {
  selectedProviders: CloudProvider[];
  onToggle: (provider: CloudProvider) => void;
  billingChoice: {
    planId: string;
    term: string;
    addons: string[];
  };
  onBillingChange: (updates: any) => void;
}

const CLOUD_PROVIDERS: { id: CloudProvider; name: string; logo: string }[] = [
  {
    id: 'AWS',
    name: 'AWS',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg',
  },
  {
    id: 'Azure',
    name: 'Microsoft Azure',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Microsoft_Azure.svg',
  },
  {
    id: 'Google',
    name: 'Google Cloud',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/5/51/Google_Cloud_logo.svg',
  },
  {
    id: 'Oracle',
    name: 'Oracle Cloud',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/5/50/Oracle_logo.svg',
  },
  {
    id: 'IBM',
    name: 'IBM Cloud',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg',
  },
  {
    id: 'Equinix',
    name: 'Equinix',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Equinix_logo.svg',
  },
  {
    id: 'Digital Realty',
    name: 'Digital Realty',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f2/Digital_Realty_TM_Brandmark_RGB_Black.svg',
  },
  {
    id: 'Centersquare',
    name: 'Centersquare',
    logo: 'https://centersquaredc.com/hs-fs/hubfs/Center-Square-Primary-Wordmark-Black-RGB.png?width=2338&height=2339&name=Center-Square-Primary-Wordmark-Black-RGB.png',
  },
  {
    id: 'CoreSite',
    name: 'CoreSite',
    logo: 'https://www.coresite.com/hubfs/CoreSite-AMT-Logo-1.svg',
  },
  {
    id: 'DataBank',
    name: 'DataBank',
    logo: 'https://www.databank.com/wp-content/themes/databank/assets/images/content/DB-logo-dark.svg',
  },
  {
    id: 'Cisco Jasper',
    name: 'Cisco Jasper',
    logo: 'https://logo.clearbit.com/cisco.com',
  },
];

export function ProviderSelection({
  selectedProviders,
  onToggle,
}: ProviderSelectionProps) {
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h3 className="text-figma-xl font-bold text-fw-heading tracking-[-0.03em]">
          Select Your Cloud Providers
        </h3>
        <p className="text-figma-sm text-fw-bodyLight mt-2">
          Choose one or more providers for your connection
        </p>
        {selectedProviders.length > 0 && (
          <span className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full bg-fw-primary text-white text-figma-xs font-medium">
            <CheckCircle2 className="h-3.5 w-3.5" />
            {selectedProviders.length} selected
          </span>
        )}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {CLOUD_PROVIDERS.map((provider) => {
          const isSelected = selectedProviders.includes(provider.id);
          return (
            <div key={provider.id} className="relative flex">
              <button
                onClick={() => onToggle(provider.id)}
                className={`
                  w-full py-12 px-8 border-2 rounded-2xl wizard-card network-option transition-all duration-200
                  ${isSelected
                    ? 'border-fw-active bg-fw-primary shadow-lg transform scale-[1.02]'
                    : 'border-fw-secondary bg-fw-wash hover:border-fw-active/50 hover:bg-fw-base'
                  }
                `}
              >
                <div className="flex flex-col items-center">
                  <img
                    src={provider.logo}
                    alt={provider.name}
                    className={`
                      h-12 object-contain transition-all duration-300
                      ${isSelected
                        ? 'brightness-0 invert'
                        : 'filter grayscale hover:filter-none'
                      }
                    `}
                  />
                </div>
              </button>

              {isSelected && (
                <div className="absolute top-3 right-3">
                  <CheckCircle2 className="h-6 w-6 text-white drop-shadow-md" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
