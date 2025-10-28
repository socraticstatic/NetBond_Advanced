import { useState, useCallback } from 'react';
import { CloudProvider, ConnectionType, BandwidthOption, LocationOption } from '../types/connection';

export interface WizardState {
  step: number;
  routerName: string;
  connectionType: ConnectionType | '';
  selectedProviders: CloudProvider[];
  resiliencyLevel: 'local' | 'maximum' | '';
  providerConfigurations: {
    [provider: string]: {
      location: LocationOption | '';
      bandwidth: BandwidthOption | '';
    };
  };
}

export const useWizard = () => {
  const [wizard, setWizard] = useState<WizardState>({
    step: 1,
    routerName: '',
    connectionType: '',
    selectedProviders: [],
    resiliencyLevel: '',
    providerConfigurations: {}
  });

  const updateWizard = useCallback((updates: Partial<WizardState>) => {
    setWizard(prev => ({ ...prev, ...updates }));
  }, []);

  const nextStep = useCallback(() => {
    setWizard(prev => ({ ...prev, step: prev.step + 1 }));
  }, []);

  const prevStep = useCallback(() => {
    setWizard(prev => ({ ...prev, step: Math.max(1, prev.step - 1) }));
  }, []);

  const toggleProvider = useCallback((providerId: CloudProvider) => {
    setWizard(prev => {
      const isSelected = prev.selectedProviders.includes(providerId);
      const newProviders = isSelected
        ? prev.selectedProviders.filter(p => p !== providerId)
        : [...prev.selectedProviders, providerId];

      const newConfigurations = { ...prev.providerConfigurations };
      if (!isSelected) {
        newConfigurations[providerId] = { location: '', bandwidth: '' };
      } else {
        delete newConfigurations[providerId];
      }

      return {
        ...prev,
        selectedProviders: newProviders,
        providerConfigurations: newConfigurations
      };
    });
  }, []);

  const updateProviderConfig = useCallback((
    provider: CloudProvider,
    updates: { location?: LocationOption; bandwidth?: BandwidthOption }
  ) => {
    setWizard(prev => ({
      ...prev,
      providerConfigurations: {
        ...prev.providerConfigurations,
        [provider]: {
          ...prev.providerConfigurations[provider],
          ...updates
        }
      }
    }));
  }, []);

  const reset = useCallback(() => {
    setWizard({
      step: 1,
      routerName: '',
      connectionType: '',
      selectedProviders: [],
      resiliencyLevel: '',
      providerConfigurations: {}
    });
  }, []);

  return {
    wizard,
    updateWizard,
    nextStep,
    prevStep,
    toggleProvider,
    updateProviderConfig,
    reset
  };
};
