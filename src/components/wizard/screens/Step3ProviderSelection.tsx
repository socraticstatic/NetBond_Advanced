import { Check } from 'lucide-react';
import { CloudProvider } from '../../../types/connection';
import { WizardState } from '../../../hooks/useWizard';

const CLOUD_PROVIDERS = [
  {
    id: 'AWS' as CloudProvider,
    name: 'AWS',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg',
    disabled: false,
  },
  {
    id: 'Azure' as CloudProvider,
    name: 'Microsoft Azure',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Microsoft_Azure.svg',
    disabled: false,
  },
  {
    id: 'Google' as CloudProvider,
    name: 'Google Cloud',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/5/51/Google_Cloud_logo.svg',
    disabled: false,
  },
  {
    id: 'Oracle' as CloudProvider,
    name: 'Oracle Cloud',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/5/50/Oracle_logo.svg',
    disabled: true,
  },
  {
    id: 'IBM' as CloudProvider,
    name: 'IBM Cloud',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg',
    disabled: true,
  },
  {
    id: 'Equinix' as CloudProvider,
    name: 'Equinix',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Equinix_logo.svg',
    disabled: true,
  },
  {
    id: 'Digital Realty' as CloudProvider,
    name: 'Digital Realty',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f2/Digital_Realty_TM_Brandmark_RGB_Black.svg',
    disabled: true,
  },
  {
    id: 'Centersquare' as CloudProvider,
    name: 'Centersquare',
    logo: 'https://centersquaredc.com/hs-fs/hubfs/Center-Square-Primary-Wordmark-Black-RGB.png?width=2338&height=2339&name=Center-Square-Primary-Wordmark-Black-RGB.png',
    disabled: true,
  },
  {
    id: 'CoreSite' as CloudProvider,
    name: 'CoreSite',
    logo: 'https://www.coresite.com/hubfs/CoreSite-AMT-Logo-1.svg',
    disabled: true,
  },
  {
    id: 'DataBank' as CloudProvider,
    name: 'DataBank',
    logo: 'https://www.databank.com/wp-content/themes/databank/assets/images/content/DB-logo-dark.svg',
    disabled: true,
  },
];

