import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../common/Button';
import LMCCWorkflowVisualization from '../connection/lmcc/LMCCWorkflowVisualization';

export default function AWSWorkflowPage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          size="sm"
          icon={ArrowLeft}
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
        <div>
          <h1 className="text-figma-xl font-bold text-fw-heading tracking-[-0.03em]">AWS Partner Integration Workflow</h1>
          <p className="text-figma-base text-fw-bodyLight mt-1">
            Complete end-to-end flow from AWS Console to NetBond Advanced provisioning
          </p>
        </div>
      </div>

      {/* Workflow Visualization */}
      <div className="bg-fw-base rounded-2xl border border-fw-secondary p-6">
        <LMCCWorkflowVisualization />
      </div>

      {/* Additional Resources */}
      <div className="mt-8 grid md:grid-cols-2 gap-6">
        <div className="bg-fw-base rounded-2xl border border-fw-secondary p-6">
          <h3 className="text-figma-lg font-semibold text-fw-heading mb-3">Quick Links</h3>
          <div className="space-y-2">
            <a
              href="https://console.aws.amazon.com/directconnect"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-figma-base text-fw-link hover:text-fw-linkHover hover:underline"
            >
              AWS Direct Connect Console
            </a>
            <button
              onClick={() => navigate('/manage', { state: { activeTab: 'marketplace' } })}
              className="block text-figma-base text-fw-link hover:text-fw-linkHover hover:underline"
            >
              View AWS Partner Zone
            </button>
            <button
              onClick={() => navigate('/tickets/create')}
              className="block text-figma-base text-fw-link hover:text-fw-linkHover hover:underline"
            >
              Create Support Ticket
            </button>
          </div>
        </div>

        <div className="bg-fw-accent rounded-2xl border border-fw-secondary p-6">
          <h3 className="text-figma-lg font-semibold text-fw-heading mb-3">Need Help?</h3>
          <p className="text-figma-base text-fw-body mb-4">
            Our support team is available 24/7 to assist with AWS Direct Connect integration
            and LMCC configuration.
          </p>
          <div className="space-y-2">
            <div className="text-figma-base">
              <span className="text-fw-bodyLight">Email:</span>{' '}
              <a href="mailto:support@att.com" className="text-fw-link hover:underline">
                support@att.com
              </a>
            </div>
            <div className="text-figma-base">
              <span className="text-fw-bodyLight">Phone:</span>{' '}
              <span className="text-fw-heading">1-800-ATT-HELP</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
