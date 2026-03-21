import { useState, useEffect } from 'react';
import { NetworkNode, NetworkEdge } from '../../types';
import { TemplatePreview } from './templates/TemplatePreview';
import { loadTemplate, getAvailableTemplateIds } from './templates';

interface TemplatesDrawerProps {
  onApplyTemplate: (nodes: NetworkNode[], edges: NetworkEdge[]) => void;
}

interface TemplateItem {
  id: string;
  name: string;
  description: string;
  category: string;
  template?: any; // Will be loaded dynamically
  preview?: any;
  isLoading?: boolean;
}

export function TemplatesDrawer({ onApplyTemplate }: TemplatesDrawerProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [templates, setTemplates] = useState<TemplateItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load template metadata on component mount
  useEffect(() => {
    async function loadInitialTemplates() {
      try {
        // Define template metadata
        const templateMetadata: TemplateItem[] = [
          {
            id: 'datacenter-cloud',
            name: 'DataCenter to Cloud',
            description: 'Direct connection from datacenter to cloud services',
            category: 'enterprise'
          },
          {
            id: 'cloud-to-cloud-local',
            name: 'Cloud to cloud - local',
            description: 'Connect cloud providers in the same region',
            category: 'enterprise'
          },
          {
            id: 'cloud-to-cloud-inter-region',
            name: 'Cloud to cloud - inter region',
            description: 'Connect cloud providers across different regions',
            category: 'enterprise'
          },
          {
            id: 'vpn-cloud',
            name: 'VPN to cloud',
            description: 'Secure VPN connection to cloud services',
            category: 'security'
          },
          {
            id: 'internet-to-cloud',
            name: 'Internet to cloud',
            description: 'Direct internet connectivity to cloud services',
            category: 'basic'
          },
          {
            id: 'hybrid-multi-cloud',
            name: 'Hybrid multi-cloud',
            description: 'Combined internet and VPN access to multiple clouds',
            category: 'enterprise'
          },
          {
            id: 'cloud-router',
            name: 'Cloud Router',
            description: 'Dual router setup with Internet and AVPN networks',
            category: 'basic'
          }
        ];

        // Preload the preview for each template (but not the full template)
        const availableIds = getAvailableTemplateIds();
        const templatesWithPreview = templateMetadata
          .filter(tmpl => availableIds.includes(tmpl.id))
          .map(async (tmpl) => {
            try {
              // Only load the basic template for the preview
              const template = await loadTemplate(tmpl.id);
              return {
                ...tmpl,
                preview: template.preview
              };
            } catch (error) {
              console.error(`Error loading preview for template ${tmpl.id}:`, error);
              return tmpl;
            }
          });

        const loadedTemplates = await Promise.all(templatesWithPreview);
        setTemplates(loadedTemplates);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading templates:', error);
        setIsLoading(false);
      }
    }

    loadInitialTemplates();
  }, []);

  // Filter templates by category
  const filteredTemplates = activeCategory === 'all' 
    ? templates 
    : templates.filter(t => t.category === activeCategory);

  const categories = [
    { id: 'all', name: 'All Templates' },
    { id: 'enterprise', name: 'Enterprise Solutions' },
    { id: 'security', name: 'Security Focused' },
    { id: 'basic', name: 'Basic Templates' }
  ];

  const handleSelectTemplate = async (templateId: string) => {
    try {
      // Update UI state
      setSelectedTemplate(templateId);
      
      // Update the template in state to show it's loading
      setTemplates(prev => prev.map(t => 
        t.id === templateId ? { ...t, isLoading: true } : t
      ));
      
      // Load the full template
      const template = await loadTemplate(templateId);
      
      // Update the template in state to include the loaded data
      setTemplates(prev => prev.map(t => 
        t.id === templateId ? { ...t, template, isLoading: false } : t
      ));
      
      // Apply the template
      onApplyTemplate(template.nodes, template.edges);
    } catch (error) {
      console.error(`Error loading template ${templateId}:`, error);
      
      // Update state to show the error
      setTemplates(prev => prev.map(t => 
        t.id === templateId ? { ...t, isLoading: false } : t
      ));
      
      // Show error toast
      window.addToast({
        type: 'error',
        title: 'Template Error',
        message: `Failed to load the selected template.`,
        duration: 3000
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Category Tabs */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`px-3 py-1.5 text-figma-base font-medium rounded-full whitespace-nowrap transition-colors ${
              activeCategory === category.id
                ? 'bg-brand-blue text-white'
                : 'bg-fw-neutral text-fw-body hover:bg-fw-neutral'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
      
      {isLoading ? (
        // Loading state
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="animate-pulse bg-fw-base p-8 rounded-lg border-2 border-fw-secondary h-48">
              <div className="h-12 bg-fw-neutral rounded-lg mb-4"></div>
              <div className="h-4 bg-fw-neutral rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-fw-neutral rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map((item) => (
            <button
              key={item.id}
              onClick={() => handleSelectTemplate(item.id)}
              disabled={item.isLoading}
              className={`
                p-4 rounded-lg text-left transition-all duration-200 widget-card
                ${selectedTemplate === item.id
                  ? 'bg-brand-blue text-white'
                  : 'bg-fw-base border border-fw-secondary hover:border-brand-blue hover:shadow-md'
                }
                ${item.isLoading ? 'opacity-70 cursor-wait' : ''}
              `}
            >
              {item.preview?.icons && <TemplatePreview icons={item.preview.icons} />}
              
              <h3 className={`text-figma-base font-medium mb-1 ${
                selectedTemplate === item.id ? 'text-white' : 'text-fw-heading'
              }`}>
                {item.name}
                {item.isLoading && ' (Loading...)'}
              </h3>
              
              <p className={`text-figma-sm line-clamp-2 ${
                selectedTemplate === item.id ? 'text-white/80' : 'text-fw-bodyLight'
              }`}>
                {item.description}
              </p>
              
              {/* Category Badge */}
              <div className="mt-2">
                <span className={`inline-block px-2 py-0.5 text-figma-sm rounded-full ${
                  selectedTemplate === item.id
                    ? 'bg-white/20 text-white'
                    : item.category === 'enterprise'
                      ? 'bg-fw-accent text-fw-linkHover'
                      : item.category === 'security'
                        ? 'bg-green-50 text-fw-success'
                        : 'bg-fw-neutral text-fw-heading'
                }`}>
                  {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
      
      {/* Empty state when no templates match the filter */}
      {!isLoading && filteredTemplates.length === 0 && (
        <div className="text-center py-12 bg-fw-wash rounded-lg border border-fw-secondary">
          <p className="text-fw-bodyLight">No templates found in this category</p>
        </div>
      )}
    </div>
  );
}