interface Step3ProviderSelectionProps {
  wizard: WizardState;
  onToggleProvider: (providerId: CloudProvider) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export function Step3ProviderSelection({
  wizard,
  onToggleProvider,
  onNext,
  onPrevious,
}: Step3ProviderSelectionProps) {
  const firstRow = CLOUD_PROVIDERS.slice(0, 3);
  const secondRow = CLOUD_PROVIDERS.slice(3, 6);
  const thirdRow = CLOUD_PROVIDERS.slice(6, 9);
  const lastProvider = CLOUD_PROVIDERS[9];

  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Cloud Providers</h2>
        <p className="text-gray-600">Select one or more cloud providers</p>
      </div>

      <div className="space-y-8">
        <div className="grid grid-cols-3 gap-6">
          {firstRow.map((provider) => (
            <div key={provider.id} className="relative flex">
              <button
                onClick={() => !provider.disabled && onToggleProvider(provider.id)}
                disabled={provider.disabled}
                className={`
                  w-full py-12 px-8 border-2 rounded-xl transition-all duration-200
                  ${
                    provider.disabled
                      ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                      : wizard.selectedProviders.includes(provider.id)
                      ? 'border-brand-blue bg-brand-lightBlue shadow-lg transform scale-[1.02]'
                      : 'border-gray-200 hover:border-brand-blue/30 hover:bg-brand-lightBlue/30'
                  }
                `}
              >
                <div className="flex flex-col items-center">
                  <img
                    src={provider.logo}
                    alt={provider.name}
                    className={`
                      h-12 object-contain transition-all duration-300
                      ${
                        provider.disabled
                          ? 'filter grayscale opacity-50'
                          : wizard.selectedProviders.includes(provider.id)
                          ? ''
                          : 'filter grayscale hover:filter-none'
                      }
                    `}
                  />
                </div>
                {wizard.selectedProviders.includes(provider.id) && (
                  <div className="absolute top-3 right-3">
                    <div className="w-6 h-6 bg-brand-blue rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )}
              </button>

              {provider.disabled && (
                <div className="absolute inset-0 flex flex-col justify-end items-center p-4 bg-white/10 backdrop-blur-[0.5px] rounded-xl">
                  <span className="px-3 py-1 bg-gray-900/50 text-white text-sm font-medium rounded-full whitespace-nowrap">
                    Coming Soon
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-6">
          {secondRow.map((provider) => (
            <div key={provider.id} className="relative flex">
              <button
                onClick={() => !provider.disabled && onToggleProvider(provider.id)}
                disabled={provider.disabled}
                className={`
                  w-full py-12 px-8 border-2 rounded-xl transition-all duration-200
                  ${
                    provider.disabled
                      ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                      : wizard.selectedProviders.includes(provider.id)
                      ? 'border-brand-blue bg-brand-lightBlue shadow-lg transform scale-[1.02]'
                      : 'border-gray-200 hover:border-brand-blue/30 hover:bg-brand-lightBlue/30'
                  }
                `}
              >
                <div className="flex flex-col items-center">
                  <img
                    src={provider.logo}
                    alt={provider.name}
                    className={`
                      h-12 object-contain transition-all duration-300
                      ${
                        provider.disabled
                          ? 'filter grayscale opacity-50'
                          : wizard.selectedProviders.includes(provider.id)
                          ? ''
                          : 'filter grayscale hover:filter-none'
                      }
                    `}
                  />
                </div>
                {wizard.selectedProviders.includes(provider.id) && (
                  <div className="absolute top-3 right-3">
                    <div className="w-6 h-6 bg-brand-blue rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )}
              </button>

              {provider.disabled && (
                <div className="absolute inset-0 flex flex-col justify-end items-center p-4 bg-white/10 backdrop-blur-[0.5px] rounded-xl">
                  <span className="px-3 py-1 bg-gray-900/50 text-white text-sm font-medium rounded-full whitespace-nowrap">
                    Coming Soon
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-6">
          {thirdRow.map((provider) => (
            <div key={provider.id} className="relative flex">
              <button
                onClick={() => !provider.disabled && onToggleProvider(provider.id)}
                disabled={provider.disabled}
                className={`
                  w-full py-12 px-8 border-2 rounded-xl transition-all duration-200
                  ${
                    provider.disabled
                      ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                      : wizard.selectedProviders.includes(provider.id)
                      ? 'border-brand-blue bg-brand-lightBlue shadow-lg transform scale-[1.02]'
                      : 'border-gray-200 hover:border-brand-blue/30 hover:bg-brand-lightBlue/30'
                  }
                `}
              >
                <div className="flex flex-col items-center">
                  <img
                    src={provider.logo}
                    alt={provider.name}
                    className={`
                      h-12 object-contain transition-all duration-300
                      ${
                        provider.disabled
                          ? 'filter grayscale opacity-50'
                          : wizard.selectedProviders.includes(provider.id)
                          ? ''
                          : 'filter grayscale hover:filter-none'
                      }
                    `}
                  />
                </div>
                {wizard.selectedProviders.includes(provider.id) && (
                  <div className="absolute top-3 right-3">
                    <div className="w-6 h-6 bg-brand-blue rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )}
              </button>

              {provider.disabled && (
                <div className="absolute inset-0 flex flex-col justify-end items-center p-4 bg-white/10 backdrop-blur-[0.5px] rounded-xl">
                  <span className="px-3 py-1 bg-gray-900/50 text-white text-sm font-medium rounded-full whitespace-nowrap">
                    Coming Soon
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <div className="w-1/3 relative flex">
            <button
              onClick={() => !lastProvider.disabled && onToggleProvider(lastProvider.id)}
              disabled={lastProvider.disabled}
              className={`
                w-full py-12 px-8 border-2 rounded-xl transition-all duration-200
                ${
                  lastProvider.disabled
                    ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                    : wizard.selectedProviders.includes(lastProvider.id)
                    ? 'border-brand-blue bg-brand-lightBlue shadow-lg transform scale-[1.02]'
                    : 'border-gray-200 hover:border-brand-blue/30 hover:bg-brand-lightBlue/30'
                }
              `}
            >
              <div className="flex flex-col items-center">
                <img
                  src={lastProvider.logo}
                  alt={lastProvider.name}
                  className={`
                    h-12 object-contain transition-all duration-300
                    ${
                      lastProvider.disabled
                        ? 'filter grayscale opacity-50'
                        : wizard.selectedProviders.includes(lastProvider.id)
                        ? ''
                        : 'filter grayscale hover:filter-none'
                    }
                  `}
                />
              </div>
              {wizard.selectedProviders.includes(lastProvider.id) && (
                <div className="absolute top-3 right-3">
                  <div className="w-6 h-6 bg-brand-blue rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                </div>
              )}
            </button>

            {lastProvider.disabled && (
              <div className="absolute inset-0 flex flex-col justify-end items-center p-4 bg-white/10 backdrop-blur-[0.5px] rounded-xl">
                <span className="px-3 py-1 bg-gray-900/50 text-white text-sm font-medium rounded-full whitespace-nowrap">
                  Coming Soon
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-12">
        <button
          onClick={onPrevious}
          className="px-8 py-3 border-2 border-gray-300 rounded-full font-semibold text-gray-700 hover:bg-gray-50 transition-all duration-200"
        >
          Previous
        </button>
        <button
          onClick={onNext}
          disabled={wizard.selectedProviders.length === 0}
          className={`
            px-8 py-3 rounded-full font-semibold transition-all duration-200
            ${
              wizard.selectedProviders.length > 0
                ? 'bg-brand-blue text-white hover:bg-brand-darkBlue shadow-md hover:shadow-lg'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          Next
        </button>
      </div>
    </div>
  );
}
